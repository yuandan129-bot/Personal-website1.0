import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uIntensity;
  uniform float uSpeed;

  // --- FBM noise ---
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 m = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = m * p * 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;

    // 拉伸 Y 轴 → 烟柱纵向拉长
    vec2 st = vec2(uv.x * aspect, uv.y);

    // 时间驱动上升 + 横向摇曳
    float t = uTime * uSpeed;
    vec2 p1 = st * 3.5 + vec2(sin(st.y * 8.0 + t * 0.6) * 0.3, -t * 0.5);
    vec2 p2 = st * 6.0 + vec2(cos(st.y * 5.0 + t * 0.4) * 0.2, -t * 0.7);
    vec2 p3 = st * 9.0 + vec2(sin(st.y * 12.0 + t * 0.8) * 0.15, -t * 0.9);

    // 多层 FBM 叠加 → 有机烟雾纹理
    float s  = fbm(p1) * 0.6;
    s += fbm(p2) * 0.3;
    s += fbm(p3) * 0.15;

    // 底部弧形收口：蒸汽从弧形杯口升腾，而非直角横切
    float centerX = 0.5;
    float arcWidth = 0.38;
    float arcDepth = 0.14;
    float dx = abs(uv.x - centerX) / arcWidth;
    float bottomCutoff = arcDepth * dx * dx;
    bottomCutoff = min(bottomCutoff, arcDepth);

    // 底部浓、顶部淡（烟从底部升腾、顶部消散）
    float yFade = 1.0 - uv.y;
    yFade *= smoothstep(0.0, 0.04, uv.y - bottomCutoff);
    yFade = pow(yFade, 2.2);

    // 左右边缘也做淡出
    float xFade = 1.0 - abs(uv.x - 0.5) * 2.0;
    xFade = smoothstep(0.0, 1.0, xFade);

    float alpha = s * yFade * xFade * uIntensity;
    alpha = smoothstep(0.12, 0.6, alpha);

    // 暖白色烟雾
    vec3 color = vec3(1.0, 0.96, 0.88);
    gl_FragColor = vec4(color, alpha * 0.55);
  }
`;

export default function SteamEffect({
  width = 200,
  height = 300,
  intensity = 1.0,
  speed = 1.0,
  style,
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let active = true;
    let animationFrameId;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.pointerEvents = 'none';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geom = new THREE.PlaneGeometry(2, 2);

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2() },
        uIntensity: { value: intensity },
        uSpeed: { value: speed },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geom, material);
    scene.add(mesh);

    const startTime = performance.now();

    const resize = () => {
      if (!active) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w <= 0 || h <= 0) return;
      renderer.setSize(w, h);
      material.uniforms.uResolution.value.set(w, h);
    };
    resize();

    const ro = new ResizeObserver(() => { if (active) resize(); });
    ro.observe(mount);

    const animate = () => {
      if (!active) return;
      material.uniforms.uTime.value = (performance.now() - startTime) / 1000;
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      active = false;
      cancelAnimationFrame(animationFrameId);
      ro.disconnect();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      material.dispose();
      geom.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, [intensity, speed]);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        pointerEvents: 'none',
        zIndex: 2,
        ...style,
      }}
    />
  );
}
