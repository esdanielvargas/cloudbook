/* Abreviación de números grandes. */
export default function abbrNumber(counter) {
  if (typeof counter !== "number" || isNaN(counter)) {
    return "???";
  }

  const units = [
    "",
    "K",
    "M",
    "B",
    "T",
    "P",
    "E",
    "Z",
    "Y",
    "GOL",
    "ULTRA",
    "MAX",
    "PRO",
  ];

  let unitIndex = 0;

  while (counter >= 1000 && unitIndex < units.length - 1) {
    counter /= 1000;
    unitIndex++;
  }

  return counter.toFixed(1).replace(/\.0$/, "") + units[unitIndex];
}
