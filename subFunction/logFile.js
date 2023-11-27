// import thư viện
import fs from "fs/promises";
import os from "os";
// import file
import config from "../config.js";
/**
 * hàm có tác dụng log lại thông tin vào file resultLog.txt
 * @param message: thông tin cầnlog
 * @param methodName: tên method lưu log
 */
export default async function (message, methodName) {
  try {
    if (message && config.isLogInfo) {
      let currentTime = new Date().toLocaleString(config.logLocation);
      // nếu là lưu log lỗi thì chỉ cần lưu message thôi
      if (message && message.error && message.error.message) {
        message = message.error.message;
      }
      if (methodName) {
        message = `${methodName}(): ${message}`;
      }
      let messageLog = `${currentTime}: ${message} ${os.EOL}`;
      await fs.appendFile(config.outputLogPath, messageLog, (err) => {
        if (err) throw err;
      });
    }
  } catch (error) {
    console.log("logFile() error: " + error);
  }
}
