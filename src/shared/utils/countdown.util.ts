export const formatCountdown = (delta: number) => {
  const days = Math.floor(delta / (1000 * 60 * 60 * 24));
  const hours = Math.floor((delta / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((delta / (1000 * 60)) % 60);
  const seconds = Math.floor((delta / 1000) % 60);

  return `${days} days, ${hours} h, ${minutes} m, ${seconds} s`;
};
