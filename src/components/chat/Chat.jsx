import "./chat.css";
import useChatStore from "../../lib/chatStore";
import Messages from "./messages/Messages";
import SendMessage from "./sendMessage/SendMessage";

const Chat = () => {
  const { user } = useChatStore();

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="" />

          <div className="texts">
            <span>{user?.username}</span>
            <p>Lorem ipsum dolor, sit amet.</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>

      <Messages />

      <div className="bottom">
        <SendMessage />
      </div>
    </div>
  );
};

export default Chat;
