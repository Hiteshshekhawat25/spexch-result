export function formatNumber(number) {
  if (parseFloat(number) >= 1000) {
      return Math.floor(parseFloat(number) / 1000) + 'K';
  } else {
      return Math.floor(parseFloat(number));
  }
}