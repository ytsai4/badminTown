import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import GroupService from "../services/group.service";
import AuthService from "../services/auth.service";
import CourtService from "../services/court.service";
const GroupDetailComponent = ({
  currentUser,
  setCurrentUser,
  currentGroup,
  setCurrentGroup,
}) => {
  let [group, setGroup] = useState(null);
  let [owner, setOwner] = useState(false);
  let [member, setMember] = useState([]);
  let [courts, setCourts] = useState(null);
  let [absentMember, setAbsentMember] = useState([]);
  let [extra, setExtra] = useState([]);
  let [historyAbsent, setHistoryAbsent] = useState([]);
  let [historyExtra, setHistoryExtra] = useState([]);
  let [fragments, setFragments] = useState([]);
  let [j, setJ] = useState(0);
  const navigate = useNavigate();
  const handleTakeToLogin = () => {
    navigate("/login");
  };
  async function loadMember(idList) {
    let memberList = [];
    for (let memberId of idList) {
      try {
        const response = await AuthService.getById(memberId);
        memberList.push(response.data);
      } catch (err) {
        console.log(err);
      }
    }

    return memberList;
  }
  const reloadGroup = () => {
    GroupService.getByGroupId(currentGroup)
      .then((response) => {
        setGroup(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const reloadCourt = () => {
    CourtService.getByGroupId(currentGroup)
      .then((response) => {
        setCourts(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (currentGroup) {
      reloadGroup();
      reloadCourt();
    }
  }, [currentGroup]);
  useEffect(() => {
    if (group && currentUser) {
      loadMember(group.members).then((data) => {
        setMember(data);
        setFragments(group.description.split("<br>"));
        setJ(0);
      });
      setOwner(group.owner._id === currentUser.user._id);
    }
  }, [group, currentUser]);

  const handleElement = (e) => {
    const card = e.target.parentNode.parentNode;
    const cardSet = card.parentNode;

    let activeCard = cardSet.querySelector(".border-primary");
    if (activeCard) {
      activeCard.classList.remove("border-primary");
    }
    card.classList.add("border-primary");
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
    CourtService.enroll(e.target.value)
      .then((response) => {
        window.alert(response.data.msg);
        reloadCourt();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleEnrollGroup = (e) => {
    GroupService.enroll(e.target.value)
      .then((response) => {
        window.alert(response.data.msg);
        reloadGroup();
        reloadCourt();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleViewAbsent = (absentList, extraList) => {
    loadMember(absentList).then((data) => {
      setAbsentMember(data);
    });
    loadMember(extraList).then((data) => {
      setExtra(data);
    });
  };
  const handleViewHistory = (absentList, extraList) => {
    loadMember(absentList).then((data) => {
      setHistoryAbsent(data);
    });
    loadMember(extraList).then((data) => {
      setHistoryExtra(data);
    });
  };
  return (
    <div className="py-5 px-auto">
      {!currentUser && (
        <div className="text-center">
          <h3 className="mb-3">在查看球隊詳情之前，您必須先登入。</h3>
          <button
            className="btn btn-primary btn-md"
            onClick={handleTakeToLogin}
          >
            登入
          </button>
        </div>
      )}
      {currentUser && (
        <>
          <div className="d-flex gap-2 flex-wrap justify-content-center mb-3">
            <Link className="btn btn-primary col-auto mx-1" to="/profile">
              回到個人頁面
            </Link>
            <Link className="btn btn-primary col-auto mx-1" to="/groups">
              回到球隊搜尋
            </Link>
            {owner && (
              <Link className="btn btn-primary col-auto mx-1" to="/postCourt">
                新增場次
              </Link>
            )}
            {!owner &&
              group &&
              !group.members.includes(currentUser.user._id) && (
                <button
                  className="btn btn-primary col-auto mx-1"
                  onClick={handleEnrollGroup}
                  value={group._id}
                >
                  加入球隊
                </button>
              )}
          </div>
          {group && (
            <div className="container">
              <h1 className="text-center">{group.name}</h1>
              <div className="row mt-3">
                <div className="col-md-6 mx-auto ">
                  <h3 className="text-center">球隊簡介</h3>
                  <div className="p-3">
                    {fragments.map((frag) => {
                      j++;
                      return <div key={j}>{frag}</div>;
                    })}
                  </div>

                  <table className="table shadow">
                    <tbody>
                      <tr>
                        <th>人數上限</th>
                        <td>{group.amount}</td>
                        <th>目前人數</th>
                        <td>{group.members.length}</td>
                      </tr>
                    </tbody>
                  </table>
                  <h3 className="text-center">隊長</h3>
                  <table className="table shadow">
                    <thead>
                      <tr>
                        <th>用戶名稱</th>
                        <th>信箱</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{group.owner.username}</td>
                        <td>{group.owner.email}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-md-6 mx-auto">
                  <h3 className="text-center">成員</h3>
                  {member.length === 0 && (
                    <p className="text-center">目前尚未有成員加入</p>
                  )}
                  {member.length !== 0 && (
                    <table className="table shadow">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>用戶名稱</th>
                          {owner && <th>信箱</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {member.map((m) => {
                          return (
                            <tr key={m._id}>
                              <td>{member.indexOf(m) + 1}</td>
                              <td>{m.username}</td>
                              {owner && <td>{m.email}</td>}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {courts && (
                <div>
                  {courts.length === 0 && (
                    <h3 className="text-center">目前尚未建立場次</h3>
                  )}
                  {courts.length !== 0 && (
                    <>
                      <div className="mx-auto mt-3">
                        <h3 className="text-center">將來的場次</h3>
                        <div className="collapse multi-collapse" id="detail">
                          {absentMember && (
                            <>
                              {absentMember.length === 0 && (
                                <p className="text-center">尚未有成員請假</p>
                              )}
                              {absentMember.length !== 0 && (
                                <table className="table shadow">
                                  <thead>
                                    <tr>
                                      <th>#</th>
                                      <th>請假成員</th>
                                      <th>信箱</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {absentMember.map((member) => {
                                      return (
                                        <tr key={member._id}>
                                          <td>
                                            {absentMember.indexOf(member) + 1}
                                          </td>
                                          <td>{member.username}</td>
                                          <td>{member.email}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              )}
                            </>
                          )}
                          {extra && (
                            <>
                              {extra.length === 0 && (
                                <p className="text-center">尚未有臨打成員</p>
                              )}
                              {extra.length !== 0 && (
                                <table className="table shadow">
                                  <thead>
                                    <tr>
                                      <th>#</th>
                                      <th>臨打成員</th>
                                      <th>信箱</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {extra.map((member) => {
                                      return (
                                        <tr key={member._id}>
                                          <td>{extra.indexOf(member) + 1}</td>
                                          <td>{member.username}</td>
                                          <td>{member.email}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              )}
                            </>
                          )}
                        </div>
                        <div className="d-flex flex-wrap gap-2 px-auto align-items-start">
                          {courts.map((court) => {
                            let descriptionFrag =
                              court.description.split("<br>");
                            let i = 0;
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
                              let absent = court.absent.includes(
                                currentUser.user._id
                              );
                              return (
                                <div className="card shadow" key={court._id}>
                                  <div className="card-header py-3 text-bg-primary">
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

                                  <div className="card-body d-flex gap-2 justify-content-end">
                                    {owner && (
                                      <button
                                        onClick={(e) => {
                                          handleElement(e);
                                          handleViewAbsent(
                                            court.absent,
                                            court.extra
                                          );
                                        }}
                                        className="btn btn-primary "
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#detail"
                                        aria-expanded="false"
                                        aria-controls="detail"
                                      >
                                        查看
                                      </button>
                                    )}
                                    {!owner &&
                                      !absent &&
                                      !group.members.includes(
                                        currentUser.user._id
                                      ) &&
                                      !court.extra.includes(
                                        currentUser.user._id
                                      ) && (
                                        <button
                                          value={court._id}
                                          onClick={handleEnroll}
                                          className="btn btn-primary "
                                        >
                                          報名
                                        </button>
                                      )}
                                    {!owner &&
                                      !absent &&
                                      !group.members.includes(
                                        currentUser.user._id
                                      ) &&
                                      court.extra.includes(
                                        currentUser.user._id
                                      ) && (
                                        <button
                                          value={court._id}
                                          onClick={handleCancel}
                                          className="btn btn-primary "
                                        >
                                          取消報名
                                        </button>
                                      )}
                                    {!owner &&
                                      !absent &&
                                      group.members.includes(
                                        currentUser.user._id
                                      ) && (
                                        <button
                                          value={court._id}
                                          onClick={handleCancel}
                                          className="btn btn-primary "
                                        >
                                          請假
                                        </button>
                                      )}
                                    {!owner && absent && (
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
                                </div>
                              );
                            } else {
                              return null;
                            }
                          })}
                        </div>
                      </div>
                      <div className="mx-auto mt-3">
                        <h3 className="text-center">歷史場次</h3>
                        <div className="collapse multi-collapse" id="history">
                          {historyAbsent && (
                            <>
                              {historyAbsent.length === 0 && (
                                <p className="text-center">無成員請假</p>
                              )}
                              {historyAbsent.length !== 0 && (
                                <table className="table shadow">
                                  <thead>
                                    <tr>
                                      <th>#</th>
                                      <th>請假成員</th>
                                      <th>信箱</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {historyAbsent.map((member) => {
                                      return (
                                        <tr key={member._id}>
                                          <td>
                                            {historyAbsent.indexOf(member) + 1}
                                          </td>
                                          <td>{member.username}</td>
                                          <td>{member.email}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              )}
                            </>
                          )}
                          {historyExtra && (
                            <>
                              {historyExtra.length === 0 && (
                                <p className="text-center">無臨打成員</p>
                              )}
                              {historyExtra.length !== 0 && (
                                <table className="table shadow">
                                  <thead>
                                    <tr>
                                      <th>#</th>
                                      <th>臨打成員</th>
                                      <th>信箱</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {historyExtra.map((member) => {
                                      return (
                                        <tr key={member._id}>
                                          <td>
                                            {historyExtra.indexOf(member) + 1}
                                          </td>
                                          <td>{member.username}</td>
                                          <td>{member.email}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              )}
                            </>
                          )}
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                          {courts.map((court) => {
                            let descriptionFrag =
                              court.description.split("<br>");
                            let i = 0;
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
                              return (
                                <div className="card shadow" key={court._id}>
                                  <div className="card-header py-3 text-bg-secondary">
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

                                  {owner && (
                                    <div className="card-body d-flex justify-content-end">
                                      <button
                                        onClick={(e) => {
                                          handleElement(e);
                                          handleViewHistory(
                                            court.absent,
                                            court.extra
                                          );
                                        }}
                                        className="btn btn-primary "
                                        type="button"
                                        value={court._id}
                                        data-bs-toggle="collapse"
                                        data-bs-target="#history"
                                        aria-expanded="false"
                                        aria-controls="history"
                                      >
                                        查看
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            } else {
                              return null;
                            }
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GroupDetailComponent;
