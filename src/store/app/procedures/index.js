import procedureService from "../../../services/procedure.service";

export default {
  state: {
    procedures: [],
  },

  //********************************************************************GETTERS*****************************************************************************************
  //********************************************************************************************************************************************************************

  getters: {
    allProcedures: (state) => state.procedures,
    // unconfirmedDeposits: (state) => {
    //   return [
    //     state.procedures
    //       .filter((t) => t.CheckerID == 0)
    //       .filter((t) => t.TransactionCodeID == 1),
    //     [(state.procedures.title = "Contributions")],
    //   ];
    // },
  },

  //********************************************************************ACTIONS*****************************************************************************************
  //********************************************************************************************************************************************************************

  actions: {
    // procedures actions

    createProcedure({ commit }, data) {
      return procedureService.create(data).then(
        (response) => {
          commit("newProcedure", response.data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    getAllProcedures({ commit }) {
      return procedureService.getAll().then(
        (response) => {
          commit("setProcedures", response.data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    updateProcedure({ commit }, data) {
      return procedureService.update(data.ProcedureID, data).then(
        (response) => {
          commit("updProcedure", data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    deleteProcedure({ commit }, data) {
      return procedureService.delete(data.ProcedureID).then(
        (response) => {
          commit("dltProcedure", data);
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
    // Procedure EVENTS

    setProcedures: (state, procedures) =>
      (state.procedures = procedures),
    newProcedure: (state, newProcedure) =>
      state.procedures.unshift(newProcedure.procedure),
    updProcedure: (state, updatedProcedure) => {
      const index = state.procedures.findIndex(
        (c) => c.ProcedureID === updatedProcedure.ProcedureID
      );
      if (index !== -1) {
        state.procedures.splice(index, 1, updatedProcedure);
      }
    },
    dltProcedure: (state, Procedure) => {
      const index = state.procedures.findIndex(
        (c) => c.ProcedureID === Procedure.ProcedureID
      );
      if (index !== -1) {
        state.procedures.splice(index, 1);
      }
    },
  },
};
