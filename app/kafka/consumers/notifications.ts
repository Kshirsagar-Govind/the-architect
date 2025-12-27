// import { Kafka } from "kafkajs";
// import { vulnerabilityStatusNorification } from "./handlers/vulnerabilityStatus";

// async function startConsumer() {
//   const kafka = new Kafka({
//     clientId: "the-architect",
//     brokers: ["localhost:9092"],
//   });

//   const consumer = kafka.consumer({ groupId: "notification-group" });

//   await consumer.connect(); // ✅ await added
//   await consumer.subscribe({ topic: "notifications", fromBeginning: true }); // ✅ await added

//   await consumer.run({
//     eachMessage: async ({ message }) => {
//       console.log("RAW MESSAGE:", message);
//       console.log("RAW VALUE:", message.value);

//       if (!message.value) return;

//       const rawValue = message.value.toString();
//       const data = JSON.parse(rawValue);

//       console.log(data, "**************data**************", rawValue);

//       if (data.type === "VULN_STATUS_CHANGED") { // ✅ fixed
//         await vulnerabilityStatusNorification(data);
//       }

//       console.log("Notification received:", data);
//     },
//   });
// }

// startConsumer();
