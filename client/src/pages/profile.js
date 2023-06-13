import React from "react";
import { useEffect, useState } from "react";
import GroupService from "../services/group.service";
import { useNavigate, Link } from "react-router-dom";
import GroupCardComponent from "../components/groupCard-component";
import CourtService from "../services/court.service";
import CourtCardComponent from "../components/courtCard-component";
const ProfileComponent = ({ currentUser, setCurrentGroup }) => {
  let [ownGroup, setOwnGroup] = useState(null);
  let [groupMember, setGroupMember] = useState(null);
  let [myExtraCourt, setMyExtraCourt] = useState(null);
  let [myAbsentCourt, setMyAbsentCourt] = useState(null);
  const reloadOwnGroup = async () => {
    try {
      let result = await GroupService.getByOwnerId();
      setOwnGroup(result.data);
    } catch (err) {
      console.log(err);
    }
  };
  const reloadGroupMember = () => {
    GroupService.getByMemberId()
      .then((response) => {
        setGroupMember(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const reloadCourt = () => {
    CourtService.findByAbsent()
      .then((response) => {
        setMyAbsentCourt(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
    CourtService.findByExtra()
      .then((response) => {
        setMyExtraCourt(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    reloadOwnGroup();
    reloadGroupMember();
    reloadCourt();
  }, []);
  const navigate = useNavigate();
  const handleTakeToLogin = () => {
    navigate("/login");
  };
  const handleViewGroup = (e) => {
    setCurrentGroup(e.target.value);
    navigate("/groupDetail");
  };
  const handleDelete = (e) => {
    let action = window.confirm(
      `您確定要刪除球隊${e.target.name}嗎?\n注意!!將一併刪除該球隊的所有歷史場次`
    );
    if (action) {
      GroupService.delete(e.target.value)
        .then((response) => {
          window.alert(response.data.msg);
          reloadOwnGroup();
        })
        .catch((err) => {
          window.alert(err.response.data.msg);
        });
    } else {
      window.alert("已取消刪除");
    }
  };
  const handleDrop = (e) => {
    let action = window.confirm(`您確定要退出球隊${e.target.name}嗎?`);
    if (action) {
      GroupService.drop(e.target.value)
        .then((response) => {
          window.alert(response.data.msg);
          reloadGroupMember();
          reloadCourt();
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      window.alert("已取消退出");
    }
  };
  return (
    <div className="py-5 px-auto">
      {!currentUser && (
        <div className="text-center">
          <h3 className="mb-3">您必須先登入，才能瀏覽個人資料。</h3>
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
          <h1 className="text-center mb-3">
            {currentUser.user.username}，歡迎回來!
          </h1>
          <div className="row">
            <div className="col-md-6 m-auto ">
              <h3 className="text-center">個人資料</h3>
              <table className="table shadow">
                <thead>
                  <tr>
                    <th>用戶名稱</th>
                    <th>信箱</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{currentUser.user.username}</td>
                    <td>{currentUser.user.email}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="d-flex gap-2 flex-wrap justify-content-center my-3">
            <Link className="btn btn-badminton d-block " to="/postGroup">
              新增球隊
            </Link>
            <Link className="btn btn-badminton d-block " to="/postCourt">
              新增場次
            </Link>
            <Link className="btn btn-badminton d-block " to="/editPassword">
              變更密碼
            </Link>
            <Link className="btn btn-badminton d-block " to="/editUsername">
              變更名稱
            </Link>
          </div>

          <div className="container">
            <div className="row g-3 ">
              <div className="col-md-6">
                <h3 className="text-center">我的球隊</h3>
                <hr />
                {ownGroup && ownGroup.length === 0 && (
                  <p className="text-center">目前尚未建立球隊</p>
                )}
                {ownGroup && ownGroup.length !== 0 && (
                  <div className="d-flex flex-wrap gap-3 align-items-baseline justify-content-center">
                    {ownGroup.map((group) => {
                      let descriptionFrag = group.description.split("<br>");
                      let i = 0;
                      return (
                        <GroupCardComponent
                          key={group._id}
                          handleDelete={handleDelete}
                          handleDrop={handleDrop}
                          handleEnroll={null}
                          handleViewGroup={handleViewGroup}
                          group={group}
                          descriptionFrag={descriptionFrag}
                          i={i}
                          applier={false}
                          owner={true}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="col-md-6">
                <h3 className="text-center">我加入的球隊</h3>
                <hr />
                {groupMember && groupMember.length === 0 && (
                  <p className="text-center">目前尚未加入球隊</p>
                )}
                {groupMember && groupMember.length !== 0 && (
                  <div className="d-flex flex-wrap gap-3 align-items-baseline justify-content-center">
                    {groupMember.map((group) => {
                      let descriptionFrag = group.description.split("<br>");
                      let i = 0;
                      return (
                        <GroupCardComponent
                          key={group._id}
                          handleDelete={handleDelete}
                          handleDrop={handleDrop}
                          handleEnroll={null}
                          handleViewGroup={handleViewGroup}
                          group={group}
                          descriptionFrag={descriptionFrag}
                          i={i}
                          applier={false}
                          owner={false}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <h3 className="text-center mt-3">將來的場次</h3>
            <hr />
            <div className="d-flex flex-wrap gap-3 mt-3 justify-content-center">
              {myExtraCourt && (
                <div>
                  <h4 className="text-center">臨打場次</h4>
                  {myExtraCourt.length === 0 && (
                    <p className="text-center">目前尚未報名臨打</p>
                  )}
                  {myExtraCourt.length !== 0 && (
                    <div className="d-flex flex-wrap gap-3 px-align-items-baseline justify-content-center">
                      {myExtraCourt.map((court) => {
                        let compareDate = new Date(court.date);
                        if (compareDate.getTime() > new Date().getTime()) {
                          let index = court.date.indexOf("T");
                          let date = court.date.slice(0, index);

                          const weekday = compareDate
                            .toDateString()
                            .slice(0, 3);

                          let remain =
                            court.amount -
                            court.group.members.length +
                            court.absent.length -
                            court.extra.length;
                          let descriptionFrag = court.description.split("<br>");
                          let i = 0;
                          return (
                            <CourtCardComponent
                              key={court._id}
                              currentUser={currentUser}
                              setCurrentGroup={setCurrentGroup}
                              reloadCourt={reloadCourt}
                              court={court}
                              date={date}
                              weekday={weekday}
                              applier={false}
                              expire={null}
                              history={false}
                              remain={remain}
                              extraCourt={true}
                              headerColor="text-bg-primary"
                              descriptionFrag={descriptionFrag}
                              i={i}
                            />
                          );
                        } else {
                          return null;
                        }
                      })}
                    </div>
                  )}
                </div>
              )}
              {myAbsentCourt && (
                <div>
                  <h4 className="text-center">請假場次</h4>
                  {myAbsentCourt.length === 0 && (
                    <p className="text-center">目前尚未請假</p>
                  )}
                  {myAbsentCourt.length !== 0 && (
                    <div className="d-flex flex-wrap gap-3 align-items-baseline justify-content-center">
                      {myAbsentCourt.map((court) => {
                        let compareDate = new Date(court.date);
                        if (compareDate.getTime() > new Date().getTime()) {
                          let index = court.date.indexOf("T");
                          let date = court.date.slice(0, index);

                          const weekday = compareDate
                            .toDateString()
                            .slice(0, 3);

                          let remain =
                            court.amount -
                            court.group.members.length +
                            court.absent.length -
                            court.extra.length;
                          let descriptionFrag = court.description.split("<br>");
                          let i = 0;
                          return (
                            <CourtCardComponent
                              key={court._id}
                              currentUser={currentUser}
                              setCurrentGroup={setCurrentGroup}
                              reloadCourt={reloadCourt}
                              court={court}
                              date={date}
                              weekday={weekday}
                              applier={false}
                              expire={null}
                              history={false}
                              remain={remain}
                              extraCourt={false}
                              headerColor="text-bg-primary"
                              descriptionFrag={descriptionFrag}
                              i={i}
                            />
                          );
                        } else {
                          return null;
                        }
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            <h3 className="text-center mt-3">歷史場次</h3>
            <hr />
            <div className="d-flex flex-wrap gap-3 mt-3 justify-content-center">
              {myExtraCourt && (
                <div>
                  <h4 className="text-center">臨打場次</h4>
                  {myExtraCourt.length !== 0 && (
                    <div className="d-flex flex-wrap gap-3 align-items-baseline justify-content-center">
                      {myExtraCourt.map((court) => {
                        let compareDate = new Date(court.date);
                        if (compareDate.getTime() <= new Date().getTime()) {
                          let index = court.date.indexOf("T");
                          let date = court.date.slice(0, index);

                          const weekday = compareDate
                            .toDateString()
                            .slice(0, 3);
                          let remain =
                            court.amount -
                            court.group.members.length +
                            court.absent.length -
                            court.extra.length;
                          let descriptionFrag = court.description.split("<br>");
                          let i = 0;
                          return (
                            <CourtCardComponent
                              key={court._id}
                              currentUser={currentUser}
                              setCurrentGroup={setCurrentGroup}
                              reloadCourt={reloadCourt}
                              court={court}
                              date={date}
                              weekday={weekday}
                              applier={false}
                              expire={null}
                              history={true}
                              remain={remain}
                              extraCourt={true}
                              headerColor="text-bg-secondary"
                              descriptionFrag={descriptionFrag}
                              i={i}
                            />
                          );
                        } else {
                          return null;
                        }
                      })}
                    </div>
                  )}
                </div>
              )}
              {myAbsentCourt && (
                <div>
                  <h4 className="text-center">請假場次</h4>
                  {myAbsentCourt.length !== 0 && (
                    <div className="d-flex flex-wrap gap-3 align-items-baseline justify-content-center">
                      {myAbsentCourt.map((court) => {
                        let compareDate = new Date(court.date);
                        if (compareDate.getTime() <= new Date().getTime()) {
                          let index = court.date.indexOf("T");
                          let date = court.date.slice(0, index);

                          const weekday = compareDate
                            .toDateString()
                            .slice(0, 3);
                          let remain =
                            court.amount -
                            court.group.members.length +
                            court.absent.length -
                            court.extra.length;
                          let descriptionFrag = court.description.split("<br>");
                          let i = 0;
                          return (
                            <CourtCardComponent
                              key={court._id}
                              currentUser={currentUser}
                              setCurrentGroup={setCurrentGroup}
                              reloadCourt={reloadCourt}
                              court={court}
                              date={date}
                              weekday={weekday}
                              applier={false}
                              expire={null}
                              history={true}
                              remain={remain}
                              extraCourt={true}
                              headerColor="text-bg-secondary"
                              descriptionFrag={descriptionFrag}
                              i={i}
                            />
                          );
                        } else {
                          return null;
                        }
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;
