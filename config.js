export default {
  secretKey: ["replace me", "replace me too"], // mã bí mật lấy từ trang https://platform.openai.com/api-keys
  // cần có ít nhất 2 key để chạy vòng lặp thay phiên nhau tránh rate limit của open ai
  translateJson:
    "return value of JSON in Korean Language, every UUID in value will not change", //câu lệnh sẽ chạy để build ra ngôn ngữ mới
  outputPath: "./output/result.txt", // đường dẫn kết quả
  outputLogPath: "./output/resultLog.txt", // đường dẫn kết quả
  outputJSPath: "./output/result.js", // file merge
  specialKeyPath: "./output/specialKey.js", // file js lưu object các ký tự đặc biệt không dịch
  // danh sách ký tự cần replace, sử dụng biểu thức chính quy, replace các cặp {} và ""
  specialKeyNeedReplace: [
    /\{(.*?)\}/gi,
    /\"(.*?)\"/gi,
    /\#(.*?)\#/gi,
    /\##(.*?)\##/gi,
    /\###(.*?)\###/gi,
  ],
  limitLine: 50, // số key giới hạn dịch 1 lần gọi tới chat GPT
  modelGPT: "gpt-3.5-turbo", // model chat gpt sẽ sử dụng
  roleCallGPT: "user",
  splitResultChar: ";;;;",
  formatText: "utf-8",
  exportDefault: "export default ", // từ khóa thêm vào đầu json để biến thành mẫu export default object javascript
  logTime: "Thời gian chạy tổng cộng là: {0} phút",
  logTranslateSuccess: "Đã dịch được: {0}%",
  startLog: "Bắt đầu thực hiện dịch",
  isLogInfo: true,
  keyReplace: "{0}",
  seperateLevelChar: ".", // khi làm phẳng object thì dùng ký tự này để ngăn cách các level object,
  notCallChatGPT: "-f", // có gọi vào chat gpt không hay chỉ convert từ kết quả thô về kết quả object
  runTest: "-t", // có chạy dữ liệu test không
  logLocation: "vn-VN", // định dạng ngày tháng khi ghi log
  openCurlyBracket: "{", // dấu mở ngoặc định dạng JSON
  closeCurlyBracket: "}", // dấu đóng ngoặc định dạng JSOn
};
