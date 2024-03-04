function fileCopy() {
  const fs = require("fs").promises;
  const csv = require("csvtojson");
  (async () => {
    let readHandler = await fs.open("./src-csv.csv", "r");
    let writeHandler = await fs.open("./dest.txt", "w");
    const streamWrite = writeHandler.createWriteStream();
    const streamRead = readHandler.createReadStream();

    streamRead
      .pipe(csv())
      .on("data", (row) => {
        if (!streamWrite.write(row)) {
          streamRead.pause();
        }
      })
      .on("end", () => {
        readHandler.close();
        writeHandler.close();
        streamWrite.end();
      })
      .on("error", (error) => {
        console.error("Error:", error);
      });

    streamWrite.on("drain", () => {
      streamRead.resume();
    });
  })();
}

module.exports = fileCopy;
