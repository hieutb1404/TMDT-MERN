// Thư viện nodemailer là một công cụ mạnh mẽ để gửi email từ máy chủ Node.js. Nó cung cấp một giao diện dễ sử dụng để cấu hình và gửi email thông qua các giao thức như SMTP.
const nodemailer = require("nodemailer");

// nhận đối số ở user controller (options ở đây sẽ chứa đựng 3 đối số bên trong  vì ở bên ngoài truyền 3 đối nhưng chỉ gộp lại thành 1)
const sendMail = async (options) => {
  // createTransport được sử dụng để tạo đối tượng
  const transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.TZ_PORT,
    service: process.env.TZ_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // transporter để cấu hình việc gửi email, và transporter được sử dụng để gửi email thực tế thông qua phương thức sendMail.
  // sau khi nhận đc dữ liệu từ đối số bên ngoài truyền vào thì dùng await để render ra dữ liệu đó
  await transporter.sendMail(mailOptions);
};
module.exports = sendMail;
