import { auth, db } from "../../lib/firebase";
import "./detail.css";
import useChatStore from "../../lib/chatStore";
import useUserStore from "../../lib/userStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useMobile } from "../../context/Context";
import { useEffect, useRef } from "react";

const Detail = () => {
  const { value, setValue } = useMobile();
  const detailRef = useRef(null);
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
    useChatStore();

  const { currentUser } = useUserStore();

  useEffect(() => {
    if (value.isMobile < 1030 && detailRef.current) {
      detailRef.current.classList.add("isMobile-detail");
    } else {
      detailRef.current.classList.remove("isMobile-detail");
    }
  }, [value]);

  useEffect(() => {
    setValue((prev) => ({
      ...prev,
      detailRef,
    }));
  }, []);

  const handleBlock = async (e) => {
    e.preventDefault();

    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);
    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const handleClick = () => {
      console.log("hhoo");
      value.detailRef?.current?.classList.remove("show-detail");
    };
    handleClick();
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [value]);

  return (
    <div className="detail" ref={detailRef}>
      {chatId && (
        <>
          <div className="user">
            <img src={user?.avatar || "./avatar.png"} alt="" />
            <h2>{user?.username}</h2>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>

          <div className="info">
            <div className="option">
              <div className="title">
                <span>Chat Settings</span>
                <img src="./arrowUp.png" alt="" />
              </div>
            </div>
            <div className="option">
              <div className="title">
                <span>Privacy & help</span>
                <img src="./arrowUp.png" alt="" />
              </div>
            </div>
            <div className="option">
              <div className="title">
                <span>Shared Photos </span>
                <img src="./arrowDown.png" alt="" />
              </div>
              <div className="photos">
                <div className="photoItem">
                  <div className="photoDetail">
                    <img src="./avatar.png" alt="" />
                    <span>photo_2024_2.png</span>
                  </div>
                  <img src="./download.png" alt="" className="icon" />
                </div>
              </div>
            </div>
            <div className="option">
              <div className="title">
                <span>Shared Files</span>
                <img src="./arrowUp.png" alt="" />
              </div>
            </div>

            <button onClick={handleBlock}>
              {isCurrentUserBlocked
                ? "You are blocked!"
                : isReceiverBlocked
                ? "User blocked"
                : "Block User"}
            </button>
            <button className="logout" onClick={() => auth.signOut()}>
              Log out
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Detail;
