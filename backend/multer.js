// thư viện multer để xử lý việc tải lên file từ client lên máy chủ.
const multer = require("multer");

// multer.diskStorage(). Đối tượng này sẽ xác định nơi lưu trữ và tên file cho các file được tải lên.
const storage = multer.diskStorage({
  // Trong phần destination, chúng ta đặt đường dẫn tới thư mục "uploads/" là nơi chúng ta muốn lưu trữ các file tải lên.
  destination: function (req, res, cb) {
    // cb là một tham số được truyền vào trong hàm callback của multer.diskStorage(). Nó là một hàm được cung cấp bởi Multer để được gọi khi các tác vụ lưu trữ và đặt tên file hoàn tất.
    // ong ngữ cảnh của diskStorage, cb được sử dụng để thông báo cho Multer về nơi lưu trữ và tên file cuối cùng của file được tải lên.
    // cb(null, "uploads/"): Đối số đầu tiên (null) được sử dụng để chỉ định rằng không có lỗi xảy ra. Đối số thứ hai ("uploads/") chỉ định đường dẫn thư mục đích, nơi mà file sẽ được lưu trữ.
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    //: Dòng này tạo một chuỗi số ngẫu nhiên để làm phần đuôi duy nhất cho tên file. Nó sử dụng Date.now() để lấy thời gian hiện tại và Math.random() để tạo một số ngẫu
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() + 1e9);
    // Dòng này lấy tên gốc của file từ file.originalName và sử dụng phương thức split(".") để tách phần mở rộng tệp tin ra khỏi tên gốc. Kết quả là một mảng chứa tên gốc của file.
    const filename = file.originalname.split(".")[0];
    // cb(null, filename + "_" + uniqueSuffix + ".png"): Đối số đầu tiên (null) được sử dụng để chỉ định rằng không có lỗi xảy ra. Đối số thứ hai là tên file cuối cùng, được tạo bằng cách kết hợp filename (tên gốc của file) với uniqueSuffix (một chuỗi số ngẫu nhiên được tạo) và phần mở rộng tệp tin (ở đây là ".png").
    cb(null, filename + "-" + uniqueSuffix + ".png");
  },
});
//  Dòng này xuất một middleware multer được cấu hình với storage (cấu hình lưu trữ file). Nó được export như một đối tượng upload, và sau đó có thể được sử dụng để xử lý việc tải lên file trong các tuyến (routes) khác của ứng dụng.
exports.upload = multer({ storage: storage });
