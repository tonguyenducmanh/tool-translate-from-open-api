/**
 * file thực hiện ghi log, ghi log lỗi, ghi kết quả dạng thô
 */
// import thư viện
import fs from "fs/promises";
import os from "os";

// import file
import config from "../config.js";
import util from "util";
/**
 * hàm có tác dụng log lại thông tin vào file resultLog.txt
 * @param message: thông tin cầnlog
 * @param methodName: tên method lưu log
 */
export async function logFile(message, methodName) {
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

/**
 * log thông tin vào file javascript
 * @param {*} result
 * @param {*} output
 */
export async function logFileJS(result, output) {
  try {
    await fs.writeFile(
      output,
      config.exportDefault +
        util.inspect(result, { depth: Infinity, compact: false }),
      (err) => {
        if (err) throw err;
      }
    );
  } catch (error) {
    console.log("logFileJS() error: " + error);
  }
}

/**
 * log kết quả vào file result.txt
 * @param {*} result
 */
export async function logResultText(result) {
  try {
    await fs.appendFile(config.outputPath, result, (err) => {
      if (err) throw err;
    });
  } catch (error) {
    console.log("logResultText() error: " + error);
  }
}

/**
 * xoa trang file result.txt
 * @param {*} result
 */
export async function clearResultText() {
  try {
    await fs.writeFile(config.outputPath, "", (err) => {
      if (err) throw err;
    });
  } catch (error) {
    console.log("clearResultText() error: " + error);
  }
}
