import { useEffect, useRef, useState } from "react";
import "./chatList.css";
import useUserStore from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import useChatStore from "../../../lib/chatStore";
import AddMode from "./addMode/AddMode";
import { useMobile } from "../../../context/Context";

const ChatList = () => {
  const { value } = useMobile();

  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("");

  const { currentUser } = useUserStore();
  const { changeChat } = useChatStore();

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        // console.log(res.data());
        const items = res.data().chats;
        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.recieverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();
          return { ...item, user };
        });

        const chatData = await Promise.all(promises);
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    if (value.isMobile < 576) {
      value.chatRef.current?.classList.add("show-chat");
      value.listRef.current?.classList.add("remove-list");
    } else {
      value.chatRef.current?.classList.remove("show-chat");
      value.listRef.current?.classList.remove("remove-list");
    }

    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser.id);

    try {
      await updateDoc(userChatsRef, { chats: userChats });
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <AddMode />
      </div>

      {filteredChats.map((chat) => (
        <div
          className="item"
          key={chat.chatId}
          onClick={() => handleSelect(chat)}
        >
          <div className="item-content">
            <img
              src={
                chat.user.blocked.includes(currentUser.id)
                  ? "./avatar.png"
                  : chat.user.avatar
              }
              alt=""
            />
            <div className="texts">
              <span>
                {chat.user.blocked.includes(currentUser.id)
                  ? "User"
                  : chat.user.username}
              </span>
              <p>{chat.lastMessage}</p>
            </div>
          </div>

          {chat?.isSeen ? "" : <div className="new__msg">New</div>}
        </div>
      ))}
    </div>
  );
};

export default ChatList;
