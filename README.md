## Tool giúp dịch value của object sang ngôn ngữ đích bằng openAI

```
Đầu tiên vào trong open ai tạo 2 tài khoản để có được 2 secret key,
sau đó gán vào trong mảng secretKey này, limitLine sẽ là giới hạn để mỗi key thực hiện dịch,
sau đó đổi chỗ cho nhau.
```

![Ảnh config](images/read-config.png)

```
Thực hiện cài nodeJS sau đó chạy bằng terminal lệnh
# npm install
```

```
Để chạy demo việc dịch file js object nhiều level,
đọc từ file: test.js, chạy termial bằng lệnh
# npm run test
```

```
Copy text muốn dịch vào trong file: originalLangObject.js
chạy terminal lệnh dưới và đợi kết quả ở file: result.js
# npm run serve
```

```
Lưu ý: sẽ có những lúc chat GPT trả lời ra những câu thừa, thừa các ký tự đặc biệt
nên khi cố gắng parse từ text object 1 level về file javascript object nhiều level bị lỗi,
trường hợp lỗi có thể vào trong file result.txt ( kết quả gồm nhiều file json nhỏ gộp lại sau mỗi lần chatGPT response)
copy vào 1 file js bất kỳ để check các chỗ cú pháp lỗi là sẽ được file object hoàn chỉnh
# sau khi sửa chạy lệnh dưới để build lại về object nhiều tầng
# npm run merge
```

Hình dưới là object khi chưa dịch value, đây là 1 object có nhiều cấp
![Ảnh file đầu vào](images/input-test.png)
Hình dưới là object khi dùng tool sẽ được trải phẳng từ nhiều cấp về 1 cấp.
Sau này người dùng có thể xác định được cấp nào với cấp nào, tránh nhầm key các object con.
![Ảnh object được trải phẳng về 1 cấp](<images/multiple-level-object to single-level-object.png>)
Hình dưới là object khi đã dịch value, object ở dạng trải phẳng
![Ảnh file đầu ra dạng thô](images/translated-one-level-object.png)
Hình dưới là kết quả final khi object đã được trả về hình dạng nhiều cấp ban đầu và dịch thành công
![Ảnh file đầu ra dạng hoàn thiện](images/one-level-to-multiple-level-object.png)
Trường hợp chạy có thể văng exception, tra log tại file resultLog.txt
![log file](images/log-file.png)
File này sẽ chứa cả thông tin % file js được dịch
![loading success](images/log-success-percent-file.png)
File này sẽ chứa toàn bộ những ký tự đặc biệt cần replace trước khi thực hiện convert từ nhiều đoạn json trong file txt thành file javascript 1 object json duy nhất, sau khi convert xong sẽ trả lại về ký tự đặc biệt ban đầu
![special-key config](images/special-key-config.png)
Ví dụ chúng ta có từ khóa <{0}> được nhúng vào value của object, sẽ được replace theo file specialKey.js thành <<0>>
![replace-special-key](images/object-replaced-special-key.png)
Sau khi xử lý xong sẽ rollback ký tự đặc biệt ban đầu <<0>> thành <{0}>
![roll-back-special-key](images/object-rollback-special-key.png)
Tùy nhu cầu sử dụng người dùng tự thêm các cặp key value cần replace vào trong file specialKey.js.
