export default function currentDateMXN() {
  const currentDateMXN = new Date().toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return currentDateMXN
}