import React, { useRef, useState } from "react";
import AuthService from "../services/auth.service";
import { useNavigate, Link } from "react-router-dom";

const UsernameComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  let username = useRef(null);
  let [message, setMessage] = useState("");

  const handleTakeToLogin = () => {
    navigate("/login");
  };
  const handleEdit = () => {
    AuthService.edit(username.current.value)
      .then((response) => {
        window.alert(response.data.msg + " 已自動登出，您將被導入登入頁面");
        AuthService.logout();
        setCurrentUser(null);
        navigate("/login");
      })
      .catch((err) => {
        setMessage(err.response.data.msg);
      });
  };
  return (
    <div className="py-5 px-auto">
      {!currentUser && (
        <div className="text-center">
          <h3 className="mb-3">變更用戶名稱之前，您必須先登入。</h3>
          <button
            className="btn btn-primary btn-md"
            onClick={handleTakeToLogin}
          >
            登入
          </button>
        </div>
      )}
      {currentUser && (
        <div className="search d-flex flex-column gap-3 mx-auto">
          {message && <div className="alert alert-danger">{message}</div>}
          <h3 className="text-center">變更名稱</h3>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              用戶名稱:
            </label>
            <input
              ref={username}
              type="text"
              className="form-control"
              name="username"
              id="username"
            />
          </div>
          <div className="d-flex gap-2 align-self-end">
            <button onClick={handleEdit} className="btn btn-primary">
              變更
            </button>
            <Link className="btn btn-primary" to="/profile">
              回到個人頁面
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsernameComponent;
