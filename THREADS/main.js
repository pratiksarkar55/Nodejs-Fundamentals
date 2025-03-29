const { Worker, workerData } = require("worker_threads");

new Worker("./worker1.js", {
  workerData: "Hello from main thread",
});

// console from worker thread happens via main thread.So if main thread is blocked, worker thread won't be able to console.
//while (true) {}
