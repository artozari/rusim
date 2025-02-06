const mqtt = require("mqtt");
const jsonfile = require("./jsondata.json");

let client = mqtt.connect("ws://sielcondev01.site:9105");
let topic = "sts/dashboard/local/CA_SLCNSist/Ms";
let intrvalToPublish = 3000; //*expresado en milisegundos
let cantMesas = 10 //# La cantidad de mesas a publicar
let gameNumber = 1;
let cantPlanos = 3;
let layout = 0;
let tableDataNew = [...jsonfile.tableData];
let configDataNew = [...jsonfile.configData];
let status = [];
let casinoDataNew = [...jsonfile.casinoData];
let idDataBase = 1;
let maxHistory = 150;
let x = 0;
let y = 0;
let positions = generatePositions(cantMesas);
console.log(positions);

const winningNumberArray = new Array(cantMesas);
for (let table = 0; table < cantMesas; table++) {
  winningNumberArray[table] = [];
}

function generatePositions(cantMesas) {
  let positions = [];
  let x = 0;
  let y = 0;
  for (let i = 0; i < cantMesas; i++) {
    positions.push([x, y]);
    x += 105;
    if (x > 800) {
      x = 0;
      y += 130;
    }
  }
  return positions;
}

client.on("connect", () => {
  console.log("Connected to MQTT Broker");
});

client.on("error", (err) => {
  console.error("MQTT Error:", err);
});

client.subscribe(topic, (err) => {
  if (err) {
    console.error(`Error subscribing to topic ${topic}:`, err);
    return;
  }
  console.log(`Subscribed to topic ${topic}`);
});

setInterval(() => {
  console.log(gameNumber);
  for (let i = 1; i <= cantMesas; i++) {
    // let sendOrNot = Math.random() < 0.5;//# para enviar mesas de forma aleatoria.
    let sendOrNot = true; //# Enviar siempre la cantidad establecida de mesas.
    if (sendOrNot) {
      if (i <= 2) {
        layout = 1;
      } else {
        layout = 2;
      }
      const message = JSON.stringify(modJson(jsonfile, i));
      client.publish(`${topic}${i}`, message);
    }
    x = x + 105;
    if (x >= 630) {
      x = 0;
      y = y + 150;
    }
    if (y >= 300) {
      y = 0;
    }
  }
  gameNumber++;
}, intrvalToPublish);

function modJson(datajson, i) {
  let currently = Date.now();

  casinoDataNew[14] = "cantPlanos";
  casinoDataNew[15] = Math.floor(Math.random() * 2) + 1;

  tableDataNew[1] = i;
  tableDataNew[3] = `Table ${i.toString().padStart(2, 0)}`;
  tableDataNew[5] = `t${i.toString().padStart(2, "0")}`;
  tableDataNew[6] = `tableNumber`;
  tableDataNew[7] = i;
  tableDataNew[8] = "key";
  tableDataNew[9] =
    "00:15:5d:25:" + i.toString().padStart(2, "0") + ":bd_8021_9021";
  tableDataNew[10] = "positionX";
  tableDataNew[11] = positions[i - 1][0];
  tableDataNew[12] = "positionY";
  tableDataNew[13] = positions[i - 1][1];
  tableDataNew[14] = "layout";
  tableDataNew[15] = layout;
  tableDataNew[16] = "noSmoking";
  tableDataNew[17] = true;

  configDataNew[30] = "language";
  configDataNew[31] = "es";
  configDataNew[32] = "language2";
  configDataNew[33] = "en";
  configDataNew[34] = "language3";
  configDataNew[35] = "OFF";

  status[0] = "semaphore";
  status[1] = seleccionarColorAleatorio();

  if (winningNumberArray[i - 1].length >= maxHistory) {
    winningNumberArray[i - 1].pop();
  }

  winningNumberArray[i - 1].unshift([
    idDataBase,
    currently.toString(),
    gameNumber,
    Math.floor(Math.random() * 37),
    Math.floor(Math.random() * 30) + 10,
    true,
    true,
    true,
    null,
    i,
  ]);
  idDataBase++;

  let nuevoDataJason = {
    ...datajson,
    ts: currently,
    gameNumber: gameNumber,
    casinoData: casinoDataNew,
    tableData: tableDataNew,
    configData: configDataNew,
    winningNumbersData: winningNumberArray[i - 1],
    status: status,
  };

  return nuevoDataJason;
}

function seleccionarAleatorio() {
  const valores = ["fr37", "fr38", "am38"];
  const indiceAleatorio = Math.floor(Math.random() * valores.length);
  return valores[indiceAleatorio];
}
function seleccionarColorAleatorio() {
  const valores = ["red", "green", "yellow"];
  const indiceAleatorio = Math.floor(Math.random() * valores.length);
  return valores[indiceAleatorio];
}

client.on("message", (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message.toString()}`);
});
