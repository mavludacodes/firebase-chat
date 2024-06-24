import { useState } from "react";
import { createPortal } from "react-dom";
import "./sendImage.css";

import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import upload from "../../../lib/upload";
import useChatStore from "../../../lib/chatStore";
import useUserStore from "../../../lib/userStore";

const SendImage = () => {
  const [img, setImg] = useState({
    file: null,
    url: null,
  });

  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();

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
    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
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
      url: null,
    });
  };

  return (
    <div className="sendImage">
      <label htmlFor="file">
        <img src="./img.png" alt="" />
      </label>
      <input
        type="file"
        id="file"
        style={{ display: "none" }}
        onChange={handleImg}
        disabled={isCurrentUserBlocked || isReceiverBlocked}
      />

      {img?.url &&
        createPortal(
          <div className="image-preview">
            <img src={img?.url || "./avatar.png"} alt="" />
            <div className="btns-container">
              <button
                onClick={() => {
                  setImg({
                    file: null,
                    url: null,
                  });
                }}
              >
                Cancel
              </button>
              <button onClick={handleSend}>Send</button>
            </div>
          </div>,
          document.getElementById("root")
        )}
    </div>
  );
};

export default SendImage;
