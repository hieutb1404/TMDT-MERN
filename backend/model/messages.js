const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    text: {
      type: String,
    },
    sender: {
      type: String,
    },
    images: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  },
  //  timestamps được sử dụng để đánh dấu thời điểm một bản ghi cụ thể được tạo, cập nhật hoặc xóa trong cơ sở dữ liệu.
  { timestamps: true }
);

module.exports = mongoose.model("Messages", messagesSchema);
