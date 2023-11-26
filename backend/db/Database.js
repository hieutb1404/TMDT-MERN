const mongoose = require("mongoose");

// kết nối database
// vì DB_URL kết nối đường dẫn trực tiếp sẵn có chứ không phải mình tự tạo ra nên có thể dùng trực tiếp process.env.
// còn nếu mình tạo bằng tay như PORT ... thì phải dùng dotenv
const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`mongod connected with server: ${data.connection.host}`);
    });
};

module.exports = connectDatabase;
