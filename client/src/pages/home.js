import React from "react";
import Demo1 from "../images/demo01.png";
import Demo2 from "../images/demo02.png";
import Demo3 from "../images/demo03.png";
import Demo4 from "../images/demo04.png";
import Demo5 from "../images/demo05.png";
import { Link } from "react-router-dom";
const HomeComponent = () => {
  return (
    <main>
      <div className="container py-4">
        <div className="px-4 py-5 text-center border-bottom">
          <h2 className="display-5 fw-bold text-body-emphasis ">
            查看未來的場次
          </h2>
          <div className="col-lg-6 mx-auto">
            <p className="lead mb-3">
              透過日期、地點、場地數、價格等條件，進行場次的搜尋，讓您輕鬆獲取場次資訊，並且快速完成報名。
            </p>
            <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mb-5">
              <Link className="btn btn-primary btn-lg px-4 me-sm-3" to="courts">
                前往搜尋
              </Link>
              <Link
                to="postCourt"
                className="btn btn-outline-secondary btn-lg px-4"
              >
                建立場次
              </Link>
            </div>
          </div>
          <div className="overflow-hidden" style={{ maxHeight: "40vh" }}>
            <div className="container">
              <img
                src={Demo4}
                className="img-fluid mx-auto rounded-3 shadow"
                alt="場次檢索頁面圖"
                loading="lazy"
                width="700"
                height="500"
              />
            </div>
          </div>
        </div>

        <div className="container col-xxl-8 px-4 border-bottom">
          <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
            <div className="col-lg-8 d-flex gap-3 flex-wrap">
              <img
                src={Demo1}
                className="d-block mx-auto img-fluid rounded-3 shadow"
                alt="球隊管理介面圖"
                loading="lazy"
                width="300"
                height="250"
              />
              <img
                src={Demo5}
                className="d-block mx-auto img-fluid rounded-3 shadow"
                alt="臨打或請假成員圖"
                loading="lazy"
                width="300"
                height="250"
              />
            </div>
            <div className="col-lg-4">
              <h2 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">
                掌握球隊概況
              </h2>
              <p className="lead">
                隊長除了可以管理球隊、建立場次，還能查看球隊會員及加入場次的臨打成員，並記錄會員請假狀況。
                用戶則可以在球隊頁面報名臨打，或是加入球隊。
              </p>
              <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                <Link
                  className="btn btn-primary btn-lg px-4 me-md-2"
                  to="/postGroup"
                >
                  創建球隊
                </Link>
                <Link
                  className="btn btn-outline-secondary btn-lg px-4"
                  to="/groups"
                >
                  加入球隊
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="container col-xxl-8 px-4 ">
          <div className="row flex-lg-row align-items-center g-5 py-5">
            <div className="col-lg-8 d-flex gap-3 flex-wrap">
              <img
                src={Demo3}
                className="d-block mx-auto img-fluid rounded-3 shadow"
                alt="用戶有關的球隊圖"
                loading="lazy"
                width="300"
                height="250"
              />
              <img
                src={Demo2}
                className="d-block mx-auto img-fluid rounded-3 shadow"
                alt="臨打或請假的場次圖"
                loading="lazy"
                width="300"
                height="250"
              />
            </div>
            <div className="col-lg-4">
              <h2 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">
                檢視個人資訊
              </h2>
              <p className="lead">
                用戶可以在個人頁面，檢視相關的球隊資訊，並查看個人臨打即請假狀況，或是申請加入球隊。
              </p>
              <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                <Link
                  className="btn btn-primary btn-lg px-4 me-md-2"
                  to="/login"
                >
                  立即登入
                </Link>
                <Link
                  className="btn btn-outline-secondary btn-lg px-4"
                  to="/register"
                >
                  註冊帳號
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomeComponent;
