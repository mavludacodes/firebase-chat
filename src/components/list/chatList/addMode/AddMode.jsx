import { useState } from "react";
import AddUser from "./addUser/AddUser";

const AddMode = () => {
  const [addMode, setAddMode] = useState(false);

  return (
    <>
      <img
        src={addMode ? "./minus.png" : "./plus.png"}
        alt=""
        className="add"
        onClick={() => setAddMode((prev) => !prev)}
      />

      {addMode && <AddUser setAddMode={setAddMode} />}
    </>
  );
};

export default AddMode;
