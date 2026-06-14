import { useState, useEffect } from 'react'

function pad(n) {
  return String(n).padStart(2, '0')
}

export default function LiveClock({ isDay = true }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // 12 小时制
  let hours = time.getHours() % 12
  if (hours === 0) hours = 12

  const minutes = pad(time.getMinutes())
  const seconds = pad(time.getSeconds())

  return (
    <div
      className="select-none"
      style={{
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 500,
        color: '#ffffff',
        fontSize: '50px',
        lineHeight: 1,
        display: 'flex',
        alignItems: 'center',
        letterSpacing: '1.22px',
        opacity: isDay ? 1 : 0.5,
        transition: 'opacity 1s ease',
      }}
    >
      {/* 小时 */}
      <span style={{ minWidth: '100px', textAlign: 'center', position: 'relative', left: '30px', fontWeight: 600, transform: 'scale(0.9)' }}>
        {pad(hours)}
      </span>

      {/* 秒数：上下排列，固定宽度 → 时/分位置不随秒数跳动 */}
      <span
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '26px',
          fontSize: '23px',
          lineHeight: 1.1,
          margin: '0 20px',
          opacity: 0.7,
          position: 'relative',
          left: '-3px',
          transform: 'scale(0.9)',
        }}
      >
        <span>{seconds[0]}</span>
        <span>{seconds[1]}</span>
      </span>

      {/* 分钟 */}
      <span style={{ minWidth: '100px', textAlign: 'center', position: 'relative', left: '-40px', fontWeight: 600, transform: 'scale(0.9)' }}>
        {minutes}
      </span>
    </div>
  )
}
