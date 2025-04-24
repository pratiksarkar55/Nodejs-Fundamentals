const { Worker } = require("worker_threads");

const data = Buffer.from(new SharedArrayBuffer(8));
let index = 0;
for (let i = 15; i < 23; i++) {
  index++;
  data[index] = i;
  console.log("Buffer is", data);
  new Worker("./calc.js", { workerData: { data: data.buffer } });
}

setTimeout(() => {
  console.log("Data is ", data);
}, 1000);

// const byteArray = new Uint8Array(new SharedArrayBuffer(8));
// byteArray[0] = 255;
// console.log(byteArray);
