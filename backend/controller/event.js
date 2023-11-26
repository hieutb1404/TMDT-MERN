const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { upload } = require("../multer");
const Shop = require("../model/shop");
const Event = require("../model/event");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller } = require("../middleware/auth");
const fs = require("fs");

//create event
router.post(
  "/create-event",
  upload.array("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      // Lấy giá trị của trường "shopId" từ phần thân của yêu cầu POST (req.body).
      const shopId = req.body.shopId;
      // Sử dụng model Shop để tìm kiếm cửa hàng dựa trên giá trị shopId.
      // luu y: chi la dua vao so' id shopId, vd: shopId  = 4 nghia la ta dang findByID 4
      const shop = await Shop.findById(shopId);
      if (!shop) {
        // Kiểm tra xem có cửa hàng nào tương ứng với shopId không. Nếu không có, nó sẽ tạo một lỗi và gửi nó đến middleware next để xử lý lỗi.
        return next(new ErrorHandler("shop Id is invalid", 400));
      } else {
        // Lấy danh sách các tệp đã tải lên từ yêu cầu POST (req.files). Đây là nơi chứa các tệp hình ảnh.
        const files = req.files;
        // Tạo một mảng imageUrls bằng cách lặp qua danh sách các tệp hình ảnh và lấy tên tệp của mỗi tệp (file.filename). Điều này tạo ra một mảng các đường dẫn (URL) của các tệp hình ảnh đã tải lên.
        const imageUrls = files.map((file) => `${file.filename}`);
        // Lấy toàn bộ dữ liệu sản phẩm từ phần thân của yêu cầu POST (req.body).
        const eventData = req.body;
        // sau khi co product = req.body r t co the truy cap vao body do
        // Gán mảng imageUrls (đường dẫn hình ảnh) vào trường "images" của dữ liệu sản phẩm. Điều này thêm các đường dẫn hình ảnh vào sản phẩm.
        eventData.images = imageUrls;

        // lay toan bo thong tin shop duoc tim thay tren findbyid gan vao productData.shop(database)
        eventData.shop = shop;

        const event = await Event.create(eventData);
        res.status(201).json({
          success: true,
          event,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);
//get all event of a shop
router.get(
  "/get-all-events/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find({ shopId: req.params.id });
      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// delete product of a shop
router.delete(
  "/delete-shop-event/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const eventId = req.params.id;

      const eventData = await Event.findById(eventId);

      // sau khi xoa product thi dong thoi xoa luon ca file anh trong uploads
      eventData.images.forEach((imageUrl) => {
        const filename = imageUrl;
        const filePath = `uploads/${filename}`;

        // fs dung dung xoa file
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
          }
        });
      });

      const event = await Event.findByIdAndDelete(eventId);

      // neu ko tim thay id thi thong bao loi
      if (!event) {
        return next(new ErrorHandler("Event not found with this id!", 500));
      }
      // nguoc lai neu tim thay id xoa thi tra ve res.status
      res.status(201).json({
        success: true,
        message: "Event Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);
// get all events
router.get("/get-all-events", async (req, res, next) => {
  try {
    const events = await Event.find();
    res.status(201).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

module.exports = router;
