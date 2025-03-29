const generatePrimes = require("./prime-generator");
const { workerData, parentPort } = require("worker_threads");
const { count, startingNumber } = workerData;
const iCount = count;
const iStartingNumber = startingNumber;

const result = generatePrimes(iCount, iStartingNumber);
parentPort.postMessage(result);
//process.exit(0);

// parentPort.on("message", (msg) => {
//   console.log(msg);
//   console.log("starting numner is 2", iStartingNumber);
//   const result = generatePrimes(iCount, iStartingNumber);
//   parentPort.postMessage(result);
//   process.exit(0);
// });
