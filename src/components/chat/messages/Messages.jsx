import { useState, useEffect, useRef } from "react";

import {
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import useChatStore from "../../../lib/chatStore";
import useUserStore from "../../../lib/userStore";

const Messages = () => {
  const [chats, setChats] = useState();

  const endRef = useRef(null);
  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChats(res.data());
    });

    return () => {
      unSub();
    };
  }, []);
  return (
    <>
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
            {/* <span>1 min ago</span> */}
          </div>
        </div>
      ))}

      {/* {img.url && (
        <div className="message own">
          <div className="texts">
            <img src={img.url} alt="" />
          </div>
        </div>
      )} */}
      <div ref={endRef}></div>
    </>
  );
};

export default Messages;
