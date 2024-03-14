import http from "../http-common";
import authHeader from "./auth-header";

class AppointmentService {
  create(data) {
    return http.post("/appointments", data, { headers: authHeader() });
  }
  getAll() {
    return http.get("/appointments", { headers: authHeader() });
  }

  get(id) {
    return http.get(`/appointments/${id}`, { headers: authHeader() });
  }

  update(id, data) {
    return http.put(`/appointments/${id}`, data, { headers: authHeader() });
  }

  delete(id) {
    return http.delete(`/appointments/${id}`, { headers: authHeader() });
  }

  deleteAll() {
    return http.delete(`/appointments`, { headers: authHeader() });
  }
}

export default new AppointmentService();
