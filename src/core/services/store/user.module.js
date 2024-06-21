import ApiService from "@/core/services/api.service";

const token = localStorage.getItem('user_token')
const timeout = 2000
// action types
export const GET_DASHBOARD = "getDashboard";
export const GET_ADMINISTRATOR = "getAdministrator";
export const GET_ADMINISTRATOR_BY = "getAdministratorbyUID";
export const POST_ADMINISTRATOR = "postAdministrator";
export const GET_KEANGGOTAAN = "getKeanggotaan";
export const GET_KEANGGOTAAN_BY = "getKeanggotaanbyUID";
export const POST_KEANGGOTAAN = "postKeanggotaan";

// mutation types
export const SET_LOADINGTABLE = "SET_LOADINGTABLE";
export const SET_DASHBOARD = "SET_DASHBOARD";
export const SET_ADMINISTRATOR = "SET_ADMINISTRATOR";
export const SET_ADMINISTRATORBY = "SET_ADMINISTRATORBY";
export const SET_KEANGGOTAAN = "SET_KEANGGOTAAN";
export const SET_KEANGGOTAANBY = "SET_KEANGGOTAANBY";

const state = {
  loadingtable: false,
  dataDashboard: [],
  dataAdministrator: [],
  dataAdministratorBy: null,
  dataKeanggotaan: [],
  dataKeanggotaanBy: null,
}

const mutations = {
  [SET_LOADINGTABLE](state, data) {
    state.loadingtable = data
  },
  [SET_DASHBOARD](state, data) {
    state.dataDashboard = data
  },
  [SET_ADMINISTRATOR](state, data) {
    state.dataAdministrator = data
  },
  [SET_ADMINISTRATORBY](state, data) {
    state.dataAdministratorBy = data
  },
  [SET_KEANGGOTAAN](state, data) {
    state.dataKeanggotaan = data
  },
  [SET_KEANGGOTAANBY](state, data) {
    state.dataKeanggotaanBy = data
  },
}

const getters = {
  administratorAll(state) {
    return state.dataAdministrator;
  },
  administratorBy(state) {
    return state.dataAdministratorBy;
  },
  keanggotaanAll(state) {
    return state.dataKeanggotaan;
  },
  keanggotaanBy(state) {
    return state.dataKeanggotaanBy;
  },
}

const actions = {
  [GET_DASHBOARD](context, data) {
    return new Promise((resolve, reject) => {
      ApiService.get(`user/dashboard${data.kelas !== null ? `?kelas=${data.kelas}` : ''}`, token)
      .then((response) => {
        context.commit('SET_DASHBOARD', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [GET_ADMINISTRATOR](context, data) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`user/admin?page=${data.page}&limit=${data.limit}${data.keyword ? `&keyword=${data.keyword}` : ''}${data.sorting !== '' ? `&sort=${data.sorting}` : ''}`, token)
      .then((response) => {
        context.commit('SET_LOADINGTABLE', false)
        context.commit('SET_ADMINISTRATOR', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        context.commit('SET_LOADINGTABLE', false)
        reject(error);
      })
    });
  },
  [GET_ADMINISTRATOR_BY](context, uid) {
    return new Promise((resolve, reject) => {
      ApiService.get(`user/admin/${uid}`, token)
      .then((response) => {
        context.commit('SET_ADMINISTRATORBY', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [POST_ADMINISTRATOR](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`user/admin`, token, bodyData)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [GET_KEANGGOTAAN](context, data) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`user/biodata?page=${data.page}&limit=${data.limit}${data.keyword ? `&keyword=${data.keyword}` : ''}${data.filter !== 'null-null' ? `&filter=${data.filter}` : ''}${data.sorting !== '' ? `&sort=${data.sorting}` : ''}`, token)
      .then((response) => {
        context.commit('SET_LOADINGTABLE', false)
        context.commit('SET_KEANGGOTAAN', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        context.commit('SET_LOADINGTABLE', false)
        reject(error);
      })
    });
  },
  [GET_KEANGGOTAAN_BY](context, uid) {
    return new Promise((resolve, reject) => {
      ApiService.get(`user/biodata/${uid}`, token)
      .then((response) => {
        context.commit('SET_KEANGGOTAANBY', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [POST_KEANGGOTAAN](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`user/biodata`, token, bodyData)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
}

export default {
  namespaced: true,
  actions,
  state,
  mutations,
  getters,
}