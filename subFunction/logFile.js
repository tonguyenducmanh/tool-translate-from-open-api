// import thư viện
import fs from "fs/promises";
import os from "os";
// import file
import config from "../config.js";
/**
 * hàm có tác dụng log lại thông tin vào file resultLog.txt
 * @param message: thông tin cầnlog
 */
export default async function (message) {
  if (message) {
    let messageLog = `${new Date().toJSON()}: ${message} ${os.EOL}`;
    await fs.appendFile(config.outputLogPath, messageLog, (err) => {
      if (err) throw err;
    });
  }
}
