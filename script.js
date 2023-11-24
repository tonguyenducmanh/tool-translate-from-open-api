import fs from "fs/promises";
// import file
import config from "./config.js";
import mergeJson from "./mergeJson.js";
import translateByOpenAI from "./translateByOpenAI.js";
// chỉ bật 1 trong 2 dòng này, dòng 2 để test với số lượng key thấp
// import originalLangObject from "./input/originalLangObject.js";
import originalLangObject from "./input/originalLangObjectShort.js";

async function main() {
  await fs.writeFile(config.outputPath, "", (err) => {
    if (err) throw err;
  });
  if (config.limitLine && originalLangObject) {
    let objectKeys = Object.keys(originalLangObject);
    let pages = Math.ceil(objectKeys.length / config.limitLine);
    if (pages > 0) {
      let count = 0;
      // chia queue để đẩy lên dịch theo limit
      for (let i = 0; i < pages; i++) {
        let queueObject = Object.fromEntries(
          Object.entries(originalLangObject).slice(
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
  await mergeJson();
}
// tính toán số lần cần call api
main();
