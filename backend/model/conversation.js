const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    groupTitle: {
      type: String,
    },
    members: {
      type: Array,
    },
    lastMessage: {
      type: String,
    },
    lastMessageId: {
      type: String,
    },
  },
  //  timestamps được sử dụng để đánh dấu thời điểm một bản ghi cụ thể được tạo, cập nhật hoặc xóa trong cơ sở dữ liệu.
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
