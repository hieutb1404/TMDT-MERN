import axios from 'axios';
import Header from '~/layouts/components/Header';
import { useNavigate } from 'react-router-dom';
import { format } from 'timeago.js';
import styles from '~/styles/styles';
import socketIO from 'socket.io-client';
import { useSelector } from 'react-redux';
import { backend_url, server } from '~/server';
import { useEffect, useState } from 'react';
import { TfiGallery } from 'react-icons/tfi';
import { AiOutlineArrowRight, AiOutlineSend } from 'react-icons/ai';

const ENDPOINT = 'http://localhost:4000/';
const socketId = socketIO(ENDPOINT, { transports: ['websocket'] });

function UserInbox() {
  const { user } = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userData, setUserData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState(null);

  useEffect(() => {
    // sau khi nhan ENDPOINT tu server ta co the lay duoc getMessage trong do ra client

    socketId.on('getMessage', (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    axios
      .get(`${server}/conversation/get-all-conversation-user/${user._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setConversations(res.data.conversations);
      });
  }, [user]);

  useEffect(() => {
    if (user) {
      const userId = user._id;

      socketId.emit('addUser', userId);
      socketId.on('getUsers', (data) => {
        setOnlineUsers(data);
      });
    }
  }, [user]);

  const onlineCheck = (chat) => {
    // tim ra id user khong phai la user
    const chatMembers = chat.members.find((member) => member !== user?._id);
    // sau do tiep tuc lay ra cac id user ma dieu kien chatMembers da loc o tren, neu === vs id user thi la online
    const online = onlineUsers.find((user) => user.userId === chatMembers);

    return online ? true : false;
  };

  // get messages
  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await axios.get(`${server}/message/get-all-messages/${currentChat._id}`);
        setMessages(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    getMessage();
  }, [currentChat]);

  // create new message
  const sendMessageHandler = async (e) => {
    e.preventDefault();

    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find((member) => member.id !== user._id);

    socketId.emit('sendMessage', {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      if (newMessage !== '') {
        await axios
          .post(`${server}/message/create-new-message`, message)
          .then((res) => {
            setMessages([...messages, res.data.message]);
            updateLastMessage();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };
  // cap nhat lay ra ti nhhan gan nhat
  // tin nhan cuoi cung
  const updateLastMessage = async () => {
    socketId.emit('updateLastMessage', {
      lastMessage: newMessage,
      lastMessageId: user._id,
    });

    await axios
      .put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: newMessage,
        lastMessageId: user._id,
      })
      .then((res) => {
        setNewMessage('');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleImageUpload = async (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setImages(reader.result);
        imageSendingHandler(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const imageSendingHandler = async (e) => {
    const receiverId = currentChat.members.find((member) => member !== user._id);

    socketId.emit('sendMessage', {
      senderId: user._id,
      receiverId,
      images: e,
    });

    try {
      await axios
        .post(`${server}/message/create-new-message`, {
          images: e,
          sender: user._id,
          text: newMessage,
          conversationId: currentChat._id,
        })
        .then((res) => {
          setImages();
          setMessages([...messages, res.data.message]);
          updateLastMessageForImage();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessageForImage = async () => {
    await axios.put(`${server}/conversation/update-last-message/${currentChat._id}`, {
      lastMessage: 'Photo',
      lastMessageId: user._id,
    });
  };

  return (
    <div className="w-full ">
      <Header />
      {/* All message  */}
      {/* neu khac true moi hien  */}

      {!open && (
        <>
          <h1 className="text-center text-[30px] py-3 font-Poppins]">All Messages</h1>

          {conversations &&
            conversations.map((item, index) => (
              <MessageList
                data={item}
                key={index}
                index={index}
                setOpen={setOpen}
                setCurrentChat={setCurrentChat}
                me={user._id}
                setUserData={setUserData}
                userData={userData}
                online={onlineCheck(item)}
                setActiveStatus={setActiveStatus}
              />
            ))}
        </>
      )}
      {open && (
        <SellerInbox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          userId={user._id}
          userData={userData}
          activeStatus={activeStatus}
        />
      )}
    </div>
  );
}

const MessageList = ({
  data,
  index,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  userData,
  online,
  setActiveStatus,
}) => {
  const [user, setUser] = useState([]);
  const navigate = useNavigate();

  const [active, setActive] = useState(0);
  const handleClick = (id) => {
    navigate(`/inbox?${id}`);
    setOpen(true);
  };
  useEffect(() => {
    // lay ra tin nhan gui den hoac gui di hien trong list message, vd: moi vao list message t thay tin nhan truoc do la You: hello
    const userId = data.members.find((user) => user !== me);

    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/shop/get-shop-info/${userId}`);
        setUser(res.data.shop);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [me, data]);

  return (
    <div
      className={`w-full flex p-3 px-3 ${
        active === index ? 'bg-[#00000010]' : 'bg-transparent'
      }  cursor-pointer`}
      onClick={(e) =>
        setActive(index) ||
        handleClick(data._id) ||
        setCurrentChat(data) ||
        setActiveStatus(online) ||
        setUserData(user)
      }
    >
      <div className="relative">
        <img
          src={`${backend_url}/${user?.avatar}`}
          alt=""
          className="w-[50px] h-[50px] rounded-full"
        />
        {online ? (
          <div className="w-[12px] h-[12px] bg-green-400 rounded-full absolute top-[2px] right-[2px]" />
        ) : (
          <div className="w-[12px] h-[12px] bg-[#c7b9b9] rounded-full absolute top-[2px] right-[2px]" />
        )}
      </div>
      <div className="pl-3">
        <h1 className=" text-[18px]">{user?.name}</h1>
        <p className="text-[16px] text-[#000c]">
          {/* neu id update tin nhan cuoi cung  khac voi id user thi se la phia seller nhan  */}
          {/* nguoc lai id update tin nhan cuoi cung = vs user id thi la user nhan tin */}
          {/* điều kiện sẽ trả về một chuỗi mới được tạo bằng cách lấy ký tự đầu tiên của tên người dùng (userData.name) và thêm dấu hai chấm. Ví dụ, nếu tên người dùng là "John", thì chuỗi này có thể trở thành "J: ". */}
          {data?.lastMessageId !== user?._id ? 'You: ' : user?.name.split('')[0] + ': '}
          {data?.lastMessage}
        </p>
      </div>
    </div>
  );
};

const SellerInbox = ({
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  userId,
  userData,
  activeStatus,
}) => {
  return (
    <div className="w-full min-h-full flex flex-col justify-between">
      {/* message header */}
      <div className="w-full flex p-3 items-center justify-between bg-slate-200">
        <div className="flex">
          <img
            src={`${backend_url}/${userData?.avatar}`}
            alt=""
            className="w-[60px] h-[60px] rounded-full"
          />
          <div className="pl-3">
            <h1 className="text-[18px] font-[600]">{userData?.name}</h1>
            <h1>{activeStatus ? 'Online' : 'Offline'}</h1>
          </div>
        </div>
        <AiOutlineArrowRight size={20} className="cursor-pointer" onClick={() => setOpen(false)} />
      </div>
      {/* message */}
      <div className="px-3 h-[65vh] py-3 overflow-y-scroll" style={{ marginRight: '-15px' }}>
        {messages &&
          messages.map((item, index) => (
            <div
              className={`${
                item.sender === userId ? 'justify-end ' : 'justify-start'
              } flex w-full my-2`}
            >
              {item.sender !== userId && (
                <img
                  src={`${backend_url}/${userData?.avatar}`}
                  alt=""
                  className="w-[40px] h-[40px] rounded-full mr-3"
                />
              )}
              {item.images && (
                <img
                  src={`${item.images?.url}`}
                  className="w-[300px] h-[300px] object-cover rounded-[10px] mr-2"
                  alt=""
                />
              )}
              {item.text !== '' && (
                <div>
                  <div
                    className={`w-max p-2 rounded ${
                      item.sender === userId ? 'bg-[#000]' : 'bg-[#38c776]'
                    } text-[#fff] h-min`}
                  >
                    <p>{item.text}</p>
                  </div>

                  <p className="text-[12px] text-[#000000d3] pt-1">{format(item.createdAt)}</p>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* send message  */}
      <form
        aria-required={true}
        className="p-3 relative w-full flex justify-between items-center"
        onSubmit={sendMessageHandler}
      >
        <div className="w-[3%]">
          <TfiGallery className="cursor-pointer" size={20} />
        </div>

        <div className="w-[97%]">
          <input
            type="text"
            required
            placeholder="Enter your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className={`${styles.input}`}
          />
          <input type="submit" value="Send" className="hidden" id="send" />
          <label htmlFor="send">
            <AiOutlineSend size={20} className="absolute right-4 top-5 cursor-pointer" />
          </label>
        </div>
      </form>
    </div>
  );
};

export default UserInbox;
