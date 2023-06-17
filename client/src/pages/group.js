import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchService from "../services/search.service";
import GroupService from "../services/group.service";
import GroupCardComponent from "../components/groupCard-component";
const GroupComponent = ({
  currentUser,
  setCurrentUser,
  currentGroup,
  setCurrentGroup,
}) => {
  let searchInput = useRef(null);
  let [searchResult, setSearchResult] = useState(null);
  useEffect(() => {
    handleSearchAll();
  }, []);
  const navigate = useNavigate();

  const handleSearchAll = () => {
    SearchService.getAllGroups()
      .then((data) => {
        setSearchResult(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSearch = () => {
    if (searchInput.current.value === "") {
      handleSearchAll();
      return;
    }
    SearchService.getGroupByName(searchInput.current.value)
      .then((data) => {
        setSearchResult(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleEnroll = (e) => {
    if (currentUser) {
      GroupService.enroll(e.target.value)
        .then((response) => {
          window.alert(response.data.msg);
          navigate("/profile");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log(currentUser);
      window.alert("請先登入，才能加入球隊");
      navigate("/login");
    }
  };
  const handleViewGroup = (e) => {
    if (currentUser) {
      setCurrentGroup(e.target.value);
      navigate("/groupDetail");
    } else {
      window.alert("請先登入，才能查看球隊");
      navigate("/login");
    }
  };
  return (
    <div className="py-5 container">
      <div className="search input-group mb-3 mx-auto">
        <input
          ref={searchInput}
          type="text"
          name="searchInput"
          placeholder="請輸入欲搜尋的球隊名稱，留白則搜尋所有球隊"
          className="form-control"
        />
        <button onClick={handleSearch} className="btn btn-primary">
          <i className="fa-solid fa-magnifying-glass"></i> 搜尋
        </button>
      </div>
      {searchResult && (
        <>
          {searchResult.length === 0 && (
            <h4 className="text-center">未找到相符球隊，請重新查詢。</h4>
          )}
          {searchResult.length !== 0 && (
            <div className="d-flex flex-wrap gap-3 mx-auto align-items-baseline ps-5 ps-lg-3">
              {searchResult.map((group) => {
                let descriptionFrag = group.description.split("<br>");
                let i = 0;
                return (
                  <GroupCardComponent
                    key={group._id}
                    handleDelete={null}
                    handleDrop={null}
                    handleEnroll={handleEnroll}
                    handleViewGroup={handleViewGroup}
                    group={group}
                    descriptionFrag={descriptionFrag}
                    i={i}
                    applier={true}
                    owner={false}
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

export default GroupComponent;
