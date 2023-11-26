const Conversation = require("../model/conversation");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const { isSeller, isAuthenticated } = require("../middleware/auth");
const router = express.Router();

// create router a new conversation
router.post(
  "/create-new-conversation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      // groupTitle: id xác định một cuộc trò chuyện.
      // id: user, id: seller
      const { groupTitle, userId, sellerId } = req.body;

      // Kiểm tra sự tồn tại của cuộc trò chuyện
      const isConversationExist = await Conversation.findOne({ groupTitle });

      // Nếu cuộc trò chuyện đã tồn tại (isConversationExist), trả về cuộc trò chuyện đó
      if (isConversationExist) {
        const conversation = isConversationExist;
        res.status(201).json({
          success: true,
          conversation,
        });
      } else {
        // Nếu cuộc trò chuyện chưa tồn tại, tạo một cuộc trò chuyện mới sử dụng Conversation.create() với các thông tin như members và groupTitle
        const conversation = await Conversation.create({
          members: [userId, sellerId],
          groupTitle: groupTitle,
        });

        res.status(201).json({
          success: true,
          conversation,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error.response.message), 500);
    }
  })
);

// get seller conversations
router.get(
  "/get-all-conversation-seller/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const conversations = await Conversation.find({
        // Truy vấn cơ sở dữ liệu lấy tất cả cuộc trò chuyện mà seller có id là một trong các thành viên field(members)
        members: {
          // $in là toán tử để kiểm tra xem giá trị của trường members có giong' một trong các giá trị trong mảng [req.params.id] hay không (so sanh)
          $in: [req.params.id],
        },
        // mới nhất đến cũ hơn
      }).sort({ updatedAt: -1, createdAt: -1 });
      res.status(201).json({
        success: true,
        conversations,
      });
    } catch (error) {
      return next(new ErrorHandler(error), 500);
    }
  })
);

// get user conversations
router.get(
  "/get-all-conversation-user/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const conversations = await Conversation.find({
        // Truy vấn cơ sở dữ liệu lấy tất cả cuộc trò chuyện mà seller có id là một trong các thành viên field(members)
        members: {
          // $in là toán tử để kiểm tra xem giá trị của trường members có giong' một trong các giá trị trong mảng [req.params.id] hay không (so sanh)
          $in: [req.params.id],
        },
        // mới nhất đến cũ hơn
      }).sort({ updatedAt: -1, createdAt: -1 });
      res.status(201).json({
        success: true,
        conversations,
      });
    } catch (error) {
      return next(new ErrorHandler(error), 500);
    }
  })
);

// update the last message
// lay ra tin nha ngan nhat
router.put(
  "/update-last-message/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { lastMessage, lastMessageId } = req.body;

      const conversation = await Conversation.findByIdAndUpdate(req.params.id, {
        lastMessage,
        lastMessageId,
      });

      res.status(201).json({
        success: true,
        conversation,
      });
    } catch (error) {
      return next(new ErrorHandler(error), 500);
    }
  })
);

module.exports = router;
