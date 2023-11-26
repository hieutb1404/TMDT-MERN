const ErrorHandler = require("../utils/ErrorHandler");
//add jsonwebtoken dung de lam bao mat truyen thong tin
const jwt = require("jsonwebtoken");
const catchAsyncErrors = require("./catchAsyncErrors");
const User = require("../model/user");
const Shop = require("../model/shop");
// đoạn code này đảm bảo chỉ có người dùng mới có thể truy cập vào tài nguyên bảo mật
// mà muốn dùng được tài nguyên ta phải truy lấy được token của người dùng sau khi đăng nhập
// nếu token ko tồn tại nghĩa là chưa đăng nhập thì ko thể truy cập tài nguyên và trả ra lỗi khi cố tình sử dụng tài nguyên
exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  //  khi người dùng đăng nhập thành công, máy chủ sẽ tạo ra một mã token và gửi nó về cho trình duyệt của người dùng thông qua cookies. Trình duyệt sẽ lưu trữ mã token trong cookies và gửi nó lại cho máy chủ trong mỗi yêu cầu.
  // do đó req.cookies sẽ nhận đc mã token khi đăng nhập đó
  const { token } = req.cookies;

  //  middleware này nhận token từ cookie bằng cách truy cập vào thuộc tính req.cookies.token. Nếu không tồn tại token, tức là người dùng chưa đăng nhập, bạn trả về một lỗi (ErrorHandler)
  if (!token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }
  // sử dụng phương thức verify của module jsonwebtoken (jwt) để xác minh tính hợp lệ của token.  truyền token và khóa bí mật
  //Nếu token hợp lệ, verify sẽ giải mã token và trả về đối tượng được giải mã (thông thường là thông tin người dùng) trong biến decoded.
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  //  sử dụng decoded.id để tìm người dùng trong cơ sở dữ liệu bằng phương thức findById của model User. Kết quả được gán vào req.user, để các route tiếp theo trong ứng dụng có thể truy cập thông tin người dùng đã xác thực.
  req.user = await User.findById(decoded.id);
  next();
});

// đoạn code này đảm bảo chỉ có người dùng mới có thể truy cập vào tài nguyên bảo mật
// mà muốn dùng được tài nguyên ta phải truy lấy được token của người dùng sau khi đăng nhập
// nếu token ko tồn tại nghĩa là chưa đăng nhập thì ko thể truy cập tài nguyên và trả ra lỗi khi cố tình sử dụng tài nguyên
exports.isSeller = catchAsyncErrors(async (req, res, next) => {
  //  khi người dùng đăng nhập thành công, máy chủ sẽ tạo ra một mã token và gửi nó về cho trình duyệt của người dùng thông qua cookies. Trình duyệt sẽ lưu trữ mã token trong cookies và gửi nó lại cho máy chủ trong mỗi yêu cầu.
  // do đó req.cookies sẽ nhận đc mã token khi đăng nhập đó
  const { seller_token } = req.cookies;

  //  middleware này nhận token từ cookie bằng cách truy cập vào thuộc tính req.cookies.token. Nếu không tồn tại token, tức là người dùng chưa đăng nhập, bạn trả về một lỗi (ErrorHandler)
  if (!seller_token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }
  // sử dụng phương thức verify của module jsonwebtoken (jwt) để xác minh tính hợp lệ của token.  truyền token và khóa bí mật
  //Nếu token hợp lệ, verify sẽ giải mã token và trả về đối tượng được giải mã (thông thường là thông tin người dùng) trong biến decoded.
  const decoded = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);
  //  sử dụng decoded.id để tìm người dùng trong cơ sở dữ liệu bằng phương thức findById của model User. Kết quả được gán vào req.user, để các route tiếp theo trong ứng dụng có thể truy cập thông tin người dùng đã xác thực.
  req.seller = await Shop.findById(decoded.id);
  next();
});

//...roles trong hàm isAdmin sẽ lấy ra một bản sao (copy) của mảng roles được truyền vào như là một danh sách các tham số. Điều này cho phép hàm xử lý một số lượng vai trò không cố định mà không cần phải biết chính xác số lượng vai trò trước đó.
exports.isAdmin = (...roles) => {
  return (req, res, next) => {
    // Nếu vai trò của người dùng (req.user.role) không thuộc danh sách các vai trò được chấp nhận, nó sẽ gọi lại middleware tiếp theo với một lỗi thông báo rằng người dùng không có quyền truy cập vào tài nguyên.
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`${req.user.role} can not access thi resourses!`)
      );
    }
    next();
  };
};
