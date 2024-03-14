import appointmentService from "../../../services/appointment.service";

export default {
  state: {
    appointments: [],
  },

  //********************************************************************GETTERS*****************************************************************************************
  //********************************************************************************************************************************************************************

  getters: {
    allAppointments: (state) => state.appointments,
    // unconfirmedDeposits: (state) => {
    //   return [
    //     state.appointments
    //       .filter((t) => t.CheckerID == 0)
    //       .filter((t) => t.TransactionCodeID == 1),
    //     [(state.appointments.title = "Contributions")],
    //   ];
    // },
  },

  //********************************************************************ACTIONS*****************************************************************************************
  //********************************************************************************************************************************************************************

  actions: {
    // appointments actions

    createAppointment({ commit }, data) {
      return appointmentService.create(data).then(
        (response) => {
          commit("newAppointment", response.data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    getAllAppointments({ commit }) {
      return appointmentService.getAll().then(
        (response) => {
          commit("setAppointments", response.data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    updateAppointment({ commit }, data) {
      return appointmentService.update(data.AppointmentID, data).then(
        (response) => {
          commit("updAppointment", data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    deleteAppointment({ commit }, data) {
      return appointmentService.delete(data.AppointmentID).then(
        (response) => {
          commit("dltAppointment", data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
  },

  //********************************************************************MUTATIONS***************************************************************************************
  //********************************************************************************************************************************************************************
  mutations: {
    // Appointment EVENTS

    setAppointments: (state, appointments) =>
      (state.appointments = appointments),
    newAppointment: (state, newAppointment) =>
      state.appointments.unshift(newAppointment.appointment),
    updAppointment: (state, updatedAppointment) => {
      const index = state.appointments.findIndex(
        (c) => c.AppointmentID === updatedAppointment.AppointmentID
      );
      if (index !== -1) {
        state.appointments.splice(index, 1, updatedAppointment);
      }
    },
    dltAppointment: (state, Appointment) => {
      const index = state.appointments.findIndex(
        (c) => c.AppointmentID === Appointment.AppointmentID
      );
      if (index !== -1) {
        state.appointments.splice(index, 1);
      }
    },
  },
};
