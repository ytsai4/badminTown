import React, { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../services/auth.service";

const LoginComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  let email = useRef(null);
  let password = useRef(null);
  let [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      let response = await AuthService.login(
        email.current.value,
        password.current.value
      );

      localStorage.setItem("user", JSON.stringify(response.data));
      window.alert(response.data.msg + " 您將被導入個人頁面");
      setCurrentUser(AuthService.getCurrentUser());
      navigate("/profile");
    } catch (err) {
      setMessage(err.response.data.msg);
    }
  };
  const handleLoginTest = async () => {
    try {
      let response = await AuthService.login("test@mail.com", "12345678");

      localStorage.setItem("user", JSON.stringify(response.data));
      window.alert(response.data.msg + " 您將被導入個人頁面");
      setCurrentUser(AuthService.getCurrentUser());
      navigate("/profile");
    } catch (err) {
      setMessage(err.response.data.msg);
    }
  };

  return (
    <div className="py-5 ">
      {currentUser && (
        <h3 className="text-center mb-3">
          目前為登入狀態，欲切換帳號，請先登出。
        </h3>
      )}
      {!currentUser && (
        <div className="d-flex flex-column align-items-center mx-auto">
          {message && <div className="alert alert-danger">{message}</div>}
          <div className="form-signin w-100 mx-auto border rounded-3 bg-body-tertiary">
            <h3 className="text-center mb-3">登入</h3>
            <div className="form-floating">
              <input
                type="email"
                ref={email}
                className="form-control"
                id="floatingInput"
                placeholder="name@example.com"
              />
              <label htmlFor="floatingInput">請輸入電子信箱</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
                ref={password}
                minLength={8}
              />
              <label htmlFor="floatingPassword">請輸入密碼</label>
            </div>
            <div className="form-group d-flex justify-content-between align-items-center">
              <div className="p-1">
                <Link
                  className="link-offset-2 link-underline link-underline-opacity-0"
                  to="/register"
                >
                  註冊會員
                </Link>
              </div>
              <button
                onClick={handleLoginTest}
                className="btn text-secondary btn-block"
              >
                測試帳號登入
              </button>
              <button
                onClick={handleLogin}
                className="btn btn-primary btn-block"
              >
                登入
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginComponent;
