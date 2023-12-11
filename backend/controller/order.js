const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const Order = require("../model/order");
const Shop = require("../model/shop");
const Product = require("../model/product");

//create new order

router.post(
  "/create-order",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

      // group cart items by ShopId
      // tạo một Map có tên là shopItemsMap để nhóm các sản phẩm theo shopId
      const shopItemsMap = new Map();

      for (const item of cart) {
        const shopId = item.shopId;
        // Nếu shopItemsMap chưa có mục với shopId tương ứng,
        if (!shopItemsMap.has(shopId)) {
          // tạo một mục mới với shopId và gán giá trị là một mảng rỗng.
          shopItemsMap.set(shopId, []);
        }
        // nguoc lai else,  đẩy item (sản phẩm) vào mảng tương ứng với shopId.
        shopItemsMap.get(shopId).push(item);
      }

      // create an order for each shop
      const orders = [];

      for (const [shopId, items] of shopItemsMap) {
        const order = await Order.create({
          cart: items,
          shippingAddress,
          user,
          totalPrice,
          paymentInfo,
        });
        orders.push(order);
      }

      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all orders of user
router.get(
  "/get-all-orders/:userId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      // tìm các đơn hàng mà trường user._id bằng với giá trị của req.params.userId. (trong db table orders)
      const orders = await Order.find({ "user._id": req.params.userId }).sort({
        // sort sắp xếp theo trường createAt theo thứ tự giảm dần (từ mới nhất đến cũ hơn).
        createAt: -1,
      });
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all orders of seller
router.get(
  "/get-seller-all-orders/:shopId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({
        // tìm các đơn hàng mà trường cart.shopId bằng với giá trị của req.params.ShopId. (trong db table orders)
        "cart.shopId": req.params.shopId,
      }).sort({
        // sort sắp xếp theo trường createAt theo thứ tự giảm dần (từ mới nhất đến cũ hơn).
        createAt: -1,
      });
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update status order
router.put(
  "/update-order-status/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }
      // Kiểm tra xem trạng thái mới của đơn hàng có phải là "Transferred to delivery partner" hay không
      if (req.body.status === "Transferred to delivery partner") {
        // lay truc tiep du lieu trong db truyen doi so
        order.cart.forEach(async (o) => {
          await updateOrder(o._id, o.qty);
        });
      }
      // else Cập nhật trạng thái của đơn hàng với giá trị mới từ req.body.status.
      order.status = req.body.status;

      if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
        order.paymentInfo.status = "Successded";
        // * 0.1
        const serivceCharge = order.totalPrice * 0.1;
        await updateSellerInfo(order.totalPrice - serivceCharge);
      }
      //Lưu thông tin đơn hàng đã được cập nhật vào cơ sở dữ liệu.
      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
      });

      // nhan doi so ve tham so xu ly
      async function updateOrder(id, qty) {
        const product = await Product.findById(id);

        product.stock -= qty;
        product.sold_out += qty;

        await product.save({ validateBeforeSave: false });
      }

      async function updateSellerInfo(amount) {
        const seller = await Shop.findById(req.seller.id);

        seller.availableBalance = amount;

        await seller.save();
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// give a refund --- user
router.put(
  "/order-refund/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      order.status = req.body.status;

      //Lưu thông tin đơn hàng đã được cập nhật vào cơ sở dữ liệu.
      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
        message: "Order Refund Request successfully! ",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// accept refund --- seller
router.put(
  "/order-refund-success/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }
      order.status = req.body.status;
      await order.save();

      res.status(200).json({
        success: true,
        message: "Order Refund successfull!",
      });

      // Kiểm tra xem trạng thái mới của đơn hàng có phải là "Transferred to delivery partner" hay không
      if (req.body.status === "Refund Success") {
        // lay truc tiep du lieu trong db truyen doi so
        order.cart.forEach(async (o) => {
          await updateOrder(o._id, o.qty);
        });
      }

      // nhan doi so ve tham so xu ly
      async function updateOrder(id, qty) {
        const product = await Product.findById(id);

        // tra so luong ban ve ban dau khi refund
        product.stock += qty;
        product.sold_out -= qty;

        await product.save({ validateBeforeSave: false });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all orders -- for admin
router.get(
  "/admin-all-orders",
  // truyen doi so vao auth la admin
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find().sort({
        deliveredAt: -1,
        createdAt: -1,
      });

      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
module.exports = router;
