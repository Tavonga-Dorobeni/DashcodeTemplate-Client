import medical_historyService from "../../../services/medical_history.service";

export default {
  state: {
    medical_historys: [],
  },

  //********************************************************************GETTERS*****************************************************************************************
  //********************************************************************************************************************************************************************

  getters: {
    allMedicalHistorys: (state) => state.medical_historys,
    // unconfirmedDeposits: (state) => {
    //   return [
    //     state.medical_historys
    //       .filter((t) => t.CheckerID == 0)
    //       .filter((t) => t.TransactionCodeID == 1),
    //     [(state.medical_historys.title = "Contributions")],
    //   ];
    // },
  },

  //********************************************************************ACTIONS*****************************************************************************************
  //********************************************************************************************************************************************************************

  actions: {
    // medical_historys actions

    createMedicalHistory({ commit }, data) {
      return medical_historyService.create(data).then(
        (response) => {
          commit("newMedicalHistory", response.data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    getAllMedicalHistorys({ commit }) {
      return medical_historyService.getAll().then(
        (response) => {
          commit("setMedicalHistorys", response.data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    updateMedicalHistory({ commit }, data) {
      return medical_historyService.update(data.MedicalHistoryID, data).then(
        (response) => {
          commit("updMedicalHistory", data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    deleteMedicalHistory({ commit }, data) {
      return medical_historyService.delete(data.MedicalHistoryID).then(
        (response) => {
          commit("dltMedicalHistory", data);
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
    // MedicalHistory EVENTS

    setMedicalHistorys: (state, medical_historys) =>
      (state.medical_historys = medical_historys),
    newMedicalHistory: (state, newMedicalHistory) =>
      state.medical_historys.unshift(newMedicalHistory.medical_history),
    updMedicalHistory: (state, updatedMedicalHistory) => {
      const index = state.medical_historys.findIndex(
        (c) => c.MedicalHistoryID === updatedMedicalHistory.MedicalHistoryID
      );
      if (index !== -1) {
        state.medical_historys.splice(index, 1, updatedMedicalHistory);
      }
    },
    dltMedicalHistory: (state, MedicalHistory) => {
      const index = state.medical_historys.findIndex(
        (c) => c.MedicalHistoryID === MedicalHistory.MedicalHistoryID
      );
      if (index !== -1) {
        state.medical_historys.splice(index, 1);
      }
    },
  },
};
