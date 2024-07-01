import "./chat.css";
import useChatStore from "../../lib/chatStore";
import Messages from "./messages/Messages";
import SendMessage from "./sendMessage/SendMessage";
import { useEffect, useRef } from "react";
import { useMobile } from "../../context/Context";

const Chat = () => {
  const { value, setValue } = useMobile();

  console.log(value);
  const { chatId, user } = useChatStore();
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

  const goBack = (e) => {
    e.preventDefault();
    value.chatRef.current?.classList.remove("show-chat");
    value.listRef.current?.classList.remove("remove-list");
  };

  const openDetail = (e) => {
    e.preventDefault();
    e.stopPropagation();
    value.detailRef.current?.classList.add("show-detail");
  };

  return (
    <div className="chat" ref={chatRef}>
      {chatId ? (
        <>
          <div className="top">
            <div className="user">
              {value.isMobile < 576 && (
                <button className="go-back" onClick={goBack}>
                  &larr;
                </button>
              )}
              <img src={user?.avatar || "./avatar.png"} alt="" />

              <div className="texts">
                {value.isMobile > 400 && <span>{user?.username}</span>}
                {value.isMobile > 460 && <p>Lorem ipsum dolor, sit amet.</p>}
              </div>
            </div>
            <div className="icons">
              <img src="./phone.png" alt="" />
              <img src="./video.png" alt="" />
              <img src="./info.png" alt="" />

              {value.isMobile < 1030 && (
                <button className="open-detail" onClick={openDetail}>
                  &#10247;
                </button>
              )}
            </div>
          </div>

          <Messages />
          <SendMessage />
        </>
      ) : (
        <p className="load-chat">Select a chat to start messaging</p>
      )}
    </div>
  );
};

export default Chat;
