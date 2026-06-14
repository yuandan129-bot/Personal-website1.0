/**
 * 合并 className 字符串，过滤掉 falsy 值。
 * shadcn/ui 的 cn() 等价替代。
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
