const DISTINCT_COLORS = [
  '#e74c3c', // Rouge vif
  '#3498db', // Bleu
  '#2ecc71', // Vert
  '#f39c12', // Orange
  '#9b59b6', // Violet
  '#1abc9c', // Turquoise
  '#e91e63', // Rose
  '#ff5722', // Orange profond
  '#00bcd4', // Cyan
  '#4caf50', // Vert clair
  '#ffc107', // Ambre
];

let colorIndex = 0;

export function getRandomColor() {
  const color = DISTINCT_COLORS[colorIndex % DISTINCT_COLORS.length];
  colorIndex++;
  return color;
}