import axios from "axios";
const API_URL = "http://localhost:8080/api/search";
class SearchService {
  getAllGroups() {
    return axios.get(API_URL + "/group");
  }
  getGroupByName(name) {
    return axios.get(API_URL + `/group/${name}`);
  }
  getCourtByDate(data) {
    return axios.post(API_URL + "/court", data);
  }
  getCourtByType(data) {
    return axios.post(API_URL + "/court/type", data);
  }
}
// eslint-disable-next-line
export default new SearchService();
