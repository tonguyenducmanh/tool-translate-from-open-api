import fs from "fs/promises";
import util from "util";
// import file
import config from "../config.js";
import logFile from "./logFile.js";

import specialKey from "./specialKey.js";

export default async function () {
  // convert file text nhiều kết quả về 1 json duy nhất
  let result = {};
  let data = await fs.readFile(config.outputPath, config.formatText, (err) => {
    if (err) throw err;
  });
  if (data) {
    // remove các từ khóa đặc biệt trước khi mergejson
    data = await replaceSpecialKey(data, specialKey);
    // lọc ra toàn bộ các đoạn bắt đầu bằng { và kết thúc bằng } đưa vào mảng
    try {
      let arr = [];
      while (data && data.length > 0 && data.length != "") {
        let startIndex = data.indexOf(config.openCurlyBracket);
        let nextIndex = data.indexOf(config.closeCurlyBracket) + 1;
        let temp = data.substring(startIndex, nextIndex);
        if (temp && temp != "") {
          arr.push(temp);
        }
        data = data.substring(nextIndex);
        if (
          startIndex == nextIndex - 1 ||
          !data.includes(config.openCurlyBracket) ||
          !data.includes(config.closeCurlyBracket)
        ) {
          break;
        }
      }
      if (arr) {
        arr.forEach(async (item) => {
          try {
            if (item && JSON.parse(item)) {
              result = { ...result, ...JSON.parse(item) };
            }
          } catch (error) {
            await logFile(error + item, "mergeJson: JSON.parse()");
          }
        });
      }
    } catch (error) {
      await logFile(error, "mergeJson");
    }

    //roll back lại toàn bộ ký tự đặc biệt đã thay thế ban đầu
    if (result) {
      result = await rollBackSpecialKey(result);
    }

    // đưa object trải phẳng về object nhiều level nếu có thể
    if (result) {
      result = await rollBackLevelObject(result);
    }

    // save vào file javascript
    if (result) {
      await fs.writeFile(
        config.outputJSPath,
        config.exportDefault +
          util.inspect(result, { depth: Infinity, compact: false }),
        (err) => {
          if (err) throw err;
        }
      );
    }
  }
}

/**
 * remove các từ khóa đặc biệt trước khi mergejson
 * @param {string} data chuỗi cần loại bỏ ký tự đặc biệt
 */
async function replaceSpecialKey(data, objectReplace) {
  try {
    if (data && objectReplace && typeof objectReplace == "object") {
      Object.keys(objectReplace).forEach((key) => {
        if (objectReplace.hasOwnProperty(key) && objectReplace[key]) {
          data = data.toString().replaceAll(key, objectReplace[key]);
        }
      });
    }
  } catch (error) {
    await logFile(error, "replaceSpecialKey");
  }
  return data;
}

/**
 * roll back lại toàn bộ ký tự đặc biệt đã thay thế ban đầu
 * @param {string} data chuỗi cần loại bỏ ký tự đặc biệt
 */
async function rollBackSpecialKey(data) {
  try {
    if (
      data &&
      typeof data == "object" &&
      specialKey &&
      typeof specialKey == "object"
    ) {
      let revertSpecialKey = await revertObject(specialKey);
      await Object.keys(data).forEach(async (key) => {
        if (data.hasOwnProperty(key) && data[key]) {
          data[key] = await replaceSpecialKey(data[key], revertSpecialKey);
        }
      });
    }
  } catch (error) {
    await logFile(error, "rollBackSpecialKey");
  }
  return data;
}

/**
 * hàm đảo ngược object dùng value làm key, dùng key làm value
 * @returns
 */
async function revertObject(data) {
  let result = data;
  try {
    if (data && typeof data == "object") {
      result = Object.fromEntries(
        Object.entries(data).map((x) => [x[1], x[0]])
      );
    }
  } catch (error) {
    await logFile(error, "revertObject");
  }
  return result;
}

/**
 * đưa object 1 level về thành object nhiều level
 * @param {*} originalObject object đã được trải phẳng
 * @returns object nhiều level giống cấu trúc ban đầu
 */
async function rollBackLevelObject(originalObject) {
  let result = {};
  try {
    if (originalObject) {
      for (const key in originalObject) {
        if (!originalObject.hasOwnProperty(key)) {
          continue;
        }

        // nếu chứa ký tự ngăn cách tức là object
        if (key.includes(config.seperateLevelChar)) {
          let parentKey = key.split(config.seperateLevelChar)[0];
          if (parentKey && !result.hasOwnProperty(parentKey)) {
            // tìm tất cả các key có chứa từ khóa này
            let subObject = Object.fromEntries(
              Object.entries(originalObject)
                .filter((x) => x[0].includes(parentKey))
                .map((x) => [
                  x[0].replace(parentKey + config.seperateLevelChar, ""),
                  x[1],
                ])
            );
            if (subObject) {
              // luôn gọi đệ quy để check xem trong object còn object nào khác không
              result[parentKey] = await rollBackLevelObject(subObject);
            }
          }
        } else {
          // không chưa ký tự ngăn cách thì gán thẳng value
          result[key] = originalObject[key];
        }
      }
    }
  } catch (error) {
    await logFile(error, "rollBackLevelObject");
  }
  return result;
}
