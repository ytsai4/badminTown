import React, { useRef, useState } from "react";
import GroupService from "../services/group.service";
import { useNavigate, Link } from "react-router-dom";

const PostGroupComponent = ({ currentUser, setCurrentUser }) => {
  let [message, setMessage] = useState("");
  let groupName = useRef(null);
  let description = useRef(null);
  let amount = useRef(null);
  const navigate = useNavigate();
  const handleTakeToLogin = () => {
    navigate("/login");
  };

  const postGroup = () => {
    let data = {
      name: groupName.current.value,
      description: description.current.value.replace(/\n|\r\n/g, "<br>"),
      amount: +amount.current.value,
    };
    GroupService.create(data)
      .then((response) => {
        window.alert(response.data.msg);
        navigate("/profile");
      })
      .catch((err) => {
        setMessage(err.response.data.msg);
      });
  };
  return (
    <div className="py-5 px-auto">
      {!currentUser && (
        <div className="text-center">
          <h3 className="mb-3">在創建新球隊之前，您必須先登入。</h3>
          <button
            className="btn btn-primary btn-md"
            onClick={handleTakeToLogin}
          >
            登入
          </button>
        </div>
      )}
      {currentUser && (
        <div>
          <div className="search d-flex flex-column gap-3 mx-auto">
            {message && (
              <div className="alert alert-warning" role="alert">
                {message}
              </div>
            )}
            <div className="form-group">
              <label htmlFor="exampleforTitle" className="form-label">
                球隊名稱：
              </label>
              <input
                name="groupName"
                type="text"
                className="form-control"
                id="exampleforTitle"
                minLength={6}
                maxLength={50}
                ref={groupName}
              />
            </div>
            <div className="form-group">
              <label htmlFor="exampleforContent" className="form-label">
                描述：
              </label>
              <textarea
                className="form-control"
                id="exampleforContent"
                name="content"
                ref={description}
                minLength={6}
                maxLength={255}
              />
            </div>
            <div className="form-group">
              <label htmlFor="exampleforAmount" className="form-label">
                人數上限：
              </label>
              <input
                name="amount"
                type="number"
                className="form-control"
                id="exampleforAmount"
                min={1}
                ref={amount}
              />
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-primary" onClick={postGroup}>
                創建球隊
              </button>
              <Link className="btn btn-primary" to="/profile">
                回到個人頁面
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostGroupComponent;
