import claimService from "../../../services/claim.service";

export default {
  state: {
    claims: [],
  },

  //********************************************************************GETTERS*****************************************************************************************
  //********************************************************************************************************************************************************************

  getters: {
    allClaims: (state) => state.claims,
    // unconfirmedDeposits: (state) => {
    //   return [
    //     state.claims
    //       .filter((t) => t.CheckerID == 0)
    //       .filter((t) => t.TransactionCodeID == 1),
    //     [(state.claims.title = "Contributions")],
    //   ];
    // },
  },

  //********************************************************************ACTIONS*****************************************************************************************
  //********************************************************************************************************************************************************************

  actions: {
    // claims actions

    createClaim({ commit }, data) {
      return claimService.create(data).then(
        (response) => {
          commit("newClaim", response.data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    getAllClaims({ commit }) {
      return claimService.getAll().then(
        (response) => {
          commit("setClaims", response.data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    updateClaim({ commit }, data) {
      return claimService.update(data.ClaimID, data).then(
        (response) => {
          commit("updClaim", data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    deleteClaim({ commit }, data) {
      return claimService.delete(data.ClaimID).then(
        (response) => {
          commit("dltClaim", data);
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
    // Claim EVENTS

    setClaims: (state, claims) =>
      (state.claims = claims),
    newClaim: (state, newClaim) =>
      state.claims.unshift(newClaim.claim),
    updClaim: (state, updatedClaim) => {
      const index = state.claims.findIndex(
        (c) => c.ClaimID === updatedClaim.ClaimID
      );
      if (index !== -1) {
        state.claims.splice(index, 1, updatedClaim);
      }
    },
    dltClaim: (state, Claim) => {
      const index = state.claims.findIndex(
        (c) => c.ClaimID === Claim.ClaimID
      );
      if (index !== -1) {
        state.claims.splice(index, 1);
      }
    },
  },
};
