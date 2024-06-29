import "./list.css";
import ChatList from "./chatList/ChatList";
import UserInfo from "./userInfo/UserInfo";
import { useMobile } from "../../context/Context";
import { useRef } from "react";

const List = () => {
  const isMobile = useMobile();
  const ref = useRef(null);

  // if (isMobile && ref.current) {
  //   ref.current.style.backgroundColor = "lightblue";
  // } else {
  //   ref.current.style.backgroundColor = "red";
  // }

  return (
    <div className="list" ref={ref}>
      <UserInfo />
      <ChatList />
    </div>
  );
};

export default List;
