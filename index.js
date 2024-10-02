const mqtt  = require("mqtt");
const jsonfile = require("./jsondata.json");

let client = mqtt.connect("ws://sielcondev01.site:9105");
let topic = "sts/dashboard/local/CA_SLCN/Ms";
let cantMesas = 12;
let gameNumber = 1;

// let arrayP=[4,5,4,3,2,5,7,3,0,6];
// arrayP.pop();
// arrayP.push(44);
// arrayP.fill(33,1,6);
// console.log(arrayP);


client.on("connect", () => {
    console.log("Connected to MQTT Broker");
});

client.subscribe(topic, (err) => {
    if (err) {
        console.error(`Error subscribing to topic ${topic}:`, err);
        return;
    }
    console.log(`Subscribed to topic ${topic}`);   
});

    setInterval(() => {
        for (let i = 1; i<=cantMesas; i++) {
            const message = JSON.stringify(modJson(jsonfile,i));
            client.publish(`${topic}${(i)}`, message)
        }
        gameNumber++;
    }, 3000)
    
    function modJson(datajson,i) {
    let tableDataNew = [...jsonfile.tableData];
    let valRandom = Math.floor(Math.random() * cantMesas) + 1;
    tableDataNew[1] = valRandom;
    tableDataNew[3] = `Table ${valRandom}`;
    tableDataNew[5] = `t${valRandom.toString().padStart(2,"0")}`;
    tableDataNew[7] = "00:15:5d:25:"+ valRandom.toString().padStart(2,"0") +":bd_8021_9021";

    let winningNumbersDataNew = [...jsonfile.winningNumbersData];
    winningNumbersDataNew.pop();
    winningNumbersDataNew.push([
        72,
        "2024-09-20T19:34:38.411Z",
        69,
        25,
        19,
        true,
        true,
        true,
        null,
        1
      ]);

    let nuevoDataJason = {
      ...datajson,
      ts: new Date().getTime(),
      gameNumber:gameNumber,
      tableData:tableDataNew,
      configData: seleccionarAleatorio(),
      WinningNumberData:jsonfile.winningNumbersData,
    };
        return nuevoDataJason;
    }

  function seleccionarAleatorio(){
    const valores = ['fr37', 'fr38', 'am38'];
    const indiceAleatorio = Math.floor(Math.random() * valores.length);
    return valores[indiceAleatorio];
  }