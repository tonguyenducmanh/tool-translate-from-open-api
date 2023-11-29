/**
 * kiểm tra cờ và trả về kết quả
 * @param {*} flagName tên cờ cần check
 * @returns xem có bật cờ không
 */
export default function (flagName) {
  let result = false;
  if (
    process &&
    process.argv &&
    process.argv[2] &&
    process.argv[2] === flagName
  ) {
    result = true;
  }
  return result;
}
