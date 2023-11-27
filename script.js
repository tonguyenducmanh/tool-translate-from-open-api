// import thư viện
import fs from "fs/promises";

// import file
import config from "./config.js";
import mergeJson from "./subFunction/mergeJson.js";
import translateByOpenAI from "./subFunction/translateByOpenAI.js";
import logFile from "./subFunction/logFile.js";
import checkFlag from "./subFunction/checkFlag.js";

import originalLangObject from "./input/originalLangObject.js";
import testObject from "./input/test.js";

// thêm cờ nhận biết có gọi vào chat gpt không
let notCallChatGPT = checkFlag(config.notCallChatGPT);
let runTest = checkFlag(config.runTest);

/**
 * hàm chạy chính của chương trình
 */
async function runTool() {
  try {
    // bắt đầu đo hiệu năng
    let startTime = performance.now();

    let targetObject = runTest ? testObject : originalLangObject;

    if (!notCallChatGPT) {
      if (config && targetObject) {
        // xóa trắng file output thô đi để ghi nhiều lần
        await fs.writeFile(config.outputPath, "", (err) => {
          if (err) throw err;
        });

        // trải phẳng object nhiều cấp thành object 1 cấp, chỉ giữ lại key value cấp nhỏ nhất
        let flattenObject = await prepareDataBeforeTranslate(targetObject);
        if (config.limitLine && flattenObject) {
          // tính toán số lần gọi openAI
          let objectKeys = Object.keys(flattenObject);
          let pages = Math.ceil(objectKeys.length / config.limitLine);
          if (pages > 0) {
            let count = 0;
            let countSuccess = 0;
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
                countSuccess++;
                await fs.appendFile(
                  config.outputPath,
                  result + config.splitResultChar,
                  (err) => {
                    if (err) throw err;
                  }
                );
                // Thêm log đã chạy thành công bao nhiêu %
                let logSuccessMes = config.logTranslateSuccess.replace(
                  config.keyReplace,
                  ((count / pages) * 100).toFixed(2)
                );
                await logFile(logSuccessMes);
              }
            }
          }
        }
      }
    }
    // convert từ nhiều result json thành 1 file object js
    await mergeJson();

    // kết thúc đo hiệu năng
    let endTime = performance.now();
    let messageLog = config.logTime.replace(
      config.keyReplace,
      Math.floor((endTime - startTime) / 1000 / 60)
    );
    await logFile(messageLog);
  } catch (error) {
    await logFile(error, "runTool");
  }
}

/**
 * hàm trải phẳng object từ nhiều cấp về object 1 cấp duy nhất, chỉ giữ lại cặp key value nhỏ nhất
 * @param {*} originalObject object chưa được trải phẳng
 * @returns object đã trải phẳng
 */
async function prepareDataBeforeTranslate(originalObject) {
  let result = {};

  try {
    for (const key in originalObject) {
      if (!originalObject.hasOwnProperty(key)) {
        continue;
      }

      if (
        typeof originalObject[key] == "object" &&
        originalObject[key] !== null
      ) {
        // nếu là object thì gọi đệ quy ddeer trải phẳng
        let flatObject = await prepareDataBeforeTranslate(originalObject[key]);
        for (let x in flatObject) {
          if (!flatObject.hasOwnProperty(x)) continue;

          result[key + config.seperateLevelChar + x] = flatObject[x];
        }
      } else {
        result[key] = originalObject[key];
      }
    }
  } catch (error) {
    await logFile(error, "prepareDataBeforeTranslate");
  }
  return result;
}

// điểm bắt đầu chạy của chương trình
runTool();
