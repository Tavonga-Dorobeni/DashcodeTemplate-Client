import http from "../http-common";
import authHeader from "./auth-header";

class ProceduresService {
  create(data) {
    return http.post("/procedures", data, { headers: authHeader() });
  }
  getAll() {
    return http.get("/procedures", { headers: authHeader() });
  }

  get(id) {
    return http.get(`/procedures/${id}`, { headers: authHeader() });
  }

  update(id, data) {
    return http.put(`/procedures/${id}`, data, { headers: authHeader() });
  }

  delete(id) {
    return http.delete(`/procedures/${id}`, { headers: authHeader() });
  }

  deleteAll() {
    return http.delete(`/procedures`, { headers: authHeader() });
  }
}

export default new ProceduresService();
