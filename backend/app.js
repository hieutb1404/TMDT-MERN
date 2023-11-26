const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
//add thư viện vào biến app
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

// middleware được sử dụng để xử lý dữ liệu đầu vào từ yêu cầu HTTP. Nó được sử dụng để phân tích và chuyển đổi dữ liệu gửi từ client dưới dạng JSON thành đối tượng JavaScript.
// app.use(express.json()), Express sẽ phân tích và chuyển đổi dữ liệu gửi đến từ client dưới dạng JSON thành đối tượng JavaScript và lưu trữ trong req.body. Khi có dữ liệu trong req.body, bạn có thể truy cập và sử dụng dữ liệu đó trong các route handler để thực hiện các thao tác như truy vấn và ghi dữ liệu vào cơ sở dữ liệu
// dùng nó mới truy cập đc req.body và gọi nó được dữ liệu bằng req.body ra ngoài
// app.use này chủ yếu là dùng toàn cục
app.use(cookieParser());
app.use(express.json());
// ví ở backend là localhost:8000 bất đồng bộ với localhost:3000 khi chuyển api từ 8000 sang 3000 thì sẽ k lấy được vì URL khác nhau
// nên ở đây dùng thằng cors để có thể cho phép quyền truy cập chuyển api từ URL gốc của mình là localhost 8000 sang localhost fontend 3000
// lưu ý ở đây nó có thể lấy bất cứ URL lạ nào khác ngoài URL gốc
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:43928"], // Địa chỉ nguồn gốc của yêu cầu
    credentials: true,
  })
);

// Các tệp tin tĩnh được sử dụng để lưu trữ các tài nguyên không thay đổi của ứng dụng web như hình ảnh, CSS, JavaScript, các file font, video, vv. Điều này giúp tăng tốc độ tải trang và giảm tải cho server bằng cách phục vụ các tệp tin trực tiếp từ máy chủ thay vì thông qua route xử lý.
app.use("/", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true, litmit: "50mb" }));

//config
// để sử dụng process.env ta phải dùng thư viện dotenv
// kiểm tra giá trị trường env
//Nếu giá trị của NODE_ENV không phải là "PRODUCTION", nó sẽ sử dụng module dotenv để đọc các biến môi trường từ tệp .env tại đường dẫn "backend/config/.env".
if (process.env.NODE_ENV !== "PRODUCTION") {
  // sử dụng module dotenv để cấu hình biến từ môi trường .env
  // trường hợp này dotenv sẽ đọc các biến môi trường từ file .env
  // nghĩa là thằng dotenv này sẽ đọc tất cả biến từ trong .env và sư dụng process.env để gọi từng biến
  require("dotenv").config({
    path: "backend/config/.env",
  });
}

// import routes
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const event = require("./controller/event");
const coupon = require("./controller/coupounCode");
const payment = require("./controller/payment");
const order = require("./controller/order");
const conversation = require("./controller/conversation");
const message = require("./controller/message");

// routes
// trong user controller có thêm router là /create-user nên khi gọi /api/v2/user/, user nó sẽ thêm router trước đó là /api/v2/user/create-user
// nên khi gọi api bên ngoài sẽ phải gọi đầy đủ router từ trong ra ngoài là /api/v2/user/create-user (create-user là mình đã định nghĩa sẵn là middleware trong file user controller)
app.use("/api/v2/user", user);
app.use("/api/v2/conversation", conversation);
app.use("/api/v2/message", message);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/payment", payment);
app.use("/api/v2/order", order);

// it's for ErrorHandling
app.use(ErrorHandler);
module.exports = app;
