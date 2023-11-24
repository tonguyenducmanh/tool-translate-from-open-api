export default {
  secretKey: [], // mã bí mật lấy từ trang https://platform.openai.com/api-keys
  translateJson: "return value of JSON in Korean Language", //câu lệnh sẽ chạy để build ra ngôn ngữ mới
  outputPath: "./output/result.txt", // đường dẫn kết quả
  outputLogPath: "./output/resultLog.txt", // đường dẫn kết quả
  outputJSPath: "./output/result.js", // file merge
  limitLine: 100, // số key giới hạn dịch 1 lần gọi tới chat GPT
  modelGPT: "gpt-3.5-turbo",
  roleCallGPT: "user",
  splitResultChar: ";;;;",
  formatText: "utf-8",
  exportDefault: "export default ",
  logTime: "thời gian chạy tổng cộng là: ",
};
