import "./chat.css";
import useChatStore from "../../lib/chatStore";
import Messages from "./messages/Messages";
import SendMessage from "./sendMessage/SendMessage";
import { useEffect, useRef } from "react";
import { useMobile } from "../../context/Context";

const Chat = () => {
  const { value, setValue } = useMobile();

  console.log(value);
  const { user } = useChatStore();

  const chatRef = useRef(null);

  useEffect(() => {
    if (value.isMobile < 576 && chatRef.current) {
      chatRef.current.classList.add("isMobile-chat");
    } else {
      chatRef.current.classList.remove("isMobile-chat");
    }
  }, [value]);

  useEffect(() => {
    setValue((prev) => ({
      ...prev,
      chatRef,
    }));
  }, []);

  return (
    <div className="chat" ref={chatRef}>
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

      {/* <Messages /> */}
      <SendMessage />
    </div>
  );
};

export default Chat;
