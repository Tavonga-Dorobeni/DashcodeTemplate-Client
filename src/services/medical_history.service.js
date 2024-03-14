import http from "../http-common";
import authHeader from "./auth-header";

class MedicalHistoryService {
  create(data) {
    return http.post("/medical_history", data, { headers: authHeader() });
  }
  getAll() {
    return http.get("/medical_history", { headers: authHeader() });
  }

  get(id) {
    return http.get(`/medical_history/${id}`, { headers: authHeader() });
  }

  update(id, data) {
    return http.put(`/medical_history/${id}`, data, { headers: authHeader() });
  }

  delete(id) {
    return http.delete(`/medical_history/${id}`, { headers: authHeader() });
  }

  deleteAll() {
    return http.delete(`/medical_history`, { headers: authHeader() });
  }
}

export default new MedicalHistoryService();
