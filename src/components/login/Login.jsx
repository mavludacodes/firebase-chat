import { useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../../lib/upload";
import useUserStore from "../../lib/userStore";

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const [haveAccount, setHaveAccount] = useState(true);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const { fetchUserInfo } = useUserStore();

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading2(true);
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const imgUrl = await upload(avatar.file);
      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });
      toast.success("Account created! You can login now!");
      setHaveAccount(true);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading2(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading1(true);
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      fetchUserInfo(res.user.uid);
    } catch (error) {
      console.log(error);
      toast.error(error);
    } finally {
      setLoading1(false);
    }
  };

  return (
    <div className="login">
      {haveAccount ? (
        <div className="item">
          <h2>Welcome back</h2>
          <form onSubmit={handleLogin}>
            <input type="text" placeholder="Email" name="email" />
            <input type="password" placeholder="Password" name="password" />
            <button disabled={loading1}>
              {loading1 ? "Loading" : "Sign In"}
            </button>

            <p>
              Don't have an account?{" "}
              <span
                className="have-account"
                onClick={() => setHaveAccount(false)}
              >
                Register
              </span>{" "}
            </p>
          </form>
        </div>
      ) : (
        <div className="item">
          <h2>Create an Account</h2>
          <form onSubmit={handleRegister}>
            <label htmlFor="file">
              <img src={avatar.url || "./avatar.png"} alt="" />
              Upload an image
            </label>
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={handleAvatar}
            />
            <input type="text" placeholder="Username" name="username" />
            <input type="text" placeholder="Email" name="email" />
            <input type="password" placeholder="Password" name="password" />
            <button disabled={loading2}>
              {loading2 ? "Loading" : "Sign Up"}
            </button>
            <p>
              Already have an account?{" "}
              <span
                className="have-account"
                onClick={() => setHaveAccount(true)}
              >
                Login
              </span>{" "}
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
