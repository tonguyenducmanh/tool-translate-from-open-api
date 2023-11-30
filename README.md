## Tool giúp dịch value của object sang ngôn ngữ đích bằng openAI

### Mục lục

[1. Yêu cầu](#requirement)\
[2. Hướng dẫn](#tutorial)\
[3. Tra log](#log)\
[4. Xóa ký tự đặc biệt trong value JSON](#remove-special)\
[5. Object nhiều level thành 1 object 1 level](#simplified-object)\
[6. Rút gọn key của object](#short-link)

### <a name="requirement"></a> 1. Yêu cầu

> Máy tính có 2 tài khoản openai, lưu lại secretkey, cho vào config.js
>
> Cài đặt nodejs >= 16.0.0
>
> Cài đặt vscode để chạy nodejs
>
> Đọc kỹ file config.js để hiểu các cấu hình tùy chỉnh

### <a name="tutorial"></a> 2. Hướng dẫn

```
Tool sử dụng cơ chế chia file dịch
thành nhiều queue nhỏ dựa vào config limitLine trong config.js,1 dòng nhiều chữ
thì để limitLine nhỏ, 1 dòng ít chữ thì để limitLine lớn, 2 tài khoản mỗi khi chạy
xong số dòng ứng với limitLine sẽ switch cho nhau tránh ratelimit của openai
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
trường hợp lỗi có thể vào trong file result.txt ( nhiều object dạng JSON nhỏ)
copy vào 1 file js bất kỳ để check các chỗ cú pháp lỗi là sẽ được file object hoàn chỉnh
# sau khi sửa chạy lệnh dưới để build lại về object nhiều tầng
# npm run merge
```

### <a name="log"></a> 3. Tra log

Trường hợp chạy có thể văng exception, tra log tại file resultLog.txt
![log file](images/log-file.png)
File này sẽ chứa cả thông tin % file js được dịch
![loading success](images/log-success-percent-file.png)

### <a name="remove-special"></a> 4. Xóa ký tự đặc biệt trong value JSON
Mục đích tránh những lỗi không mong muốn khi json parse, json stringify.
Những ký tự đặc biệt được cấu hình trong config.js tại Key "specialKeyNeedReplace" sẽ được loại bỏ trước khi dịch, những ký tự này sẽ được chuyển đổi thành UUID, sau khi dịch sẽ rollback từ UUID về ký tự đặc biệt
![rexgex](images/regex.png)
ví dụ, bạn muốn loại bỏ những ký tự đặc biệt giữa 2 dấu "" thì dùng regex

```
 /\"(.*?)\"/gi
```

### <a name="simplified-object"></a> 5. Object nhiều level thành 1 object 1 level
Mục đích trải phẳng object thành 1 cấp.
Hình dưới là object khi chưa dịch value, đây là 1 object có nhiều cấp
![Ảnh file đầu vào](images/input-test.png)
Hình dưới là object khi dùng tool sẽ được trải phẳng từ nhiều cấp về 1 cấp.
Sau này người dùng có thể xác định được cấp nào với cấp nào, tránh nhầm key các object con.
![Ảnh object được trải phẳng về 1 cấp](<images/multiple-level-object to single-level-object.png>)
Hình dưới là object khi đã dịch value, object ở dạng trải phẳng
![Ảnh file đầu ra dạng thô](images/translated-one-level-object.png)
Hình dưới là kết quả final khi object đã được trả về hình dạng nhiều cấp ban đầu và dịch thành công
![Ảnh file đầu ra dạng hoàn thiện](images/one-level-to-multiple-level-object.png)

### <a name="short-link"></a>  6. Rút gọn key của object
Mục đích để số ký tự gửi đi được giảm thiểu.
Hình dưới là json đã được làm đơn giản hóa key
![Ảnh key được rút gọn](images/simplified-key-before-translate.png)
Hình dưới là store lưu những key được làm đơn giản hóa
![Ảnh key được lưu trữ trong object khác](images/simplified-key-store.png)
Hình dưới là sau khi json đã được khôi phục key ban đầu
![Ảnh key đã được khôi phục](images/simplified-key-translated-restored.png)
