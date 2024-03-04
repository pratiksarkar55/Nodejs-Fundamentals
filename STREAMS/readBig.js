const fs = require("fs").promises;

(async () => {
  let readHandler = await fs.open("./src.txt", "r");
  let WriteHandler = await fs.open("./dest.txt", "w");
  const streamWrite = WriteHandler.createWriteStream();
  const streamRead = readHandler.createReadStream({ highWaterMark: 64 * 1024 });
  let splitText;
  streamRead.on("data", (chunk) => {
    // console.log("----");
    // console.log(chunk.length); // default length is 65kb but we can change it also as above.
    // console.log("----");
    // console.log(chunk.toString("utf-8"));
    //  console.log("----");
    //Sometimes a large number can have some bytes in the next chunk.
    let splitArr = chunk.toString("utf-8").split(" ");
    // this will be in the next chunk
    if (splitArr[0] !== splitArr[1] - 1) {
      if (splitText) {
        splitArr[0] = splitText + splitArr[0];
        splitText = null;
      }
    }
    if (splitArr[splitArr.length - 1] !== splitArr[splitArr.length - 2] + 1) {
      splitText = splitArr[splitArr.length - 1];
    }
    console.log(splitArr);
    for (let i = 0; i < splitArr.length; i++) {
      let shouldWrite = splitArr[i] % 2 === 0 ? true : false;
      if (shouldWrite) {
        if (!streamWrite.write(splitArr[i] + "\n")) {
          streamRead.pause();
        }
      }
    }
  });

  streamWrite.on("drain", () => {
    streamRead.resume();
  });
})();
