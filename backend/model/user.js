const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// tao ra ban sao data trong mongoose
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email!"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password!"],
    minLength: [4, "Password should be greater than 4 characters"],
    select: false,
  },
  phoneNumber: {
    type: Number,
  },
  addresses: [
    {
      country: {
        type: String,
      },
      city: {
        type: String,
      },
      address1: {
        type: String,
      },
      address2: {
        type: String,
      },
      zipCode: {
        type: Number,
      },
      addressType: {
        type: String,
      },
    },
  ],
  role: {
    type: String,
    default: "user",
  },
  avatar: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: String,
  resetPasswordTime: Date,
});

// Hash password
// neu mat khau bi sua doi thi next(), se lap 10 lan mat khau ma hoa truoc khi dua vao mongoose
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// jwt token
// getJwtToken là một phương thức được định nghĩa trong schema của người dùng (userSchema) để tạo và trả về JSON Web Token (JWT). JWT là một chuỗi mã hóa được sử dụng để xác thực và ủy quyền người dùng.
// no se dua du lieu databse duoi dang ma hoa , ma nguoi doc khong the hieu vd : WastWoepwqNghjlQwwqe....
// hiểu 1 cách đơn giản là nó server toàn bộ thông tin người dùng dựa vào id bằng khóa bí mật JWT.SECRET_KEY gửi về server, khi server nhận đc thông tin dưới dạng khóa bí mật thì server sẽ tự động giải ra để lấy thông tin đưa vào server. như vậy để tránh rỏ rỉ thông tin
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};
// compare password
// so sanh mat khau co trung voi database hay khong
// bcrypt.compare để so sánh hai mật khẩu. Hàm này sẽ trả về kết quả là true nếu mật khẩu đã nhập khớp với mật khẩu được lưu trữ, và false nếu không khớp.
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// nó tự thêm 's' khi đưa lên server ví dụ : Users nên mình ko cần phải thêm 's' sẵn ở đây
// export userSchema với tên là User
module.exports = mongoose.model("User", userSchema);
