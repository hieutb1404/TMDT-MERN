// ErrorHandler là một lớp (class) được định nghĩa để xử lý các lỗi trong ứng dụng. Lớp này mở rộng từ lớp Error có sẵn trong JavaScript.
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    //để thiết lập thông báo lỗi cho đối tượng.
    super(message);
    //Đây là mã trạng thái HTTP liên quan đến lỗi. Nó cho phép xác định mã trạng thái HTTP tương ứng khi xảy ra lỗi. Thuộc tính này được thiết lập khi tạo instance của lớp.
    this.statusCode = statusCode;

    //captureStackTrace được gọi trong constructor để ghi lại ngăn xếp của lỗi. Điều này giúp trong việc theo dõi và xác định nguồn gốc của lỗi.
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorHandler;
