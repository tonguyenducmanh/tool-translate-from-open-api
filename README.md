# tool-translate-from-open-api
tool dịch tự động file localize của frontend bằng cách chia nhỏ file ra thành từng queue, mỗi queue có số dòng theo file config.js và sử dụng random secretkey để tránh bị báo trùng
tool sẽ đọc response từ chat gpt về, sau đó ghép tất cả các json lại thành 1 json hoàn chỉnh trong file result.js và log thời gian chạy trong file resultLog.txt
