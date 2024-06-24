import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import useChatStore from "../../../lib/chatStore";
import useUserStore from "../../../lib/userStore";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import SendImage from "../sendImage/SendImage";
import "./sendMessage.css";

const SendMessage = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (text === "") return;

    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
        }),
      });

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatSnapshot = await getDoc(userChatsRef);

        if (userChatSnapshot.exists()) {
          const userChatsData = userChatSnapshot.data();
          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, { chats: userChatsData.chats });
        }
      });
      setText("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="sendMessage">
      <div className="icons">
        <SendImage />
        <img src="./camera.png" alt="" />
        <img src="./mic.png" alt="" />
      </div>
      <input
        className="text-input"
        type="text"
        placeholder={
          isCurrentUserBlocked || isReceiverBlocked
            ? "You cannot send a message"
            : "Type a message..."
        }
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isCurrentUserBlocked || isReceiverBlocked}
      />
      <div className="emoji">
        <img
          src="./emoji.png"
          alt=""
          onClick={() => setOpen((prev) => !prev)}
        />
        <div className="picker">
          <EmojiPicker open={open} onEmojiClick={handleEmoji} />
        </div>
      </div>
      <button
        className="sendButton"
        onClick={handleSend}
        disabled={isCurrentUserBlocked || isReceiverBlocked}
      >
        Send
      </button>
    </div>
  );
};

export default SendMessage;
