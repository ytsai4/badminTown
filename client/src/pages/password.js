import React, { useRef, useState } from "react";
import AuthService from "../services/auth.service";
import { useNavigate, Link } from "react-router-dom";

const PasswordComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  let oldPassword = useRef(null);
  let newPassword = useRef(null);
  let rePassword = useRef(null);
  let [message, setMessage] = useState("");
  const handleTakeToLogin = () => {
    navigate("/login");
  };

  const handleEdit = () => {
    if (rePassword.current.value === "") {
      setMessage("請再次輸入新密碼");
      return;
    } else if (rePassword.current.value !== newPassword.current.value) {
      setMessage("新密碼不一致");
      return;
    }
    AuthService.password(oldPassword.current.value, newPassword.current.value)
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
    <div className="container py-5 px-auto">
      {!currentUser && (
        <div className="text-center">
          <h3 className="mb-3">變更密碼之前，您必須先登入。</h3>
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
          <h3 className="text-center">變更密碼</h3>
          <div className="form-group">
            <label htmlFor="old" className="form-label">
              舊密碼:
            </label>
            <input
              ref={oldPassword}
              type="password"
              placeholder="請輸入舊密碼"
              minLength={8}
              className="form-control"
              name="old"
              id="old"
            />
          </div>
          <div className="form-group">
            <label htmlFor="new" className="form-label">
              新密碼:
            </label>
            <input
              ref={newPassword}
              type="password"
              className="form-control"
              placeholder="長度至少超過8個英文或數字"
              minLength={8}
              name="new"
              id="new"
            />
          </div>
          <div className="form-group">
            <label htmlFor="re" className="form-label">
              再次輸入新密碼:
            </label>
            <input
              ref={rePassword}
              type="password"
              placeholder="請再次輸入新密碼"
              minLength={8}
              className="form-control"
              name="re"
              id="re"
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

export default PasswordComponent;
