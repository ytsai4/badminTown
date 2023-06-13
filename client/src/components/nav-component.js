import React from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import White from "../logo/white.svg";
const NavComponent = ({ currentUser, setCurrentUser }) => {
  const handleLogout = () => {
    AuthService.logout();
    window.alert("您已成功登出");
    setCurrentUser(null);
  };
  const handleActive = (e) => {
    const link = e.target;
    const linkList = link.parentNode.parentNode;
    linkList.childNodes.forEach((list) => {
      let activeLink = list.querySelector(".active");
      if (activeLink) {
        activeLink.classList.remove("active");
      }
    });
    link.classList.add("active");
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container-fluid">
        <div className="navbar-brand d-flex align-items-center">
          <img src={White} width={40} height={40} alt="logo" />
          <p className="mb-0 fw-bold fs-3">羽球組團系統</p>
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasDarkNavbar"
          aria-controls="offcanvasDarkNavbar"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="offcanvas offcanvas-end text-bg-dark"
          tabIndex="-1"
          id="offcanvasDarkNavbar"
          aria-labelledby="offcanvasDarkNavbarLabel"
        >
          <div className="offcanvas-header">
            <h5
              className="offcanvas-title d-flex align-items-center flex-wrap justify-content-center"
              id="offcanvasDarkNavbarLabel"
            >
              <img src={White} width={40} height={40} alt="logo" />
              <p className="mb-0 fw-bold fs-3">羽球組團系統</p>
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav nav-underline justify-content-end flex-grow-1 px-3 fw-bold">
              <li className="nav-item">
                <Link
                  onClick={handleActive}
                  className="nav-link active"
                  aria-current="page"
                  to="/"
                >
                  <i className="fa-solid fa-house"></i> 首頁
                </Link>
              </li>
              {!currentUser && (
                <>
                  <li className="nav-item">
                    <Link
                      onClick={handleActive}
                      className="nav-link"
                      to="/login"
                    >
                      <i className="fa-solid fa-right-to-bracket"></i> 會員登入
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      onClick={handleActive}
                      className="nav-link"
                      to="/register"
                    >
                      <i className="fa-solid fa-right-to-bracket"></i> 註冊帳號
                    </Link>
                  </li>
                </>
              )}
              {currentUser && (
                <>
                  <li className="nav-item">
                    <Link onClick={handleLogout} className="nav-link" to="/">
                      <i className="fa-solid fa-right-to-bracket"></i> 登出
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      onClick={handleActive}
                      className="nav-link"
                      to="/profile"
                    >
                      <i className="fa-solid fa-circle-info"></i> 個人頁面
                    </Link>
                  </li>
                </>
              )}

              <li className="nav-item">
                <Link onClick={handleActive} className="nav-link" to="/groups">
                  <i className="fa-solid fa-user-group"></i> 球隊查詢
                </Link>
              </li>
              <li className="nav-item">
                <Link onClick={handleActive} className="nav-link" to="/courts">
                  <i className="fa-regular fa-calendar"></i> 場次查詢
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavComponent;
