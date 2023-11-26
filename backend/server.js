const app = require("./app");
const connectDatabase = require("./db/Database");
const cloudinary = require("cloudinary");

// handling uncaught Exception (xử lý ngoại lệ chưa được phát hiện)
// Sự kiện "uncaughtException" được sử dụng để xử lý các ngoại lệ chưa được phát hiện trong ứng dụng Node.js
// Các ngoại lệ có thể là các lỗi cú pháp, lỗi logic, lỗi hệ thống, lỗi kết nối mạng, và nhiều loại lỗi khác.
// nếu phát hiện nó tự động đóng server
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server for handling uncaught exception `);
});

//config
// kiểm tra giá trị ở biến trong .env , giá trị đó có khác "PRODUCTION" hay không, nếu không có sẽ đi được vào path .env
// để sử dụng process.env ta phải dùng thư viện dotenv
if (process.env.NODE_ENV !== "PRODUCTION") {
  // sử dụng module dotenv để cấu hình biến từ môi trường .env
  // trường hợp này dotenv sẽ đọc các biến môi trường từ file .env
  // nghĩa là thằng dotenv này sẽ đọc tất cả biến từ trong .env và sư dụng process.env để gọi từng biến
  require("dotenv").config({
    path: "backend/config/.env",
  });
}

// connect db
connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// create server
// để sử dụng process.env ta phải dùng thư viện dotenv
// vì thằng app đã dùng dotenv để lấy ra toàn bộ .env rồi nền ta có thể gọi được biến trong .env
// app.listen() được sử dụng để khởi động server và lắng nghe các kết nối đến từ client.
// Giá trị của cổng (port) được đặt trong biến môi trường process.env.PORT, cho phép bạn cấu hình cổng mà server sẽ lắng nghe.
// sau khi lắng nghe kết nối thành công nó sẽ callback biến PORT trong .env để gán vào localhost
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

// unhandled promise rejection (hủy xử lý khi thất bại)
// process.on("unhandledRejection") được sử dụng để xử lý các promise rejection (sự thất bại của promise) chưa được xử lý.
//process.on("unhandledRejection") sẽ được gọi. Trong đoạn mã, hàm callback in ra một thông báo cho biết server đang được tắt do promise rejection xảy ra và đưa ra lý do cụ thể của promise rejection (err.message).
//server.close() được gọi để đóng server. Sau khi server được đóng hoàn toàn, process.exit(1) được gọi để kết thúc quá trình Node.js với mã thoát là 1 (thường được sử dụng để chỉ ra rằng quá trình đã kết thúc với lỗi).
//giúp đảm bảo rằng khi có một promise rejection không được xử lý, server sẽ tự động tắt và chương trình Node.js sẽ thoát với mã thoát là 1, giúp bạn nắm bắt và xử lý các lỗi không được xử lý một cách chính xác.
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`shutting down the server for unhandled promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});
