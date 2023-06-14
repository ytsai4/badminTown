import axios from "axios";
const API_URL = `${process.env.REACT_APP_BACKEND_API}/groups`;
const token = () => {
  if (localStorage.getItem("user")) {
    return JSON.parse(localStorage.getItem("user")).token;
  }
  return "";
};
class GroupService {
  create(data) {
    return axios.post(API_URL, data, { headers: { Authorization: token() } });
  }
  enroll(_id) {
    return axios.get(API_URL + `/enroll/${_id}`, {
      headers: { Authorization: token() },
    });
  }
  drop(_id) {
    return axios.get(API_URL + `/drop/${_id}`, {
      headers: { Authorization: token() },
    });
  }
  getByOwnerId() {
    return axios.get(API_URL + "/own", { headers: { Authorization: token() } });
  }
  getByMemberId() {
    return axios.get(API_URL + "/member", {
      headers: { Authorization: token() },
    });
  }
  getByGroupId(_id) {
    return axios.get(API_URL + `/${_id}`, {
      headers: { Authorization: token() },
    });
  }
  delete(_id) {
    return axios.delete(API_URL + `/${_id}`, {
      headers: { Authorization: token() },
    });
  }
}
// eslint-disable-next-line
export default new GroupService();
