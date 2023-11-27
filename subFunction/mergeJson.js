import fs from "fs/promises";
import util from "util";
// import file
import config from "../config.js";
import logFile from "./logFile.js";

export default async function () {
  // convert file text nhiều kết quả về 1 json duy nhất
  let result = {};
  let data = await fs.readFile(config.outputPath, config.formatText, (err) => {
    if (err) throw err;
  });
  if (data) {
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
        arr.forEach((item) => {
          if (item && JSON.parse(item)) {
            result = { ...result, ...JSON.parse(item) };
          }
        });
      }
    } catch (error) {
      await logFile(error, "mergeJson");
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
