const mqtt = require("mqtt");
const jsonfile = require("./jsondata.json");

let client = mqtt.connect("ws://sielcondev01.site:9105");
let topic = "sts1/dashboard/local/CA_SLCN/Ms";
let intrvalToPublish = 3000; //*expresado en milisegundos
let cantMesas = 12;
let gameNumber = 1;
let tableDataNew = [...jsonfile.tableData];
let configDataNew = [...jsonfile.configData];
let idDataBase = 1;
let maxHistory = 150;
let x = 0;
let y = 0;

const winningNumberArray = new Array(cantMesas);
for (let table = 0; table < cantMesas; table++) {
  // winningNumberArray[table]=[...winningNumbersDataNew];
  winningNumberArray[table] = [];
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

  tableDataNew[1] = i;
  tableDataNew[3] = `Table ${i.toString().padStart(2, 0)}`;
  tableDataNew[5] = `t${i.toString().padStart(2, "0")}`;
  tableDataNew[7] =
    "00:15:5d:25:" + i.toString().padStart(2, "0") + ":bd_8021_9021";
  tableDataNew[8] = "positionX";
  tableDataNew[9] = x;
  tableDataNew[10] = "positionY";
  tableDataNew[11] = y;
  tableDataNew[12] = "status";
  tableDataNew[13] = Math.floor(Math.random() * 3);

  configDataNew[32] = "status";
  configDataNew[33] = "red";

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
    tableData: tableDataNew,
    configData: configDataNew,
    winningNumbersData: winningNumberArray[i - 1],
  };

  return nuevoDataJason;
}

function seleccionarAleatorio() {
  const valores = ["fr37", "fr38", "am38"];
  const indiceAleatorio = Math.floor(Math.random() * valores.length);
  return valores[indiceAleatorio];
}

client.on("message", (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message.toString()}`);
});
