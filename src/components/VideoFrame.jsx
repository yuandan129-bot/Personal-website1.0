export default function VideoFrame({
  width = 640,
  height = 400,
  style,
  children,
}) {
  return (
    <div
      data-video-frame
      style={{
        position: 'absolute',
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        overflow: 'hidden',        // ★ 核心规则：框内内容不可溢出
        borderRadius: '4px',
        background: '#000000',
        border: '1px solid rgba(255,255,255,0.15)',
        zIndex: 5,
        ...style,
      }}
    >
      {/* 占位内容 —— 后续替换为视频/动效 */}
      {children || (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255,255,255,0.25)',
            fontSize: '14px',
            fontFamily: "'Montserrat', 'Inter', sans-serif",
            letterSpacing: '0.2em',
            userSelect: 'none',
          }}
        >
          VIDEO PLACEHOLDER
        </div>
      )}
    </div>
  )
}
