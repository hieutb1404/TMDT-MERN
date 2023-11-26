const express = require("express");
const User = require("../model/user");
const CoupounCode = require("../model/coupounCode");
const path = require("path");
const router = express.Router();
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// xử lý trên router /create-user , với đối số 2 là upload nơi xử lý và chứa file ảnh multer, đối số 3 là middleware
// Sau khi người dùng gửi biểu mẫu này và bạn sử dụng upload.single('file'), req.file sẽ chứa thông tin về tệp tin được gửi qua biểu mẫu với tên là 'file'.
//  upload.single("file") trong Multer có nhiệm vụ đóng gói tệp tin được gửi từ biểu mẫu HTML và truyền nó cho Multer để xử lý.
// khi gọi api bên ngoài lấy dữ liệu với /api/v2/user/create-user(vì bên ngoài app.js mình add router gọi ra client cho nó là  /api/v2/user rồi mới đến file user /create-user) nó sẽ lọt vào đây để xử lý dữ liệu bên ngoài đó
router.post("/create-user", upload.single("file"), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // Tiếp theo, chúng ta sử dụng phương thức findOne của model User để tìm kiếm người dùng trong cơ sở dữ liệu với cùng địa chỉ email đã được cung cấp. Nếu tìm thấy người dùng có cùng email, điều này có nghĩa là người dùng đã tồn tại và chúng ta trả về một lỗi (ErrorHandler) với thông báo "User already exists" và mã lỗi 400. Chúng ta sử dụng return next() để chuyển lỗi đến middleware tiếp theo hoặc xử lý lỗi chung của ứng dụng.
    const userEmail = await User.findOne({ email });
    // nếu email đã tồn tại
    // Tóm lại, trong trường hợp email đã tồn tại, bạn xóa file tải lên (nếu có) và trả về thông báo lỗi "User already exists".
    if (userEmail) {
      // filename là thuộc tính thuộc req.file chứ ko phải trong form
      // import upload từ module Multer và sử dụng upload.single("file") trong middleware của router, nó sẽ cho phép bạn truy cập đến thông tin về file tải lên thông qua req.file.
      const filename = req.file.filename;
      // tạo đường dẫn tới file uploads/ với tên file ( dấu / thể hiện kế tiếp là thư mục con hoặc file con)
      const filePath = `uploads/${filename}`;
      //  phương thức fs.unlink để xóa file với đường dẫn filePath. fs.unlink là một phương thức của module fs trong Node.js dùng để xóa file.
      // nếu email tồn tại thì xóa file user (không tải file ảnh + thông tin người dùng lên server nữa)
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Error deleting file" });
        }
      });
      // gọi next với một lỗi ErrorHandler để chuyển lỗi đến middleware tiếp theo hoặc xử lý lỗi chung của ứng dụng. Lỗi này có thông báo "User already exists" và mã lỗi 400.
      return next(new ErrorHandler("User already exists", 400));
    }

    // filename là thuộc tính thuộc req.file chứ ko phải trong form
    // thông tin trong req.file được lấy từ upload.single('file') khi bạn sử dụng multer để xử lý tệp tin tải lên.
    //  khi bạn sử dụng upload.single('file'), multer sẽ xử lý yêu cầu HTTP (request) và trích xuất thông tin về tệp tin từ biểu mẫu (form) với tên là 'file'. Thông tin này sau đó được đặt trong đối tượng req.file để bạn có thể sử dụng trong mã của bạn.
    const filename = req.file.filename;
    const fileUrl = path.join(filename);

    const user = {
      name: name,
      email: email,
      password: password,
      avatar: fileUrl,
    };

    // truyen doi so user vao ham`
    const activationToken = createActivationToken(user);
    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    // nó sẽ đưa thông tin user muốn tạo vào User(model database) cho 1 bản sao mới vào gán vào newUser
    // sau đó await chờ tạo xong sẽ render ra kết quả và gán vào newUser
    // vì khi đưa thông tin tạo vào User nó đã xử lý logic trong đó và xử lý đưa lên server.js, dựa trên Key URL_DB .env mà ta đã nhập từ web mongodb vào nên khi tạo dữ liệu nó tự động đẩy lên web dựa vào key
    // vì ta đặt config là run server.js khi chạy lên web nên mọi thứ xử lý đều dựa database.js và server.js
    try {
      // sendMail được gọi và truyền các đối số vào để gửi email. Các đối số này bao gồm thông tin cần thiết như địa chỉ email của người nhận, tiêu đề và nội dung email.
      // nó sẽ render ra vào gửi vào hàm sendMail
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        message: `Hello ${user.name}, please click on the link to activate your account ${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `please check your email:- ${user.email} to activate your account!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message), 500);
    }
  } catch (error) {
    return next(new ErrorHandler(error.message), 400);
  }
});
// create activation token
// nhận tham số user đầu vào mà ở trên đã truyền đối số user
const createActivationToken = (user) => {
  // jwt.sign tạo Json web token bảo mật với 2 tham số đầu vào là user và khóa bí mật.
  // sau khi nhận được nó tự động mã hóa 2 tham số này là (thông tin user , khóa bí mật) sang thành mã hóa dưới dạng chuỗi số token (vd: mã sẽ thành là: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9)
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    // Đối số thứ ba là một đối tượng cấu hình cho JWT, trong trường hợp này bạn đặt expiresIn là "5m" để đặt thời hạn hết hạn cho mã kích hoạt là 5 phút.
    // Nếu người dùng không xác nhận tài khoản trong khoảng thời gian 5 phút, mã kích hoạt sẽ hết hạn và không còn khả năng xác thực được. Khi mã kích hoạt hết hạn, người dùng sẽ không thể xác minh tài khoản và sẽ cần phải đăng ký lại thông tin tài khoản mới để nhận mã kích hoạt mới.
    expiresIn: "5m",
  });
};
// activation user (xác minh khi tạo tại khoản)
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      // lấy thông tin người dùng req.body đưa vào activation_token
      const { activation_token } = req.body;
      // jwt.verify dùng để xác minh sau sử khi sụng jwt.sign
      // gửi gửi token vào google click vào thì tự động hàm jwt.verify sẽ đc xác minh người dùng
      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      // nếu mà xác minh không phải thông tin người dùng hoặc khác token thì lỗi
      if (!newUser) {
        return next(new ErrorHandler("Invalid token", 400));
      }
      // còn đúng thông tin thì lấy tất cả thông tin user(dạng token) đưa vào các biến tạo name,email.password.avatar...
      // lưu ý chỉ có thông tin đúng thì các biến này mới có giá trị, và các logic ở dưới sẽ chạy, còn sai thì ngừng lại luôn ở điều kiện !newUser và render ra lỗi
      const { name, email, password, avatar } = newUser;

      //  tìm và trả ra dữ liệu khi thấy email và gán vào biến user
      let user = await User.findOne({ email });

      // nếu user đã tồn tại
      if (user) {
        return next(new ErrorHandler("User already exists", 400));
      }
      // nếu xác minh thành công thì sẽ đưa dữ liệu đăng ký vào database
      // đưa thông tin đăng ký vào User sau đó dùng await render ra và gán vào biến
      // nếu ko có await thì nó sẽ ko render ra client mà ko render ra client thì nó sẽ ko xác mình được thông tin render vs token thông tin user khi đó sẽ hiện ra là expires(hết hạn token)
      // còn khi có await thì nó sẽ được render ra ngoài client và nó lấy client ấy so sánh vs token thông tin gửi xác minh trong mail nếu khớp thì sẽ hiện ra thông báo xác minh thành công
      // lưu ý: khi ko có await hay có await nó vẫn lọt vào database khi xác minh nhưng mà chỉ ko render đc ra ngoài và xác minh mà thôi
      // ngược lại nếu user chưa tồn tại thì tạo mói vào database (lưu ý: khi đã xác minh thì mới tạo)
      user = await User.create({
        name,
        email,
        avatar,
        password,
      });
      // và đưa cho người dùng có tài khoản token để sử dụng tài nguyên data sendToken
      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//login user
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;
      // nếu 1 trong 2 trường nhập vào ko cung cấp đủ giá trị thì sẽ lỗi
      if (!email || !password) {
        return next(new ErrorHandler("Please provide the all fields!", 400));
      }
      //sau đó dùng findOne của model User tìm người dùng trong databse có khớp với địa chỉ nhập vào ở ngoài hay không
      // await chờ tìm thông tin khớp trong databse rồi render ra vào biến user
      const user = await User.findOne({ email }).select("+password");
      // nếu địa chỉ user nhập vào khác với databse thì thông báo lỗi
      if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }
      // sử dụng phương thức comparePassword đã được định nghĩa trong schema của người dùng để so sánh mật khẩu được cung cấp với mật khẩu đã lưu trữ trong cơ sở dữ liệu.
      const isPassworValid = await user.comparePassword(password);
      // nếu mật khẩu khác với databse khi so sánh thì thông báo ra lỗi
      if (!isPassworValid) {
        return next(
          new ErrorHandler("Please provide the correct isformation", 400)
        );
      }
      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// load user
