const express = require("express");
const router = express.Router();
const CryptoJS = require("crypto-js");
const { v1: uuid } = require("uuid");
const axios = require("axios");
const moment = require("moment");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post(
  "/process",
  catchAsyncErrors(async (req, res, next) => {
    // Sử dụng thư viện Stripe, endpoint này tạo một paymentIntent mới thông qua
    // Một paymentIntent là một đối tượng Stripe đại diện cho một yêu cầu thanh toán từ phía khách hàng
    // amount là số tiền thanh toán (đơn vị là "vnd" - Việt Nam đồng),
    // và metadata là một đối tượng chứa các thông tin bổ sung, trong trường hợp này là thông tin về công ty ("company").
    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "VND",
      metadata: {
        company: "Trung Hieu",
      },
    });
    res.status(200).json({
      success: true,

      //client_secret (mã bí mật của paymentIntent, sẽ được sử dụng trên phía client để xác nhận và hoàn tất thanh toán).
      client_secret: myPayment.client_secret,
    });
  })
);

router.get(
  "/stripeapikey",
  catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({ stripeApikey: process.env.STRIPE_API_KEY });
  })
);

// zalo pay

const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

const embed_data = {};

router.post(
  "/process-zalopay",
  catchAsyncErrors(async (req, res, next) => {
    try {
      // Nhận thông tin đơn hàng từ frontend
      const { app_user, amount } = req.body;
      const items = [{}];
      const transID = Math.floor(Math.random() * 1000000);
      const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
        app_user: app_user,
        app_time: Date.now(),
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: amount,
        description: `Lazada - Payment for the order #${transID}`,
        bank_code: "zalopayapp",
      };

      // appid|app_trans_id|appuser|amount|apptime|embeddata|item
      const data =
        config.app_id +
        "|" +
        order.app_trans_id +
        "|" +
        order.app_user +
        "|" +
        order.amount +
        "|" +
        order.app_time +
        "|" +
        order.embed_data +
        "|" +
        order.item;
      order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

      // Gửi yêu cầu tới endpoint của ZaloPay
      const response = await axios.post(config.endpoint, null, {
        params: order,
      });
      // Kiểm tra nếu yêu cầu thành công
      if (response.data.return_code === 1) {
        // Lấy orderId từ dữ liệu phản hồi
        const orderId = response.data.orderId; // Thay thế bằng trường chứa orderId trong dữ liệu phản hồi của bạn

        // Ký số thông tin đơn hàng
        const signature = signOrderInformation(
          orderId,
          order.amount,
          order.bank_code
        );

        // Trả về thông tin cần thiết cho client
        res.status(200).json({
          success: true,
          orderId: orderId,
          signature: signature,
          redirectUrl: response.data.order_url, // Đường dẫn chuyển hướng từ ZaloPay
        });
      } else {
        // Xử lý khi yêu cầu không thành công
        res.status(500).json({
          success: false,
          message: "ZaloPay request failed",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  })
);

// Hàm ký số thông tin đơn hàng (sửa đổi)
function signOrderInformation(orderId, amount, bank_code) {
  const privateKey = config.key1;
  const dataToSign = `${orderId}|${amount}|${bank_code}`;
  const signature = CryptoJS.HmacSHA256(dataToSign, privateKey).toString();
  return signature;
}

module.exports = router;
