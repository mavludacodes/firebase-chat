import "./list.css";
import ChatList from "./chatList/ChatList";
import UserInfo from "./userInfo/UserInfo";
import { useMobile } from "../../context/Context";
import { useRef, useEffect } from "react";

const List = () => {
  const { value, setValue } = useMobile();
  const listRef = useRef(null);

  useEffect(() => {
    setValue((prev) => ({
      ...prev,
      listRef,
    }));
  }, []);

  return (
    <div className="list" ref={listRef}>
      <UserInfo />
      <ChatList />
    </div>
  );
};

export default List;