router.get(
  "/getuser",
  // sẽ kiểm tra xem người dùng đã gửi kèm mã token xác thực (thông qua cookie hoặc header)
  // isAuthenticated người dùng xác thực mới có quyên truy cập thông tin người dùng
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      // vì sao có req.user?
      // vì ta đã gán await Shop.findById vào req.seller ở trong isAuthenticated nên ta có thể gọi được req.user
      const user = await User.findById(req.user.id);
      if (!user) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }
      // Nếu tìm thấy thông tin người dùng, endpoint sẽ trả về thông tin đó dưới dạng một đối tượng JSON với mã trạng thái 200 và success: true.
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// log out user
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });

      res.status(201).json({
        success: true,
        message: "Log out successful!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//update user info
router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password, phoneNumber, name } = req.body;
      // tim email va select den password
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      // select  vao password so sanh voi input nhap ben ngoai lay vao
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct infomation", 400)
        );
      }
      // nguoc lai  neu nhap pass dung
      user.name = name;
      user.email = email;
      user.phoneNumber = phoneNumber;

      await user.save();
      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user avatar
router.put(
  "/update-avatar",
  isAuthenticated,
  upload.single("image"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      // dau tien ca tan lam` cac buoc de xoa avatar hien tai truoc khi thay avatar moi
      // Truy vấn cơ sở dữ liệu để lấy thông tin người dùng hiện tại. req.user.id được giữ trong quá trình xác thực và chứa ID của người dùng đã đăng nhập.
      const existsUser = await User.findById(req.user.id);
      // Tạo đường dẫn đầy đủ của avatar hiện tại của người dùng.
      const existAvatarPath = `uploads/${existsUser.avatar}`;
      // Xóa avatar hiện tại của người dùng. Sử dụng
      // để đồng bộ xóa file.
      fs.unlinkSync(existAvatarPath);

      // Tạo một đường dẫn đầy đủ cho file hình ảnh mới được tải lên.
      const fileUrl = path.join(req.file.filename);

      // Cập nhật thông tin người dùng trong cơ sở dữ liệu để thay đổi avatar mới.
      const user = await User.findByIdAndUpdate(req.user.id, {
        avatar: fileUrl,
      });

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {}
  })
);

