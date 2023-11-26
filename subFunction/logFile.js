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
  try {
    if (message) {
      let currentTime = new Date().toLocaleString("vn-VN");
      let messageLog = `${currentTime}: ${message} ${os.EOL}`;
      await fs.appendFile(config.outputLogPath, messageLog, (err) => {
        if (err) throw err;
      });
    }
  } catch (error) {
    console.log("logFile() error: " + error);
  }
}
