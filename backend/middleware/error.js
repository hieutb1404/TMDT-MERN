const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server Error";

  // wrong mongodb id error
  // Nếu lỗi là một lỗi CastError (thường xảy ra khi không tìm thấy tài nguyên với id đã cung cấp), một thông báo lỗi tương ứng được tạo và gán vào đối tượng lỗi err.
  // Mã trạng thái HTTP được thiết lập thành 400 (Bad Request).
  if (err.name === "CastErrror") {
    const message = `Resources not found with this id.. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Duplicate key error
  // Nếu lỗi là một lỗi trùng lặp khóa (duplicate key error) trong cơ sở dữ liệu, một thông báo lỗi tương ứng được tạo và gán vào đối tượng lỗi err.
  // Mã trạng thái HTTP được thiết lập thành 400 (Bad Request).
  if (err.code === 11000) {
    const message = `Duplicate key ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  //wrong jwt eror
  // Nếu lỗi là một lỗi xác thực JSON Web Token không hợp lệ, một thông báo lỗi tương ứng được tạo và gán vào đối tượng lỗi err.
  // Mã trạng thái HTTP được thiết lập thành 400 (Bad Request).
  if (err.name === "JsonWebTokenError") {
    const message = `Your url is invalid please try again letter`;
    err = new ErrorHandler(message, 400);
  }

  // jwt expried
  // Nếu lỗi là một lỗi xác thực JSON Web Token đã hết hạn, một thông báo lỗi tương ứng được tạo và gán vào đối tượng lỗi err.
  // Mã trạng thái HTTP được thiết lập thành 400 (Bad Request).
  if (err.name === "TokenExpiredError") {
    const message = `Your Url is expired please try again letter!`;
    err = new ErrorHandler(message, 400);
  }

  // Trả về phản hồi cho người dùng:
  // Mã trạng thái và thông báo lỗi từ đối tượng err được trả về dưới dạng phản hồi JSON với các thuộc tính success là false và message là thông báo lỗi.
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
