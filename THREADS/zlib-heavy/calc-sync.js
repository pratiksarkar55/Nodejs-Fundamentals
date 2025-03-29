const { workerData, parentPort } = require("worker_threads");
const zlib = require("zlib");
const fs = require("fs");

const data = fs.readFileSync("./text.txt");

function compressSync() {
  try {
    // THIS WILL CAUSE CRASH IN 100_000 AS zlib.deflate holds the compression im memory
    // So we have to use batching and promises
    zlib.deflate(data, (err, buff) => {
      //  console.log("deflate done");
    });

    return "done";
  } catch (err) {
    console.error("An error occurred:", err);
    throw err;
  }
}

const totalIterations = workerData.count; // total number of times to compress

for (let i = 0; i < totalIterations; i++) {
  try {
    compressSync();
    // console.log("Done", i);
  } catch (err) {
    console.error("Error compressing:", err);
  }
}

parentPort.postMessage("done");
