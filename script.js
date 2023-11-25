// import thư viện
import fs from "fs/promises";

// import file
import config from "./config.js";
import mergeJson from "./subFunction/mergeJson.js";
import translateByOpenAI from "./subFunction/translateByOpenAI.js";

// chỉ bật 1 trong các dòng này
// import originalLangObject from "./input/originalLangObject.js";
// import originalLangObject from "./input/testObject.js";
import originalLangObject from "./input/testObjectMultiLevel.js";

/**
 * hàm chạy chính của chương trình
 */
async function runTool() {
  // bắt đầu đo hiệu năng
  let startTime = performance.now();

  if (config && originalLangObject) {
    // xóa trắng file output thô đi để ghi nhiều lần
    await fs.writeFile(config.outputPath, "", (err) => {
      if (err) throw err;
    });

    // trải phẳng object nhiều cấp thành object 1 cấp, chỉ giữ lại key value cấp nhỏ nhất
    let flattenObject = prepareDataBeforeTranslate(originalLangObject);
    if (config.limitLine && flattenObject) {
      // tính toán số lần gọi openAI
      let objectKeys = Object.keys(flattenObject);
      let pages = Math.ceil(objectKeys.length / config.limitLine);
      if (pages > 0) {
        let count = 0;
        // chia queue để đẩy lên dịch theo limit
        for (let i = 0; i < pages; i++) {
          let queueObject = Object.fromEntries(
            Object.entries(flattenObject).slice(
              i * config.limitLine,
              i * config.limitLine + config.limitLine
            )
          );
          let result = await translateByOpenAI(queueObject, count);
          count++;
          // lưu vào file kết quả
          if (result) {
            await fs.appendFile(
              config.outputPath,
              result + config.splitResultChar,
              (err) => {
                if (err) throw err;
              }
            );
          }
        }
      }
    }
    // convert từ nhiều result json thành 1 file object js
    await mergeJson();

    // kết thúc đo hiệu năng
    let endTime = performance.now();
    await fs.writeFile(
      config.outputLogPath,
      config.logTime.replace(
        config.keyReplace,
        Math.ceil((endTime - startTime) / 1000 / 60)
      ),
      (err) => {
        if (err) throw err;
      }
    );
  }
}

/**
 * hàm trải phẳng object từ nhiều cấp về object 1 cấp duy nhất, chỉ giữ lại cặp key value nhỏ nhất
 * @param {*} originalObject object chưa được trải phẳng
 * @returns object đã trải phẳng
 */
function prepareDataBeforeTranslate(originalObject) {
  let result = {};

  for (const key in originalObject) {
    if (!originalObject.hasOwnProperty(key)) {
      continue;
    }

    if (
      typeof originalObject[key] == "object" &&
      originalObject[key] !== null
    ) {
      // nếu là object thì gọi đệ quy ddeer trải phẳng
      let flatObject = prepareDataBeforeTranslate(originalObject[key]);
      for (let x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;

        result[key + config.seperateLevelChar + x] = flatObject[x];
      }
    } else {
      result[key] = originalObject[key];
    }
  }
  return result;
}

// điểm bắt đầu chạy của chương trình
runTool();
