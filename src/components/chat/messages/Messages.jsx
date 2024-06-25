import { useState, useEffect, useRef } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import useChatStore from "../../../lib/chatStore";
import useUserStore from "../../../lib/userStore";
import "./messages.css";

const Messages = () => {
  const [chats, setChats] = useState();

  const bottomRef = useRef();
  const { currentUser } = useUserStore();
  const { chatId } = useChatStore();

  useEffect(() => {
    bottomRef.current.scrollTop = bottomRef.current.scrollHeight;
  }, [chats]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChats(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);
  return (
    <div className="messages" ref={bottomRef}>
      {chats?.messages.map((message) => (
        <div
          className={
            message.senderId === currentUser.id ? "message own" : "message"
          }
          key={message?.createdAt}
        >
          <div className="texts">
            {message.img && <img src={message.img} alt="" />}
            {message.text && <p>{message.text}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Messages;
