import React, { useState, useEffect, useRef } from "react";
import SearchService from "../services/search.service";
import CourtCardComponent from "../components/courtCard-component";
const CourtComponent = ({ currentUser, setCurrentGroup }) => {
  let [message, setMessage] = useState("");
  let [type, setType] = useState("location");
  let [check, setCheck] = useState(false);
  let startDate = useRef(null);
  let endDate = useRef(null);
  let searchInput = useRef(null);

  let [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    const handleSearchDate = () => {
      let today = new Date();
      let month = `${today.getMonth() + 1}`.padStart(2, "0");
      let startDay = `${today.getDate()}`.padStart(2, "0");
      let endDay = `${today.getDate() + 7}`.padStart(2, "0");
      let startString = `${today.getFullYear()}-${month}-${startDay}`;
      let endString = `${today.getFullYear()}-${month}-${endDay}`;
      let data = {
        startDate: startString,
        endDate: endString,
        withoutFull: false,
      };
      SearchService.getCourtByDate(data)
        .then((response) => {
          setSearchResult(response.data);
          setMessage("");
        })
        .catch((err) => {
          setMessage(err.response.data.msg);
        });
    };
    handleSearchDate();
  }, []);

  const handleChangeType = (e) => {
    setType(e.target.value);
  };

  const handleChangeFull = (e) => {
    setCheck(e.target.checked);
  };

  const handleSearch = () => {
    if (searchInput.current.value === "") {
      let data = {
        startDate: startDate.current.value,
        endDate: endDate.current.value,
        withoutFull: check,
      };
      SearchService.getCourtByDate(data)
        .then((response) => {
          setSearchResult(response.data);
          setMessage("");
        })
        .catch((err) => {
          setMessage(err.response.data.msg);
        });
    } else {
      let data;
      if (type === "location") {
        data = {
          startDate: startDate.current.value,
          endDate: endDate.current.value,
          type,
          searchInput: searchInput.current.value,
          withoutFull: check,
        };
      } else {
        data = {
          startDate: startDate.current.value,
          endDate: endDate.current.value,
          type,
          searchInput: +searchInput.current.value,
          withoutFull: check,
        };
      }

      SearchService.getCourtByType(data)
        .then((response) => {
          setSearchResult(response.data);
          setMessage("");
        })
        .catch((err) => {
          setMessage(err.response.data.msg);
        });
    }
  };
  return (
    <div className="py-5 container px-auto">
      <div className="container">
        <div className="form-group search d-flex flex-column gap-3 mx-auto mb-3">
          {message && (
            <div className="alert alert-warning" role="alert">
              {message}
            </div>
          )}
          <div className="d-flex flex-wrap gap-3">
            <div className="d-flex flex-grow-1">
              <div className="px-2">
                <label htmlFor="start" className="col-form-label">
                  起始日期
                </label>
              </div>
              <div className="flex-grow-1">
                <input
                  ref={startDate}
                  type="date"
                  placeholder="請輸入欲搜尋的起始日期"
                  id="start"
                  className="form-control"
                />
              </div>
            </div>
            <div className="d-flex flex-grow-1">
              <div className="px-2">
                <label htmlFor="end" className="col-form-label">
                  結束日期
                </label>
              </div>
              <div className="flex-grow-1">
                <input
                  ref={endDate}
                  type="date"
                  placeholder="請輸入欲搜尋的結束日期"
                  id="end"
                  className="form-control"
                />
              </div>
            </div>
          </div>

          <div className="form-group d-flex">
            <select
              className="bg-primary-subtle btn col-auto"
              onChange={handleChangeType}
              value={type}
            >
              <option value="location">依地點搜尋</option>
              <option value="price">依最高價格搜尋</option>
              <option value="amount">依最低人數搜尋</option>
              <option value="court">依最低場地數搜尋</option>
            </select>
            <input
              ref={searchInput}
              type="text"
              placeholder="請輸入要搜尋的內容，留白則僅依日期篩選"
              className="form-control"
            />
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="flexCheckDefault"
                onChange={handleChangeFull}
              />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                只顯示尚未額滿的場次
              </label>
            </div>
            <button onClick={handleSearch} className="btn btn-primary col-auto">
              <i className="fa-solid fa-magnifying-glass"></i> 搜尋
            </button>
          </div>
        </div>
      </div>
      {searchResult && (
        <>
          {searchResult.length === 0 && (
            <h4 className="text-center">未找到相符場次，請重新查詢。</h4>
          )}
          {searchResult.length !== 0 && (
            <div className="d-flex flex-wrap gap-3 mx-auto align-items-baseline ps-5 ps-lg-3">
              {searchResult.map((court) => {
                let index = court.date.indexOf("T");
                let date = court.date.slice(0, index);
                let compareDate = new Date(court.date);
                const weekday = compareDate.toDateString().slice(0, 3);
                let expire =
                  compareDate.getTime() <= new Date().getTime() ? true : false;
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
                    reloadCourt={null}
                    court={court}
                    date={date}
                    weekday={weekday}
                    applier={true}
                    expire={expire}
                    history={true}
                    remain={remain}
                    extraCourt={false}
                    headerColor="text-bg-primary"
                    descriptionFrag={descriptionFrag}
                    i={i}
                  />
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CourtComponent;
