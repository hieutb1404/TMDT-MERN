const express = require("express");
const path = require("path");
const router = express.Router();
const { upload } = require("../multer");

const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendShopToken = require("../utils/ShopToken");

router.post("/create-shop", upload.single("file"), async (req, res, next) => {
  try {
    const { email } = req.body;
    const sellerEmail = await Shop.findOne({ email });

    if (sellerEmail) {
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
    const filename = req.file.filename;
    const fileUrl = path.join(filename);

    // khi gui form bieu mau len no se bat lay cac thuoc tinh name="" trong input dua vao req khi goi
    const seller = {
      name: req.body.name,
      email: email,
      password: req.body.password,
      avatar: fileUrl,
      address: req.body.address,
      // vi sao trong form name = "phone-Number" ma` req.body.phoneNumber khac ten van~ goi duoc ?
      // giai thich: la vi ta dung` post axios get api post tu form tu 1 ten moi' tu` phone-number = phoneNumber
      phoneNumber: req.body.phoneNumber,
      zipCode: req.body.zipCode,
    };

    // truyen doi so user vao ham`
    const activationToken = createActivationToken(seller);
    const activationUrl = `http://localhost:3000/seller/activation/${activationToken}`;

    try {
      // sendMail được gọi và truyền các đối số vào để gửi email. Các đối số này bao gồm thông tin cần thiết như địa chỉ email của người nhận, tiêu đề và nội dung email.
      // nó sẽ render ra vào gửi vào hàm sendMail
      await sendMail({
        email: seller.email,
        subject: "Activate your shop",
        message: `Hello ${seller.name}, please click on the link to activate your shop ${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `please check your email:- ${seller.email} to activate your shop!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message), 500);
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// create
// nhận tham số seller đầu vào mà ở trên đã truyền đối số seller
const createActivationToken = (seller) => {
  // jwt.sign tạo Json web token bảo mật với 2 tham số đầu vào là user và khóa bí mật.
  // sau khi nhận được nó tự động mã hóa 2 tham số này là (thông tin user , khóa bí mật) sang thành mã hóa dưới dạng chuỗi số token (vd: mã sẽ thành là: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9)
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
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
      const newSeller = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      // nếu mà xác minh không phải thông tin người dùng hoặc khác token thì lỗi
      if (!newSeller) {
        return next(new ErrorHandler("Invalid token", 400));
      }
      // còn đúng thông tin thì lấy tất cả thông tin user(dạng token) đưa vào các biến tạo name,email.password.avatar...
      // lưu ý chỉ có thông tin đúng thì các biến này mới có giá trị, và các logic ở dưới sẽ chạy, còn sai thì ngừng lại luôn ở điều kiện !newUser và render ra lỗi
      const { name, email, password, avatar, zipCode, address, phoneNumber } =
        newSeller;

      //  tìm và trả ra dữ liệu khi thấy email và gán vào biến user
      let seller = await Shop.findOne({ email });

      // nếu user đã tồn tại
      if (seller) {
        return next(new ErrorHandler("User already exists", 400));
      }
      // nếu xác minh thành công thì sẽ đưa dữ liệu đăng ký vào database
      // đưa thông tin đăng ký vào User sau đó dùng await render ra và gán vào biến
      // nếu ko có await thì nó sẽ ko render ra client mà ko render ra client thì nó sẽ ko xác mình được thông tin render vs token thông tin user khi đó sẽ hiện ra là expires(hết hạn token)
      // còn khi có await thì nó sẽ được render ra ngoài client và nó lấy client ấy so sánh vs token thông tin gửi xác minh trong mail nếu khớp thì sẽ hiện ra thông báo xác minh thành công
      // lưu ý: khi ko có await hay có await nó vẫn lọt vào database khi xác minh nhưng mà chỉ ko render đc ra ngoài và xác minh mà thôi
      // ngược lại nếu user chưa tồn tại thì tạo mói vào database (lưu ý: khi đã xác minh thì mới tạo)

      seller = await Shop.create({
        name,
        email,
        avatar,
        password,
        zipCode,
        address,
        phoneNumber,
      });

      // và đưa cho người dùng có tài khoản token để sử dụng tài nguyên data sendToken
      sendShopToken(seller, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//login shop
router.post(
  "/login-shop",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;
      // nếu 1 trong 2 trường nhập vào ko cung cấp đủ giá trị thì sẽ lỗi
      if (!email || !password) {
        return next(new ErrorHandler("Please provide the all fields!", 400));
      }
      //sau đó dùng findOne của model User tìm người dùng trong databse có khớp với địa chỉ nhập vào ở ngoài hay không
      // await chờ tìm thông tin khớp trong databse rồi render ra vào biến user
      const user = await Shop.findOne({ email }).select("+password");
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
      sendShopToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// load user
router.get(
  "/getSeller",
  // sẽ kiểm tra xem người dùng đã gửi kèm mã token xác thực (thông qua cookie hoặc header)
  // isAuthenticated người dùng xác thực mới có quyên truy cập thông tin người dùng
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      // vì sao có req.seller?
      // vì ta đã gán await Shop.findById vào req.seller ở trong isSeller nên ta có thể gọi được req.seller
      const seller = await Shop.findById(req.seller._id);
      if (!seller) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }
      // Nếu tìm thấy thông tin người dùng, endpoint sẽ trả về thông tin đó dưới dạng một đối tượng JSON với mã trạng thái 200 và success: true.
      res.status(200).json({
        success: true,
        // seller nay se hien du lieu object ra devtool network
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// log out from shop
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("seller_token", null, {
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

// get shop info
router.get(
  "/get-shop-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shop = await Shop.findById(req.params.id);
      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update shop profile avatar
router.put(
  "/update-shop-avatar",
  isSeller,
  upload.single("image"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      // dau tien ca tan lam` cac buoc de xoa avatar hien tai truoc khi thay avatar moi
      // Truy vấn cơ sở dữ liệu để lấy thông tin người dùng hiện tại. req.user.id được giữ trong quá trình xác thực và chứa ID của người dùng đã đăng nhập.
      const existsUser = await Shop.findById(req.seller._id);
      // Tạo đường dẫn đầy đủ của avatar hiện tại của người dùng.
      const existAvatarPath = `uploads/${existsUser.avatar}`;
      // Xóa avatar hiện tại của người dùng. Sử dụng
      // để đồng bộ xóa file.
      fs.unlinkSync(existAvatarPath);

      // Tạo một đường dẫn đầy đủ cho file hình ảnh mới được tải lên.
      const fileUrl = path.join(req.file.filename);

      // Cập nhật thông tin người dùng trong cơ sở dữ liệu để thay đổi avatar mới.
      const seller = await Shop.findByIdAndUpdate(req.seller._id, {
        avatar: fileUrl,
      });

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {}
  })
);

//update seller info
router.put(
  "/update-shop-info",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { name, description, address, phoneNumber, zipCode } = req.body;
      // vì ta đã gán await Shop.findById vào req.seller ở trong isSeller nên ta có thể gọi được req.seller
      const shop = await Shop.findOne(req.seller._id);

      if (!shop) {
        return next(new ErrorHandler("User not found", 400));
      }

      // nguoc lai  neu nhap pass dung
      shop.name = name;
      shop.description = description;
      shop.address = address;
      shop.phoneNumber = phoneNumber;
      shop.zipCode = zipCode;

      await shop.save();
      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.get(
  "/get-shop-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shop = await User.findById(req.params.id);

      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all sellers -- for admin
router.get(
  "/admin-all-sellers",
  // truyen doi so vao auth la admin
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const sellers = await Shop.find().sort({
        createdAt: -1,
      });

      res.status(201).json({
        success: true,
        sellers,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete user
router.delete(
  "/delete-seller/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.params.id);
      if (!seller) {
        return next(
          new ErrorHandler("Seeler is not available with this id", 400)
        );
      }

      await Shop.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "Seller deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//update seller withdraw methods -- sellers

router.put(
  "/update-payment-methods",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { withdrawMethod } = req.body;

      const seller = await Shop.findByIdAndUpdate(req.seller._id, {
        withdrawMethod,
      });

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//delete seller withdraw methos  --- only seller
router.delete(
  "/delete-withdraw-method",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id);

      if (!seller) {
        return next(new ErrorHandler("Seller not found with this id", 400));
      }

      seller.withdrawMethod = null;

      await seller.save();

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
