const mqtt  = require("mqtt");
const jsonfile = require("./jsondata.json");

let client = mqtt.connect("ws://sielcondev01.site:9105");
let topic = "sts/dashboard/local/CA_SLCN/ts";

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
        for (let i = 0; i<20; i++) {
            client.publish(`${topic}${(i+1)}` , `${JSON.stringify(modJson(jsonfile,i))}`)
        }
    }, 3000)
    
    
function modJson(datajson,i) {
    let nuevoDataJason = {
      ...datajson, 
      ts:i,
      gameNumber: Math.floor(Math.random() * 37),
      configData: seleccionarAleatorio()
    };
    return nuevoDataJason
  }

  function seleccionarAleatorio(){
    const valores = ['fr37', 'fr38', 'am38'];
    const indiceAleatorio = Math.floor(Math.random() * valores.length);
    return valores[indiceAleatorio];
  }