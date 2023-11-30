/**
 * file thực hiện rút gọn key của object trước khi dịch
 * do chat gpt giới hạn 2000 ký tự, nên key không cần thiết sẽ được replace đi
 */
// thư viện
import JSON5 from "json5";
// file local
import config from "../config.js";
import { logFile } from "./logFile.js";
/**
 * hàm rút gọn key của object
 * @param {*} data object rút gọn key - chỉ chấp nhận data có 1 level (đã trải phẳng từ nhiều level xuống)
 * @param {*} storeSimplified object lưu key được rút gọn sau còn khôi phục
 */
export async function makeSimplifiedObject(data, storeSimplified) {
  try {
    if (data && storeSimplified) {
      let dataTransformed = {};
      let count = 0;
      Object.keys(data).forEach((key) => {
        if (data.hasOwnProperty(key)) {
          let simplifiedKey = count;
          dataTransformed[simplifiedKey] = data[key];
          storeSimplified[simplifiedKey] = key;
          data[simplifiedKey] = data[key];
          delete data[key];
          count++;
        }
      });
    }
  } catch (error) {
    await logFile(error + item, "simplifiedKey: makeSimplifiedObject()");
  }
}

/**
 * hàm rút gọn key của object
 * @param {*} data muốn bỏ rút gọn key
 * @param {*} storeSimplified object lưu key được rút gọn sau còn khôi phục
 */
export async function undoSimplifiedObject(data, storeSimplified) {
  let result = {};
  try {
    if (data && storeSimplified && config.regexJson) {
      if (typeof data == "object") {
        result = data;
      } else {
        let temp = data
          .toString()
          .replace(/\n/g, " ")
          .match(config.regexJson)[0];
        if (temp) {
          result = JSON5.parse(temp);
        }
      }
      Object.keys(storeSimplified).forEach((key) => {
        if (storeSimplified.hasOwnProperty(key)) {
          let value = result[key];
          result[storeSimplified[key]] = value;
          delete result[key];
        }
      });
    }
  } catch (error) {
    await logFile(error + item, "simplifiedKey: undoSimplifiedObject()");
  }
  return result;
}
