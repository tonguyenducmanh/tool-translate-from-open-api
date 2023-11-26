// import library
import OpenAI from "openai";
// import file
import config from "../config.js";
import logFile from "./logFile.js";
/**
 * hàm gọi vào openAI ChatGPT để dịch json value sang ngôn ngữ mong muốn
 */
export default async function translateByOpenAI(originalLangObject, count) {
  let result = null;
  try {
    if (config && config.translateJson) {
      let command = config.translateJson + JSON.stringify(originalLangObject);
      let openai = new OpenAI({
        apiKey: config.secretKey[count % config.secretKey.length], // defaults to process.env["OPENAI_API_KEY"]
      });
      let chatCompletion = await openai.chat.completions.create({
        messages: [{ role: config.roleCallGPT, content: command }],
        model: config.modelGPT,
      });
      if (
        chatCompletion &&
        chatCompletion.choices &&
        chatCompletion.choices[0] &&
        chatCompletion.choices[0].message
      ) {
        result = chatCompletion.choices[0].message.content;
      }
    }
  } catch (error) {
    await logFile(error, "translateByOpenAI");
  }
  return result;
}
