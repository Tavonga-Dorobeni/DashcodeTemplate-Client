import dependantService from "../../../services/dependant.service";

export default {
  state: {
    dependants: [],
  },

  //********************************************************************GETTERS*****************************************************************************************
  //********************************************************************************************************************************************************************

  getters: {
    allDependants: (state) => state.dependants,
    // unconfirmedDeposits: (state) => {
    //   return [
    //     state.dependants
    //       .filter((t) => t.CheckerID == 0)
    //       .filter((t) => t.TransactionCodeID == 1),
    //     [(state.dependants.title = "Contributions")],
    //   ];
    // },
  },

  //********************************************************************ACTIONS*****************************************************************************************
  //********************************************************************************************************************************************************************

  actions: {
    // dependants actions

    createDependant({ commit }, data) {
      return dependantService.create(data).then(
        (response) => {
          commit("newDependant", response.data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    getAllDependants({ commit }) {
      return dependantService.getAll().then(
        (response) => {
          commit("setDependants", response.data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    updateDependant({ commit }, data) {
      return dependantService.update(data.DependantID, data).then(
        (response) => {
          commit("updDependant", data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    deleteDependant({ commit }, data) {
      return dependantService.delete(data.DependantID).then(
        (response) => {
          commit("dltDependant", data);
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
    // Dependant EVENTS

    setDependants: (state, dependants) =>
      (state.dependants = dependants),
    newDependant: (state, newDependant) =>
      state.dependants.unshift(newDependant.dependant),
    updDependant: (state, updatedDependant) => {
      const index = state.dependants.findIndex(
        (c) => c.DependantID === updatedDependant.DependantID
      );
      if (index !== -1) {
        state.dependants.splice(index, 1, updatedDependant);
      }
    },
    dltDependant: (state, Dependant) => {
      const index = state.dependants.findIndex(
        (c) => c.DependantID === Dependant.DependantID
      );
      if (index !== -1) {
        state.dependants.splice(index, 1);
      }
    },
  },
};
