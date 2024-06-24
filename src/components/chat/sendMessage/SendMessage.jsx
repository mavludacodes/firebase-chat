import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import useChatStore from "../../../lib/chatStore";
import useUserStore from "../../../lib/userStore";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import upload from "../../../lib/upload";
import SendImage from "../sendImage/SendImage";
import "./sendMessage.css";

const SendMessage = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (text === "") return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
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
    } catch (err) {
      console.log(err);
    }

    setImg({
      file: null,
      url: "",
    });
    setText("");
  };

  return (
    <div className="sendMessage">
      <div className="icons">
        {/* <label htmlFor="file">
          <img src="./img.png" alt="" />
        </label>
        <input
          type="file"
          id="file"
          style={{ display: "none" }}
          onChange={handleImg}
        /> */}
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
