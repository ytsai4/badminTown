import axios from "axios";
const API_URL = `${process.env.REACT_APP_LOCAL_API}/user`;
const token = () => {
  if (localStorage.getItem("user")) {
    return JSON.parse(localStorage.getItem("user")).token;
  }
  return "";
};
class AuthService {
  login(email, password) {
    return axios.post(API_URL + "/login", {
      email,
      password,
    });
  }
  logout() {
    localStorage.removeItem("user");
  }
  getById(_id) {
    return axios.get(API_URL + `/${_id}`);
  }
  edit(username) {
    return axios.patch(
      API_URL + "/",
      { username: username },
      {
        headers: { Authorization: token() },
      }
    );
  }
  password(oldPassword, newPassword) {
    return axios.patch(
      API_URL + "/password",
      { oldPassword, newPassword },
      {
        headers: { Authorization: token() },
      }
    );
  }
  register(username, email, password) {
    return axios.post(API_URL + "/register", {
      username,
      email,
      password,
    });
  }
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

export default new AuthService();
