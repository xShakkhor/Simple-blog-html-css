export function hashUnit(seed) {
  const value = Math.sin(seed * 12.9898) * 43758.5453123
  return value - Math.floor(value)
}

export function rangeFromSeed(seed, min, max) {
  return min + (max - min) * hashUnit(seed)
}

export function intFromSeed(seed, max) {
  return Math.floor(hashUnit(seed) * max)
}