// update user address
router.put(
  "/update-user-addresses",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      const sameTypeAddress = user.addresses.find(
        (address) => address.addressType === req.body.addressType
      );
      if (sameTypeAddress) {
        return next(
          new ErrorHandler(`${req.body.addressType} address already exists`)
        );
      }
      // Tìm địa chỉ có sẵn trong mảng addresses của người dùng dựa trên ID.
      const existAddress = user.addresses.find(
        (address) => address._id === req.body._id
      );
      if (existAddress) {
        // Object.assign được sử dụng để sao chép giá trị của tất cả các thuộc tính có thể liệt kê từ một hoặc nhiều đối tượng nguồn vào một đối tượng đích. Nó trả về đối tượng đích đã được cập nhật.
        // Nếu địa chỉ đã tồn tại, cập nhật nó với dữ liệu mới từ req.body.
        // doi so thu nhat Đối tượng sẽ nhận giá trị từ các đối tượng nguồn.
        // doi so thu hai Một hoặc nhiều đối tượng nguồn.
        Object.assign(existAddress, req.body);
      } else {
        // Nếu địa chỉ không tồn tại, thêm địa chỉ mới vào mảng addresses của người dùng.
        user.addresses.push(req.body);
      }
      await user.save();

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete user address
router.delete(
  "/delete-user-address/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const userId = req.user._id;
      const addressId = req.params.id;

      //  Sử dụng hàm updateOne của Mongoose để cập nhật thông tin người dùng. Phương thức $pull được sử dụng để loại bỏ một phần tử khỏi mảng. Trong trường hợp này, nó sẽ loại bỏ địa chỉ có _id trùng khớp với addressId khỏi mảng addresses của người dùng.
      await User.updateOne(
        {
          _id: userId,
        },
        { $pull: { addresses: { _id: addressId } } }
      );
      const user = await User.findById(userId);
      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user password
router.put(
  "/update-user-password",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("+password");

      // so sanh mat khau hien tai voi mat khau ma nguoi dung nhap input ko co khop hay khong
      const isPasswordMatched = await user.comparePassword(
        req.body.oldPassword
      );

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect!", 400));
      }
      if (req.body.newPassword !== req.body.confirmPassword) {
        return next(
          new ErrorHandler("Password doesn't matched with other!!", 400)
        );
      }
      // Gán mật khẩu mới từ req.body.newPassword vào trường filed password  trong database của đối tượng người dùng.
      user.password = req.body.newPassword;
      await user.save();
      res.status(201).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.get(
  "/user-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
