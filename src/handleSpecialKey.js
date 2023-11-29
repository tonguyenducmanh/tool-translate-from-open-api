// import thư viện
import { v4 as uuidv4 } from "uuid";

// import file
import config from "../config.js";
import { logFile, logFileJS } from "./logFile.js";
/**
 * remove các từ khóa đặc biệt trước khi dịch và lưu vào file js từ khóa đặc biệt
 * @param {string} data chuỗi cần loại bỏ ký tự đặc biệt
 */
export async function replaceSpecialKey(data) {
  try {
    if (data && typeof data == "object") {
      let specialObject = {};
      let regexArray = config.specialKeyNeedReplace;
      if (regexArray && regexArray.length > 0) {
        Object.keys(data).forEach((key) => {
          regexArray.forEach((regexKey) => {
            extractStringByRegex(data, key, specialObject, regexKey);
          });
        });
      }
      // lưu object key đặc biệt vào trong handleSpecialKey để sau này dùng lại
      if (specialObject && typeof specialObject == "object") {
        await logFileJS(specialObject, config.specialKeyPath);
      }
    }
  } catch (error) {
    await logFile(error, "replaceSpecialKey");
  }
  return data;
}

function extractStringByRegex(data, key, specialObject, regex) {
  if (data.hasOwnProperty(key) && data[key]) {
    let text = data[key];
    let resultMatchGroup = text.match(regex);
    if (resultMatchGroup && resultMatchGroup.length > 0) {
      resultMatchGroup.forEach((item) => {
        let newGuid = uuidv4();
        specialObject[newGuid] = item;
        text = text.replace(item, newGuid);
      });
      data[key] = text;
    }
  }
}

/**
 * roll back lại toàn bộ ký tự đặc biệt đã thay thế ban đầu
 * @param {string} data chuỗi cần loại bỏ ký tự đặc biệt
 */
export async function rollBackSpecialKey(data, specialKey) {
  try {
    if (
      data &&
      typeof data == "object" &&
      specialKey &&
      typeof specialKey == "object"
    ) {
      Object.keys(data).forEach((key) => {
        if (data.hasOwnProperty(key) && data[key]) {
          Object.keys(specialKey).forEach((item) => {
            if (specialKey.hasOwnProperty(item) && specialKey[item]) {
              data[key] = data[key].replace(item, specialKey[item]);
            }
          });
        }
      });
    }
  } catch (error) {
    await logFile(error, "rollBackSpecialKey");
  }
  return data;
}
