//decoder= 01->human readable
//encoder= encoder->01

const fs = require("fs").promises;
//open->read/write/append
// file descriptor - unique id assigned to memory when a file is opened.Helps in operations later
(async () => {
  //commands
  const CREATE_FILE = "create a file";
  const DELETE_FILE = "delete a file";
  const RENAME_FILE = "rename a file";
  const ADD_TO_FILE = "add to file";
  const createFile = async (path) => {
    console.log("path", path);
    try {
      const existingFileHandle = await fs.open(path, "r");
      //we already have the file
      existingFileHandle.close();
      return console.log("File already exists");
    } catch (err) {
      // don't have the file so create it
      const newFilehandle = await fs.open(path, "w");
      console.log("new file is created");
      newFilehandle.close();
    }
  };
  const deleteFile = async (path) => {
    try {
      //fs.rm -rf /ffffffff == removes everything from pc.
      await fs.unlink(path);
    } catch (err) {
      // we don't have the file
      console.log("File doesn't exists");
    }
  };
  const renameFile = async (path, newPath) => {
    // console.log("path now", path);
    // console.log("path renamed", newPath);
    try {
      await fs.rename(path, newPath);
    } catch (err) {
      // we don't have the file
      console.log("File doesn't exists", newPath);
    }
  };
  const addToFile = async (path, contents) => {
    try {
      const existingFileHandle = await fs.open(path, "a");
      // existingFileHandle.appendFile(contents, "utf-8");
      existingFileHandle.write(contents, "utf-8");
      //we already have the file
      existingFileHandle.close();
    } catch (err) {
      console.log("error while writting", err);
    }
  };
  const commandFileHanlder = await fs.open("./commands.txt", "r");
  commandFileHanlder.on("change", async () => {
    // file was changed
    console.log("File was changed");
    //get file size
    let { size } = await commandFileHanlder.stat();
    //alloc buffer equal to file size
    const buff = Buffer.alloc(size);
    //from where to fill in buffer
    const offSet = 0;
    //number of bytes read
    const length = buff.byteLength;
    //position to read files
    const position = 0;
    //we want to read contents of the file always from start to end
    await commandFileHanlder.read(buff, offSet, length, position);
    const command = buff.toString("utf-8");

    //create a file:
    // create a file <path>
    if (command.includes(CREATE_FILE)) {
      let textLength = CREATE_FILE.length;
      const filePath = command.substring(textLength + 1);
      createFile(filePath);
    }
    //delete a file
    if (command.includes(DELETE_FILE)) {
      let textLength = DELETE_FILE.length;
      const filePath = command.substring(textLength + 1);
      deleteFile(filePath);
    }
    //rename a file
    if (command.includes(RENAME_FILE)) {
      const filePath = command.split(" ")[3];
      const newFilePath = command.split(" ")[4];
      renameFile(filePath, newFilePath);
    }
    //add to file <path> value:
    if (command.includes(ADD_TO_FILE)) {
      let textLength = ADD_TO_FILE.length;
      let valueIndex = command.indexOf(" value:");
      console.log(valueIndex);
      const filePath = command.substring(textLength + 1, valueIndex);
      const contents = command.substring(
        command.indexOf("value:") + "value:".length
      );
      addToFile(filePath, contents);
    }
  });
  //watcher
  const watcher = fs.watch("./commands.txt");
  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHanlder.emit("change");
    }
  }
})();
