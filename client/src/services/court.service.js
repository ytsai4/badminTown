import axios from "axios";
const API_URL = "https://badmin-town.onrender.com/api/courts";
const token = () => {
  if (localStorage.getItem("user")) {
    return JSON.parse(localStorage.getItem("user")).token;
  }
  return "";
};
class CourtService {
  create(data) {
    return axios.post(API_URL, data, { headers: { Authorization: token() } });
  }
  getAll() {
    return axios.get(API_URL, {
      headers: { Authorization: token() },
    });
  }
  enroll(_id) {
    return axios.get(API_URL + `/enroll/${_id}`, {
      headers: { Authorization: token() },
    });
  }
  quit(_id) {
    return axios.get(API_URL + `/quit/${_id}`, {
      headers: { Authorization: token() },
    });
  }
  getByGroupId(_id) {
    return axios.get(API_URL + `/findbygroup/${_id}`, {
      headers: { Authorization: token() },
    });
  }
  findByAbsent() {
    return axios.get(API_URL + `/absent`, {
      headers: { Authorization: token() },
    });
  }
  findByExtra() {
    return axios.get(API_URL + `/extra`, {
      headers: { Authorization: token() },
    });
  }
}
export default new CourtService();
