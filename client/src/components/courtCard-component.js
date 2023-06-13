import React from "react";
import { useNavigate } from "react-router-dom";
import CourtService from "../services/court.service";
const CourtCardComponent = ({
  currentUser,
  setCurrentGroup,
  reloadCourt,
  court,
  date,
  weekday,
  applier,
  expire,
  history,
  remain,
  extraCourt,
  headerColor,
  descriptionFrag,
  i,
}) => {
  const navigate = useNavigate();
  const handleViewGroup = (e) => {
    if (currentUser) {
      setCurrentGroup(e.target.value);
      navigate("/groupDetail");
    } else {
      window.alert("請先登入，才能查看球隊");
      navigate("/login");
    }
  };
  const handleCancel = (e) => {
    let action = window.confirm(`您確定要取消參加嗎?`);
    if (action) {
      CourtService.quit(e.target.value)
        .then((response) => {
          window.alert(response.data.msg);
          reloadCourt();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const handleEnroll = (e) => {
    if (currentUser) {
      CourtService.enroll(e.target.value)
        .then((response) => {
          window.alert(response.data.msg);
          if (applier) {
            navigate("/profile");
          } else {
            reloadCourt();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      window.alert("請先登入，才能報名場次");
      navigate("/login");
    }
  };
  return (
    <div className="card shadow">
      <div className={`card-header py-3 ${headerColor}`}>
        <h5 className="card-title">{`${date} ${weekday}`}</h5>
      </div>
      <div className="card-body">
        <div className="card-text">
          {descriptionFrag.map((frag) => {
            i++;
            return <div key={i}>{frag}</div>;
          })}
        </div>
      </div>
      <table className="table">
        <tbody>
          <tr>
            <th>球隊</th>
            <td colSpan={3}>
              <button
                className="groupName text-primary"
                onClick={handleViewGroup}
                value={court.group._id}
              >
                {court.group.name}
              </button>
            </td>
          </tr>
          <tr>
            <th>地點</th>
            <td colSpan={3}>{court.location}</td>
          </tr>
          <tr>
            <th>時間</th>
            <td>{court.startTime}</td>
            <th>時長</th>
            <td>{court.duration}hr</td>
          </tr>
          <tr>
            <th>價格</th>
            <td>{court.price}元</td>
            <th>場地</th>
            <td>{court.court}</td>
          </tr>
          <tr>
            <th colSpan={2}>人數上限</th>
            <td colSpan={2}>{court.amount}人</td>
          </tr>
          <tr>
            <th colSpan={2}>剩餘人數</th>
            <td colSpan={2}>{remain}人</td>
          </tr>
        </tbody>
      </table>
      {applier && (
        <div className="card-body d-flex justify-content-end">
          {expire && <p className="card-text">已過超過申請期限</p>}
          {!expire && (
            <>
              {remain > 0 && (
                <button
                  value={court._id}
                  onClick={handleEnroll}
                  className="btn btn-primary "
                >
                  申請加入
                </button>
              )}
              {remain <= 0 && (
                <button className="btn btn-outline-primary disabled">
                  目前已額滿
                </button>
              )}
            </>
          )}
        </div>
      )}
      {!history && (
        <div className="card-body d-flex justify-content-end">
          {extraCourt && (
            <button
              value={court._id}
              onClick={handleCancel}
              className="btn btn-primary "
            >
              取消參加
            </button>
          )}

          {!extraCourt && (
            <>
              {remain > 0 && (
                <button
                  value={court._id}
                  onClick={handleEnroll}
                  className="btn btn-primary "
                >
                  取消請假
                </button>
              )}
              {remain <= 0 && (
                <button className="btn btn-outline-primary disabled">
                  目前已額滿
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CourtCardComponent;
