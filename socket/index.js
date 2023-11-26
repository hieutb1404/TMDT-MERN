const socketIO = require("socket.io");

const http = require("http");
const express = require("express");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

require("dotenv").config({
  path: "./.env",
});

app.use(cors());
// Express sẽ phân tích và chuyển đổi dữ liệu gửi đến từ client dưới dạng JSON thành đối tượng JavaScript và lưu trữ trong req.body. Khi có dữ liệu trong req.body
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world from socket ");
});

let users = [];

const addUser = (userId, socketId) => {
  // trả về true (nghĩa là không có người dùng nào có userId giống), thì một đối tượng mới được thêm vào mảng users
  !users.some((user) => user.userid === userId) &&
    users.push({ userId, socketId });
  // Nếu userId đã tồn tại trong mảng, thì không có thay đổi nào được thực hiện.
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (receiverId) => {
  return users.find((user) => user.userId === receiverId);
};

// xác định một đối tượng tin nhắn với thuộc tính đã thấy
const createMessage = ({ senderId, receiverId, text, images }) => ({
  senderId,
  receiverId,
  text,
  images,
  //  thuộc tính đánh dấu xem tin nhắn đã được người nhận xem (true) hay chưa (false).
  seen: false,
});
// Khi một người dùng kết nối với máy chủ thông qua WebSocket, sự kiện "connection" sẽ được kích hoạt.
io.on("connection", (socket) => {
  //  connect
  console.log(`a user is connected`);

  // lấy userId và socketId từ người dùng
  //Khi máy khách (client) gửi sự kiện "addUser" đến máy chủ, nó chứa userId của người dùng.
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    // được sử dụng để gửi một sự kiện đến tất cả các máy khách (clients) đang kết nối với server
    // io.emit là cách để gửi thông điệp từ server đến tất cả các máy khách và đồng bộ hóa trạng thái giữa server và máy khách trong ứng dụng thời gian thực
    // truyền thông tin giữa server và tất cả các máy khách kết nối
    //  // Xử lý tin nhắn và gửi đến tất cả các máy khách
    io.emit("getUsers", users);
  });

  // gui va nhan tn
  const messages = {};
  // sự kiện "sendMessage" được kích hoạt từ một máy khách,
  // tạo một đối tượng tin nhắn thông qua hàm createMessage và sau đó lưu trữ tin nhắn đó vào messages Object dựa trên receiverId.
  socket.on("sendMessage", ({ senderId, receiverId, text, images }) => {
    const message = createMessage(senderId, receiverId, text, images);

    const user = getUser(receiverId);

    // Store the messages in the `messages` Object
    if (!messages[receiverId]) {
      // Nếu điều kiện trên là true, có nghĩa là không có mảng tin nhắn nào đã được tạo cho receiverId, và do đó, chúng ta tạo một mảng mới chứa tin nhắn hiện tại:
      // Ở đây, messages[receiverId] là một mảng mới chứa chỉ một phần tử là tin nhắn mới nhất.
      messages[receiverId] = [message];
    } else {
      // messages[receiverId] là mảng đã tồn tại, và push(message) được sử dụng để thêm tin nhắn mới vào cuối mảng.
      messages[receiverId].push(message);
    }

    // send the message to the recevier
    // io là đối tượng socket.io, và .to(user?.socketId) được sử dụng để chỉ định rằng tin nhắn sẽ được gửi đến phòng (room) có tên là user?.socketId. Nếu user?.socketId là undefined, tin nhắn sẽ được gửi đến phòng không xác định
    // emit("getMessage", message): Sử dụng để phát tín hiệu "getMessage" đến tất cả các người nghe (listeners) trong phòng đã được xác định (ở bước trước). Nó gửi thông điệp chứa nội dung của message đến tất cả người nghe trong phòng đó
    io.to(user?.socketId).emit("getMessage", message);
  });

  // Lắng nghe sự kiện "MessageSeen" từ phía client, nhận dữ liệu gửi kèm (senderId, receiverId, messageId).
  socket.on("MessageSeen", ({ senderId, receiverId, messageId }) => {
    //  Lấy thông tin về người dùng (user) dựa trên senderId
    const user = getUser(senderId);

    // update the seen flag for the message
    // Kiểm tra xem có danh sách các tin nhắn (messages) của người gửi tin nhắn (senderId) hay không.
    if (messages[senderId]) {
      // để tìm kiếm trong mảng tin nhắn của người gửi
      // Tìm kiếm thông điệp cần cập nhật trong danh sách tin nhắn gan` nhat của người gửi, dựa trên receiverId và messageId.

      const message = messages[senderId].find(
        (message) =>
          message.receiverId === receiverId && message.id === messageId
      );
      //  Kiểm tra xem có thông điệp cần cập nhật hay không.
      if (message) {
        message.seen = true;

        // send a message seen event to the sender
        // emit phat tin hieu gui di
        // Gửi một sự kiện "messageSeen" đến người gửi tin nhắn thông báo rằng tin nhắn đã được đọc client
        io.to(user?.sockerId).emit("messageSeen", {
          senderId,
          receiverId,
          messageId,
        });
      }
    }
  });
  // update and get last message
  // updateLastMessage". Khi máy khách gửi sự kiện "updateLastMessage" lên máy chủ với dữ liệu bao gồm "lastMessage" và "lastMessageId", máy chủ sẽ phát lại sự kiện "getLastMessage" với cùng dữ liệu này tới tất cả các kết nối (tất cả các máy khách đang kết nối)
  // Điều này có thể được sử dụng để thông báo cho tất cả các máy khách về sự cập nhật của "lastMessage" (tin nhắn cuối cùng) và "lastMessageId" (ID của tin nhắn cuối cùng) mà máy chủ quản lý. Các máy khách có thể lắng nghe sự kiện "getLastMessage" để cập nhật giao diện người dùng của họ dựa trên thông tin này
  // update and get last message
  socket.on("updateLastMessage", ({ lastMessage, lastMessagesId }) => {
    // gui tin hieu di
    io.emit("getLastMessage", {
      lastMessage,
      lastMessagesId,
    });
  });

  // when disconnect
  socket.on("disconnect", () => {
    console.log(`a user disconnect`);
    removeUser(socket.io);
    io.emit("getUser", users);
  });
});

server.listen(process.env.PORT || 4000, () => {
  console.log(`server is running on port:  ${process.env.PORT || 4000}`);
});
