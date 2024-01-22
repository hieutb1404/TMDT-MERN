const Messages = require("../model/messages");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
// Lưu trữ và Quản lý Ảnh và Video truc tuyen
const cloudinary = require("cloudinary");
const router = express.Router();

// create new message
router.post(
  "/create-new-message",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const messageData = req.body;

      // cầu có dữ liệu hình ảnh (req.body.images tồn tại), Cloudinary để tải lên hình ảnh đó lên Cloudinary.
      if (req.body.images) {
        // upload từ thư viện Cloudinary để tải lên hình ảnh lên dịch vụ. Đối số đầu tiên (req.body.images) là đường dẫn đến hình ảnh cần tải lên
        const myCloud = await cloudinary.v2.uploader.upload(req.body.images, {
          // Đối số thứ hai là một đối tượng chứa các tùy chọn, trong trường hợp này, bạn đặt folder là "messages" để tổ chức các hình ảnh trong thư mục "messages" trên Cloudinary.
          folder: "messages",
        });
        // Thay đổi giá trị của messageData.images để chứa thông tin về hình ảnh đã tải lên, bao gồm public_id và url.
        messageData.images = {
          // Sau khi tải lên thành công, kết quả của phương thức upload được gán cho biến
          // Kết quả này chứa thông tin về hình ảnh đã tải lên, bao gồm public_id (ID công khai) và url (đường dẫn trực tiếp đến hình ảnh trên Cloudinary).
          public_id: myCloud.public_id,
          url: myCloud.url,
        };
      }

      messageData.conversationId = req.body.conversationId;
      messageData.sender = req.body.sender;
      messageData.text = req.body.text;

      const message = new Messages({
        conversationId: messageData.conversationId,
        text: messageData.text,
        sender: messageData.sender,
        images: messageData.images ? messageData.images : undefined,
      });

      await message.save();

      res.status(201).json({
        success: true,
        message,
      });
    } catch (error) {
      return next(new ErrorHandler(error), 500);
    }
  })
);

// get all messages with conversation id
router.get(
  "/get-all-messages/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const messages = await Messages.find({
        conversationId: req.params.id,
      });

      res.status(201).json({
        success: true,
        messages,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message), 500);
    }
  })
);
module.exports = router;
