export default {
  secretKey: ["replace me", "replace me too"], // mã bí mật lấy từ trang https://platform.openai.com/api-keys
  // cần có ít nhất 2 key để chạy vòng lặp thay phiên nhau tránh rate limit của open ai
  translateJson: "return value of JSON in Korean Language", //câu lệnh sẽ chạy để build ra ngôn ngữ mới
  outputPath: "./output/result.txt", // đường dẫn kết quả
  outputLogPath: "./output/resultLog.txt", // đường dẫn kết quả
  outputJSPath: "./output/result.js", // file merge
  limitLine: 100, // số key giới hạn dịch 1 lần gọi tới chat GPT
  modelGPT: "gpt-3.5-turbo", // model chat gpt sẽ sử dụng
  roleCallGPT: "user",
  splitResultChar: ";;;;",
  formatText: "utf-8",
  exportDefault: "export default ", // từ khóa thêm vào đầu json để biến thành mẫu export default object javascript
  logTime: "Thời gian chạy tổng cộng là: {0} phút",
  keyReplace: "{0}",
  seperateLevelChar: ".", // khi làm phẳng object thì dùng ký tự này để ngăn cách các level object
};
