const { workerData } = require("worker_threads");

const port = workerData.port;

port.on("message", (msg) => {
  console.log("Message received in Thread 1:");
  console.log(msg);
});

port.postMessage("Message sent from thead 1");
