import http from "../http-common";
import authHeader from "./auth-header";

class ClaimService {
  create(data) {
    return http.post("/claims", data, { headers: authHeader() });
  }
  getAll() {
    return http.get("/claims", { headers: authHeader() });
  }

  get(id) {
    return http.get(`/claims/${id}`, { headers: authHeader() });
  }

  update(id, data) {
    return http.put(`/claims/${id}`, data, { headers: authHeader() });
  }

  delete(id) {
    return http.delete(`/claims/${id}`, { headers: authHeader() });
  }

  deleteAll() {
    return http.delete(`/claims`, { headers: authHeader() });
  }
}

export default new ClaimService();
