const { workerData } = require("worker_threads");

const port = workerData.port;

port.on("message", (msg) => {
  console.log("Message received in Thread 2:");
  console.log(msg);
});

port.postMessage("Message sent from thead 2");
