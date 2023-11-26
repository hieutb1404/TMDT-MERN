const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Product = require("../model/product");
const Order = require("../model/order");
const Shop = require("../model/shop");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller, isAuthenticated } = require("../middleware/auth");
const fs = require("fs");

//create product
router.post(
  "/create-product",
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
        const productData = req.body;
        // sau khi co product = req.body r t co the truy cap vao body do
        // Gán mảng imageUrls (đường dẫn hình ảnh) vào trường "images" của dữ liệu sản phẩm. Điều này thêm các đường dẫn hình ảnh vào sản phẩm.
        productData.images = imageUrls;

        // lay toan bo thong tin shop duoc tim thay tren findbyid gan vao productData.shop(database)
        productData.shop = shop;

        const product = await Product.create(productData);
        res.status(201).json({
          success: true,
          product,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);
// Update product
router.put(
  "/update-product/:id",
  upload.array("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      // Lấy ID của sản phẩm từ đường dẫn yêu cầu

      // Kiểm tra xem có sản phẩm nào tương ứng với productId không
      const product = await Product.findById(req.params.id);
      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }

      // Lấy danh sách các tệp đã tải lên từ yêu cầu PUT (req.files)
      const files = req.files;

      if (files && files.length > 0) {
        // Nếu có các tệp mới được tải lên, cập nhật đường dẫn hình ảnh của sản phẩm
        const imageUrls = files.map((file) => `${file.filename}`);
        product.images = imageUrls;
      }

      // Cập nhật thông tin sản phẩm từ phần thân của yêu cầu PUT (req.body)
      const updatedProductData = req.body;
      // sau khi co product = req.body r t co the truy cap vao body do
      // Nếu bạn muốn cập nhật một số trường cụ thể, bạn có thể chỉ định chúng ở đây. Ví dụ: product.name = updatedProductData.name;

      product.name = req.body.name;
      product.description = req.body.description;
      product.category = req.body.category;
      product.tags = req.body.tags;
      product.originalPrice = req.body.originalPrice;
      product.discountPrice = req.body.discountPrice;
      product.stock = req.body.stock;

      console.log(updatedProductData);
      // Lưu thay đổi vào cơ sở dữ liệu
      await product.save(updatedProductData);

      res.status(200).json({
        success: true,
        message: "Product updated successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

//get all product of a shop
router.get(
  "/get-all-products-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({ shopId: req.params.id });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// delete product of a shop
router.delete(
  "/delete-shop-product/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id;
      // tim image id can xoa
      const productData = await Product.findById(productId);
      // sau khi xoa product thi dong thoi xoa luon ca file anh trong uploads
      productData.images.forEach((imageUrl) => {
        const filename = imageUrl;
        const filePath = `uploads/${filename}`;

        // fs dung dung xoa file
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
          }
        });
      });

      const product = await Product.findByIdAndDelete(productId);

      if (!product) {
        return next(new ErrorHandler("Product not found with this id!", 500));
      }
      // nguoc lai neu tim thay id xoa thi tra ve res.status

      res.status(201).json({
        success: true,
        message: "Product Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all products
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      // sắp xếp kết quả theo trường "createdAt" trong một thứ tự giảm dần (sắp xếp các sản phẩm mới nhất lên đầu).
      const products = await Product.find().sort({ createdAt: -1 });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

//review product
router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      // truyền từ phía client khi gửi yêu cầu
      const { user, rating, comment, productId, orderId } = req.body;

      const review = {
        user,
        rating,
        comment,
        productId,
      };

      const product = await Product.findById(productId);

      //  Kiểm tra xem người dùng đã đánh giá sản phẩm trước đó chưa bằng cách tìm kiếm trong mảng reviews của sản phẩm
      const isReviewed = product.reviews.find(
        // Kiểm tra nếu đánh giá rồi nghĩa là id user có dữ liệu đc truyền vào , còn chưa nghĩa là ko tìm thấy id user id của người dùng đó
        (rev) => rev.user._id === req.user._id
      );

      if (isReviewed) {
        product.reviews.forEach((rev) => {
          // Nếu người dùng đã đánh giá sản phẩm trước đó, thì sẽ cập nhật lại đánh giá hiện tại
          if (rev.user._id === req.user._id) {
            (rev.rating = rating), (rev.comment = comment), (rev.user = user);
          }
        });
      } else {
        // nếu người dùng chưa đánh giá, thì sẽ thêm một đánh giá mới vào mảng reviews
        product.reviews.push(review);
      }

      // Tính trung bình điểm đánh giá bằng cách cộng tổng các điểm đánh giá trong mảng reviews
      let avg = 0;
      product.reviews.forEach((rev) => {
        // lấy rating trong db + với avg  => avg lưu trữ điểm
        avg += rev.rating;
      });

      // sau đó cập nhật điểm đánh giá = cách lấy avg bên trên chia cho review hiện đã đánh giá của mình
      // vd: avg = 5/ review của mình là 1 lần comment => 5/1 = 5 => 5 sao
      // điểm ratings tổng này sẽ đánh giá theo các người dùng đánh giá sao và chia cho số lượng comment hiện tại
      product.ratings = avg / product.reviews.length;

      // Lưu thông tin sản phẩm đã được cập nhật vào cơ sở dữ liệu.
      // {validateBeforeSave: false} được sử dụng để tắt quá trình kiểm tra trước khi lưu để tránh lỗi kiểm tra hợp lệ
      await product.save({ validateBeforeSave: false });

      await Order.findByIdAndUpdate(
        orderId,
        // $set để cập nhật giá trị của trường isReviewed trong mảng cart vao DB table  Order
        { $set: { "cart.$[elem].isReviewed": true } },
        // cart.$[elem] là cú pháp để truy cập một phần tử cụ thể trong mảng cart
        // Ở đây, elem là biến được sử dụng trong arrayFilters để ánh xạ với phần tử cần cập nhật
        // arrayFilters: Sử dụng để chỉ định điều kiện để xác định các phần tử trong mảng cần được cập nhật
        // điều kiện là {"elem._id": productId}, với productId là biến được truyền vào từ bên ngoài, giúp xác định phần tử cụ thể trong mảng cart
        // new: true:  kết quả trả về từ phương thức là bản ghi đã được cập nhật (thay đổi), không phải bản ghi ban đầu
        { arrayFilters: [{ "elem._id": productId }], new: true }
        // mục đích sử dụng: giúp bản ghi Order xác nhận đã review hay chưa, đánh giá hay chưa
        // nếu rồi thì sẽ có 1 trường isReviewed = true, và ratings đã đánh giá
      );

      res.status(200).json({
        success: true,
        message: "Reviewed successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

module.exports = router;
