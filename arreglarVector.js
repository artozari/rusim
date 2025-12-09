// Vector principal
const winningNumbersData = [
  [115, "2024-12-04T21:16:52.773Z", 112, 16, 34, true, true, true, null, 1],
  [114, "2024-12-04T18:09:07.423Z", 111, 35, 34, true, true, true, null, 1],
  [113, "2024-12-04T18:05:05.371Z", 110, 12, 24, true, true, true, null, 1],
  [112, "2024-12-04T18:03:36.344Z", 109, 13, 30, true, true, true, null, 1],
  // ... otros subvectores
];
const vector = require("./jsonOriginal.json");

// Subvector de referencia (el primero)
const reference = winningNumbersData[0];

// Función para emparejar las posiciones internas
function emparejarSubvectores(data, reference) {
  return data.map((subvector) => {
    subvector[2] = subvector[0]; // Emparejar posición 2
    return subvector; // Devuelve el subvector modificado
  });
}

// Emparejar las posiciones internas
const vectoresEmparejados = emparejarSubvectores(vector.winningNumbersData, reference);

console.log(JSON.stringify(vectoresEmparejados));
