import http from "../http-common";
import authHeader from "./auth-header";

class PatientService {
  create(data) {
    return http.post("/patients", data, { headers: authHeader() });
  }
  getAll() {
    return http.get("/patients", { headers: authHeader() });
  }

  get(id) {
    return http.get(`/patients/${id}`, { headers: authHeader() });
  }

  update(id, data) {
    return http.put(`/patients/${id}`, data, { headers: authHeader() });
  }

  delete(id) {
    return http.delete(`/patients/${id}`, { headers: authHeader() });
  }

  deleteAll() {
    return http.delete(`/patients`, { headers: authHeader() });
  }
}

export default new PatientService();
