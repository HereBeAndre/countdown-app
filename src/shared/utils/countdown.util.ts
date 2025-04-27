const padStart = (target: number) => target.toString().padStart(2, '0')

export const formatCountdown = (delta: number) => {
  const days = Math.floor(delta / (1000 * 60 * 60 * 24))
  const hours = Math.floor((delta / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((delta / (1000 * 60)) % 60)
  const seconds = Math.floor((delta / 1000) % 60)

  const dayString = padStart(days)
  const hourString = padStart(hours)
  const minuteString = padStart(minutes)
  const secondString = padStart(seconds)

  return `${dayString} days, ${hourString} h, ${minuteString} m, ${secondString} s`
}
