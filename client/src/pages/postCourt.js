import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import GroupService from "../services/group.service";
import CourtService from "../services/court.service";
const PostCourtComponent = ({ currentUser, setCurrentUser }) => {
  let [message, setMessage] = useState("");
  let [groups, setGroups] = useState(null);
  useEffect(() => {
    if (currentUser) {
      GroupService.getByOwnerId()
        .then((response) => {
          setGroups(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [currentUser]);
  let date = useRef(null);
  let startTime = useRef(null);
  let duration = useRef(null);
  let location = useRef(null);
  let court = useRef(null);
  let amount = useRef(null);
  let price = useRef(null);
  let description = useRef(null);
  let [groupId, setGroupId] = useState("");

  const navigate = useNavigate();
  const handleTakeToLogin = () => {
    navigate("/login");
  };
  const handleChangeGroupId = (e) => {
    setGroupId(e.target.value);
  };
  const handleTakeToPostGroup = () => {
    navigate("/postGroup");
  };
  const postCourt = () => {
    let data = {
      date: date.current.value,
      startTime: startTime.current.value,
      duration: +duration.current.value,
      location: location.current.value,
      court: +court.current.value,
      amount: +amount.current.value,
      price: +price.current.value,
      group: groupId,
      description: description.current.value.replace(/\n|\r\n/g, "<br>"),
    };
    CourtService.create(data)
      .then((response) => {
        window.alert(response.data.msg);
        navigate("/profile");
      })
      .catch((err) => {
        console.log(err);
        setMessage(err.response.data.msg);
      });
  };

  return (
    <div className="py-5 px-auto">
      {!currentUser && (
        <div className="text-center">
          <h3 className="mb-3">在創建新場次之前，您必須先登入。</h3>
          <button
            className="btn btn-primary btn-md"
            onClick={handleTakeToLogin}
          >
            登入
          </button>
        </div>
      )}
      {currentUser && groups && groups.length === 0 && (
        <div className="text-center">
          <h3 className="mb-3">在新增場次之前，您必須先建立球隊。</h3>
          <button
            className="btn btn-primary btn-md"
            onClick={handleTakeToPostGroup}
          >
            建立球隊
          </button>
          <Link className="btn btn-primary mx-2" to="/profile">
            回到個人頁面
          </Link>
        </div>
      )}
      {currentUser && groups && groups.length !== 0 && (
        <div>
          <div className="container search row g-3 mx-auto">
            <div className="form-group col-md-4">
              <label htmlFor="courtDate" className="form-label">
                日期:
              </label>
              <input
                className="form-control "
                type="date"
                name="courtDate"
                id="courtDate"
                ref={date}
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="courtTime" className="form-label">
                時間:
              </label>
              <input
                className="form-control"
                type="time"
                name="courtTime"
                id="courtTime"
                ref={startTime}
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="duration" className="form-label">
                時長:
              </label>
              <input
                className="form-control"
                type="number"
                min={1}
                max={24}
                name="duration"
                id="duration"
                ref={duration}
              />
            </div>
            <div className="form-group col-12">
              <label htmlFor="location" className="form-label">
                地點:
              </label>
              <input
                className="form-control"
                type="text"
                name="location"
                id="location"
                minLength={6}
                maxLength={255}
                ref={location}
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="court" className="form-label">
                場地:
              </label>
              <input
                className="form-control"
                type="number"
                name="court"
                id="court"
                min={1}
                ref={court}
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="amount" className="form-label">
                人數:
              </label>
              <input
                className="form-control"
                type="number"
                name="amount"
                id="amount"
                min={1}
                ref={amount}
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="price" className="form-label">
                價格:
              </label>
              <input
                className="form-control"
                type="number"
                name="price"
                id="price"
                min={10}
                ref={price}
              />
            </div>

            <div className="form-group col-12">
              <label htmlFor="select" className="form-label">
                球隊:
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
                id="select"
                onChange={handleChangeGroupId}
                value={groupId}
              >
                <option defaultValue value="">
                  請選擇
                </option>
                {groups.map((group) => {
                  return (
                    <option value={group._id} key={group._id}>
                      {group.name} (目前人數: {group.members.length})
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="form-group col-12">
              <label htmlFor="description" className="form-label">
                描述:
              </label>
              <textarea
                className="form-control"
                name="description"
                id="description"
                minLength={6}
                maxLength={255}
                ref={description}
              />
            </div>
            {message && (
              <div className="alert alert-warning mx-auto col-12" role="alert">
                {message}
              </div>
            )}
            <div className="d-flex gap-2 justify-content-end col-12">
              <button className="btn btn-primary" onClick={postCourt}>
                新增場次
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

export default PostCourtComponent;
