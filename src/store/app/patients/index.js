import patientService from "../../../services/patient.service";

export default {
  state: {
    patients: [],
  },

  //********************************************************************GETTERS*****************************************************************************************
  //********************************************************************************************************************************************************************

  getters: {
    allPatients: (state) => state.patients,
    // unconfirmedDeposits: (state) => {
    //   return [
    //     state.patients
    //       .filter((t) => t.CheckerID == 0)
    //       .filter((t) => t.TransactionCodeID == 1),
    //     [(state.patients.title = "Contributions")],
    //   ];
    // },
  },

  //********************************************************************ACTIONS*****************************************************************************************
  //********************************************************************************************************************************************************************

  actions: {
    // patients actions

    createPatient({ commit }, data) {
      return patientService.create(data).then(
        (response) => {
          commit("newPatient", response.data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    getAllPatients({ commit }) {
      return patientService.getAll().then(
        (response) => {
          commit("setPatients", response.data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    updatePatient({ commit }, data) {
      return patientService.update(data.PatientID, data).then(
        (response) => {
          commit("updPatient", data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    deletePatient({ commit }, data) {
      return patientService.delete(data.PatientID).then(
        (response) => {
          commit("dltPatient", data);
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
    // Patient EVENTS

    setPatients: (state, patients) =>
      (state.patients = patients),
    newPatient: (state, newPatient) =>
      state.patients.unshift(newPatient.patient),
    updPatient: (state, updatedPatient) => {
      const index = state.patients.findIndex(
        (c) => c.PatientID === updatedPatient.PatientID
      );
      if (index !== -1) {
        state.patients.splice(index, 1, updatedPatient);
      }
    },
    dltPatient: (state, Patient) => {
      const index = state.patients.findIndex(
        (c) => c.PatientID === Patient.PatientID
      );
      if (index !== -1) {
        state.patients.splice(index, 1);
      }
    },
  },
};
