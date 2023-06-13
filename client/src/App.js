import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomeComponent from "./pages/home";
import LoginComponent from "./pages/login";
import RegisterComponent from "./pages/register";
import GroupComponent from "./pages/group";
import GroupDetailComponent from "./pages/groupDetail";
import CourtComponent from "./pages/court";
import ProfileComponent from "./pages/profile";
import PostGroupComponent from "./pages/postGroup";
import PostCourtComponent from "./pages/postCourt";
import UsernameComponent from "./pages/username";
import PasswordComponent from "./pages/password";
import NoPage from "./pages/noPage";
import { useState } from "react";
import AuthService from "./services/auth.service";
import "./styles/style.css";
function App() {
  let [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
  let [currentGroup, setCurrentGroup] = useState(null);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout currentUser={currentUser} setCurrentUser={setCurrentUser} />
          }
        >
          <Route index element={<HomeComponent />}></Route>
          <Route
            path="register"
            element={
              <RegisterComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          ></Route>
          <Route
            path="login"
            element={
              <LoginComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          ></Route>
          <Route
            path="profile"
            element={
              <ProfileComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                setCurrentGroup={setCurrentGroup}
                currentGroup={currentGroup}
              />
            }
          ></Route>
          <Route
            path="groups"
            element={
              <GroupComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                setCurrentGroup={setCurrentGroup}
                currentGroup={currentGroup}
              />
            }
          ></Route>
          <Route
            path="postGroup"
            element={
              <PostGroupComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          ></Route>
          <Route
            path="groupDetail"
            element={
              <GroupDetailComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                setCurrentGroup={setCurrentGroup}
                currentGroup={currentGroup}
              />
            }
          ></Route>
          <Route
            path="courts"
            element={
              <CourtComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                setCurrentGroup={setCurrentGroup}
                currentGroup={currentGroup}
              />
            }
          ></Route>
          <Route
            path="postCourt"
            element={
              <PostCourtComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          ></Route>
          <Route
            path="editUsername"
            element={
              <UsernameComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          ></Route>
          <Route
            path="editPassword"
            element={
              <PasswordComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          ></Route>

          <Route path="*" element={<NoPage />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
