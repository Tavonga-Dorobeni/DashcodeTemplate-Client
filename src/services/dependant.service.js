import http from "../http-common";
import authHeader from "./auth-header";

class DependantService {
  create(data) {
    return http.post("/dependants", data, { headers: authHeader() });
  }
  getAll() {
    return http.get("/dependants", { headers: authHeader() });
  }

  get(id) {
    return http.get(`/dependants/${id}`, { headers: authHeader() });
  }

  update(id, data) {
    return http.put(`/dependants/${id}`, data, { headers: authHeader() });
  }

  delete(id) {
    return http.delete(`/dependants/${id}`, { headers: authHeader() });
  }

  deleteAll() {
    return http.delete(`/dependants`, { headers: authHeader() });
  }
}

export default new DependantService();
