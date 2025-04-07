const { workerData, parentPort } = require("worker_threads");
const sendRequest = require("./sendRequest");

(async () => {
  try {
    for (let i = 0; i < workerData.count; i++) {
      const data = await sendRequest(
        workerData.hostname,
        workerData.port,
        workerData.path,
        workerData.method
      );
      // console.log(`Data for ${i} is ${data}`);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();
