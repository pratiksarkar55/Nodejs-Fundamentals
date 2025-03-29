const { Worker, isMainThread, threadId } = require("worker_threads");

let a = 100; // creates a new copy each time in the new thread.

if (isMainThread) {
  new Worker("./isMainThread.js");
  a = 200;
  console.log("In main thread", a);
} else {
  console.log(`In ${threadId} thread  ${a}`);
}
