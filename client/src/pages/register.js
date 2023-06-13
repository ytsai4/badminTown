import React, { useRef, useState } from "react";
import AuthService from "../services/auth.service";
import { useNavigate } from "react-router-dom";

const RegisterComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  let username = useRef(null);
  let email = useRef(null);
  let password = useRef(null);
  let [message, setMessage] = useState("");

  const handleRegister = () => {
    AuthService.register(
      username.current.value,
      email.current.value,
      password.current.value
    )
      .then((response) => {
        window.alert(response.data.msg + " 您將被導入登入頁面");
        navigate("/login");
      })
      .catch((e) => {
        setMessage(e.response.data.msg);
      });
  };
  return (
    <div className="py-5">
      {currentUser && (
        <h3 className="text-center mb-3">
          目前為登入狀態，欲註冊新帳號，請先登出。
        </h3>
      )}
      {!currentUser && (
        <div className="d-flex flex-column align-items-center mx-auto">
          {message && <div className="alert alert-danger">{message}</div>}
          <div className="form-register w-100 mx-auto border rounded-3 bg-body-tertiary">
            <h3 className="text-center mb-3">註冊會員</h3>
            <p className="text-center mb-3 text-warning-emphasis bg-warning-subtle border-start mx-auto rounded-3">
              本網站僅供練習用，
              <br />
              請勿提供個人真實資料。
            </p>
            <div className="form-group mb-3">
              <label htmlFor="username" className="form-label">
                用戶名稱：
              </label>
              <input
                ref={username}
                type="text"
                className="form-control"
                name="username"
                id="username"
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="email" className="form-label">
                電子信箱：
              </label>
              <input
                ref={email}
                type="text"
                className="form-control"
                name="email"
                id="email"
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password" className="form-label">
                密碼：
              </label>
              <input
                ref={password}
                type="password"
                className="form-control"
                name="password"
                id="password"
                placeholder="長度至少超過8個英文或數字"
                minLength={8}
              />
            </div>
            <div className="d-flex">
              <button
                onClick={handleRegister}
                className="btn btn-primary flex-fill"
              >
                註冊
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterComponent;
