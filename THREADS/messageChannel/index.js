const { MessageChannel, Worker } = require("worker_threads");

const Ports = new MessageChannel();

const t1Port1 = Ports.port1;
const t1Port2 = Ports.port2;

new Worker("../THREADS/messageChannel/thread1.js", {
  workerData: { port: t1Port2 },
  transferList: [t1Port2],
});

t1Port1.on("message", (msg) => {
  console.log("Message Received in Main thread:");
  console.log(msg);
});

t1Port1.postMessage("Message from main thread 1");

const Ports2 = new MessageChannel();

const t2Port1 = Ports2.port1;
const t2Port2 = Ports2.port2;

t2Port1.on("message", (msg) => {
  console.log("Message Received in Main thread:");
  console.log(msg);
});

new Worker("../THREADS/messageChannel/thread2.js", {
  workerData: { port: t2Port2 },
  transferList: [t2Port2],
});

t2Port1.postMessage("Message from main thread t2Port1");
