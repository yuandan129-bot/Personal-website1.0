import { useState, useEffect } from 'react'

/**
 * usePageVisible — 检测页面/标签页是否可见
 *
 * 当用户切换到其他标签页或最小化窗口时返回 false，
 * 用于暂停 rAF / WebGL 等持续渲染循环以节省 CPU。
 *
 * @returns {boolean} 页面当前是否可见
 */
export default function usePageVisible() {
  const [visible, setVisible] = useState(() =>
    typeof document !== 'undefined' ? !document.hidden : true,
  )

  useEffect(() => {
    const onChange = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [])

  return visible
}
