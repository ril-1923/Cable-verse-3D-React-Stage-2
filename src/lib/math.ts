export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))

export const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

export const wrapAngle = (a: number) => {
  let r = (a + Math.PI) % (2 * Math.PI)
  if (r < 0) r += 2 * Math.PI
  return r - Math.PI
}
