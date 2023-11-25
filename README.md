## Tool giúp dịch value của object sang ngôn ngữ đích bằng openAI

```
Đầu tiên vào trong open ai tạo 2 tài khoản để có được 2 secret key, sau đó gán vào trong mảng secretKey này, limitLine sẽ là giới hạn để mỗi key thực hiện dịch, sau đó đổi chỗ cho nhau.
```

![Ảnh config](images/read-config.png)

```
Thực hiện cài nodeJS sau đõ chạy bằng terminal lệnh
# npm install
```

```
Copy text muốn dịch vào trong file "originalLangObject.js"
chạy terminal lệnh dưới và đợi kết quả ở file "reuslt.js"
# npm run serve
```

Hình dưới là object khi chưa dịch value, đây là 1 object có nhiều cấp
![Ảnh file đầu vào](images/input-test.png)

Hình dưới là object khi đã dịch value, object ở dạng trải phẳng
![Ảnh file đầu ra](images/translated-one-level-object.png)
