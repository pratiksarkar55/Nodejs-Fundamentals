const { workerData, Worker } = require("worker_threads");
const { performance } = require("perf_hooks");

const startTime = performance.now();
const THREADS = 1;
const COUNT = 10;
const STARTINGNUMBER = 100_000_000_000_000;
let result = [];
let resultCount = 0;

for (let i = 0; i < THREADS; i++) {
  const thread = new Worker("./thread1", {
    workerData: { count: COUNT, startingNumber: STARTINGNUMBER + i * 300 },
  });

  const threadId = thread.threadId;

  console.log(`Thread ${threadId} started`);

  //thread.postMessage(`${threadId} started`);
  //thread.postMessage(`Message to thread 1 from main thread`);

  thread.on("message", (msg) => {
    result = result.concat(msg);
  });

  thread.on("error", (msg) => {
    console.log(`Error in ${threadId}`);
  });

  thread.on("exit", (code) => {
    // if (code === 0) {
    resultCount++;
    //}
    if (resultCount === THREADS) {
      const endTime = performance.now();
      console.log(result);
      console.log(`Finished in ${(endTime - startTime) / 1000} secs`);
    }
  });
}
