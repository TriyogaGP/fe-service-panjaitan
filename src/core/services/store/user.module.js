import ApiService from "@/core/services/api.service";

const token = localStorage.getItem('user_token')
const timeout = 2000
// action types
export const GET_DASHBOARD = "getDashboard";
export const GET_DASHBOARDTWO = "getDashboardTwo";
export const GET_ADMINISTRATOR = "getAdministrator";
export const GET_ADMINISTRATOR_BY = "getAdministratorbyUID";
export const POST_ADMINISTRATOR = "postAdministrator";
export const GET_KEANGGOTAAN = "getKeanggotaan";
export const GET_KEANGGOTAAN_BY = "getKeanggotaanbyUID";
export const POST_KEANGGOTAAN = "postKeanggotaan";
export const GET_IURAN = "getIuran";
export const POST_IURAN = "postIuran";
export const GET_REKAP_MENIKAH = "getRekapMenikah";
export const POST_REKAP_MENIKAH = "postRekapMenikah";
export const GET_REKAP_MENINGGAL = "getRekapMeninggal";
export const POST_REKAP_MENINGGAL = "postRekapMeninggal";
export const GET_MANAGE_PENANGGUNGJAWAB = "getManagePenanggungJawab";
export const GET_REKAP_PENANGGUNGJAWAB = "getRekapPenanggungJawab";
export const POST_REKAP_PENANGGUNGJAWAB = "postRekapPenanggungJawab";
export const GET_REKAP_TUGAS = "getRekapTugas";
export const POST_REKAP_TUGAS = "postRekapTugas";
export const GET_KOMISARISWILAYAH = "getKomisarisWilayah";
export const GET_WILAYAHPANJAITAN = "getWilayahPanjaitan";

// mutation types
export const SET_LOADINGTABLE = "SET_LOADINGTABLE";
export const SET_DASHBOARD = "SET_DASHBOARD";
export const SET_DASHBOARDTWO = "SET_DASHBOARDTWO";
export const SET_ADMINISTRATOR = "SET_ADMINISTRATOR";
export const SET_ADMINISTRATORBY = "SET_ADMINISTRATORBY";
export const SET_KEANGGOTAAN = "SET_KEANGGOTAAN";
export const SET_KEANGGOTAANBY = "SET_KEANGGOTAANBY";
export const SET_IURAN = "SET_IURAN";
export const SET_REKAP_MENIKAH = "SET_REKAP_MENIKAH";
export const SET_REKAP_MENINGGAL = "SET_REKAP_MENINGGAL";
export const SET_MANAGE_PENANGGUNGJAWAB = "SET_MANAGE_PENANGGUNGJAWAB";
export const SET_REKAP_PENANGGUNGJAWAB = "SET_REKAP_PENANGGUNGJAWAB";
export const SET_REKAP_TUGAS = "SET_REKAP_TUGAS";
export const SET_KOMISARISWILAYAH = "SET_KOMISARISWILAYAH";
export const SET_WILAYAHPANJAITAN = "SET_WILAYAHPANJAITAN";

const state = {
  loadingtable: false,
  dataDashboard: [],
  dataDashboardTwo: [],
  dataAdministrator: [],
  dataAdministratorBy: null,
  dataKeanggotaan: [],
  dataKeanggotaanBy: null,
  dataIuran: [],
  dataRekapMenikah: [],
  dataRekapMeninggal: [],
  dataManagePenanggungJawab: [],
  dataRekapPenanggungJawab: [],
  dataRekapTugas: [],
  komisariswilayahOptions: [],
  wilayahpanjaitanOptions: [],
}

const mutations = {
  [SET_LOADINGTABLE](state, data) {
    state.loadingtable = data
  },
  [SET_DASHBOARD](state, data) {
    state.dataDashboard = data
  },
  [SET_DASHBOARDTWO](state, data) {
    state.dataDashboardTwo = data
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
  [SET_IURAN](state, data) {
    state.dataIuran = data
  },
  [SET_REKAP_MENIKAH](state, data) {
    state.dataRekapMenikah = data
  },
  [SET_REKAP_MENINGGAL](state, data) {
    state.dataRekapMeninggal = data
  },
  [SET_REKAP_PENANGGUNGJAWAB](state, data) {
    state.dataRekapPenanggungJawab = data
  },
  [SET_MANAGE_PENANGGUNGJAWAB](state, data) {
    state.dataManagePenanggungJawab = data
  },
  [SET_REKAP_TUGAS](state, data) {
    state.dataRekapTugas = data
  },
  [SET_KOMISARISWILAYAH](state, data) {
    state.komisariswilayahOptions = data
  },
  [SET_WILAYAHPANJAITAN](state, data) {
    state.wilayahpanjaitanOptions = data
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
  iuranAll(state) {
    return state.dataIuran;
  },
  rekapmenikahAll(state) {
    return state.dataRekapMenikah;
  },
  rekapmeninggalAll(state) {
    return state.dataRekapMeninggal;
  },
  rekappenanggungjawabAll(state) {
    return state.dataRekapPenanggungJawab;
  },
  managepenanggungjawabAll(state) {
    return state.dataManagePenanggungJawab;
  },
  rekaptugasAll(state) {
    return state.dataRekapTugas;
  },
}

const convertDate = (data) => {
  if (data == null) {
    return this.$moment().format("YYYY-MM-DD");
  } else {
    let date = new Date(data),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
    const valueConvert = [date.getFullYear(), mnth, day].join("-");
    return valueConvert
  }
} 

const actions = {
  [GET_DASHBOARD](context, data) {
    return new Promise((resolve, reject) => {
      ApiService.get(`user/dashboard`, token)
      .then((response) => {
        context.commit('SET_DASHBOARD', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [GET_DASHBOARDTWO](context, data) {
    console.log(data);
    
    return new Promise((resolve, reject) => {
      ApiService.get(`user/dashboardTwo${typeof data !== 'undefined' ? `?kodeWilayah=${data.kodeWilayah}` : ''}`, token)
      .then((response) => {
        context.commit('SET_DASHBOARDTWO', response.data.result)
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
  [GET_IURAN](context, data) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`user/iuran?komisaris_wilayah=${data.komisaris_wilayah}&tahun=${data.tahun}${data.keyword ? `&keyword=${data.keyword}` : ''}`, token)
      .then((response) => {
        context.commit('SET_LOADINGTABLE', false)
        context.commit('SET_IURAN', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        context.commit('SET_LOADINGTABLE', false)
        reject(error);
      })
    });
  },
  [POST_IURAN](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`user/iuran`, token, bodyData)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [GET_REKAP_MENIKAH](context, data) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      // if(data.tanggal === null) data.tanggal = []
      ApiService.get(`user/data-menikah?page=${data.page}&limit=${data.limit}${data.keyword ? `&keyword=${data.keyword}` : ''}${data.sorting !== '' ? `&sort=${data.sorting}` : ''}${data.tanggal.length ? `&startdate=${convertDate(data.tanggal[0])}&enddate=${convertDate(data.tanggal[1])}` : ''}`, token)
      .then((response) => {
        context.commit('SET_LOADINGTABLE', false)
        context.commit('SET_REKAP_MENIKAH', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        context.commit('SET_LOADINGTABLE', false)
        reject(error);
      })
    });
  },
  [POST_REKAP_MENIKAH](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`user/data-menikah`, token, bodyData)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [GET_REKAP_MENINGGAL](context, data) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      // if(data.tanggal === null) data.tanggal = []
      ApiService.get(`user/data-meninggal?page=${data.page}&limit=${data.limit}${data.keyword ? `&keyword=${data.keyword}` : ''}${data.sorting !== '' ? `&sort=${data.sorting}` : ''}${data.tanggal.length ? `&startdate=${convertDate(data.tanggal[0])}&enddate=${convertDate(data.tanggal[1])}` : ''}`, token)
      .then((response) => {
        context.commit('SET_LOADINGTABLE', false)
        context.commit('SET_REKAP_MENINGGAL', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        context.commit('SET_LOADINGTABLE', false)
        reject(error);
      })
    });
  },
  [POST_REKAP_MENINGGAL](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`user/data-meninggal`, token, bodyData)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [GET_REKAP_PENANGGUNGJAWAB](context, data) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`user/data-penanggungjawab?kategori=${data.kategori}&tahun=${data.tahun}${data.keyword ? `&keyword=${data.keyword}` : ''}`, token)
      .then((response) => {
        context.commit('SET_LOADINGTABLE', false)
        context.commit('SET_REKAP_PENANGGUNGJAWAB', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        context.commit('SET_LOADINGTABLE', false)
        reject(error);
      })
    });
  },
  [GET_MANAGE_PENANGGUNGJAWAB](context, data) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`user/manage-penanggungjawab?page=${data.page}&limit=${data.limit}${data.keyword ? `&keyword=${data.keyword}` : ''}`, token)
      .then((response) => {
        context.commit('SET_LOADINGTABLE', false)
        context.commit('SET_MANAGE_PENANGGUNGJAWAB', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        context.commit('SET_LOADINGTABLE', false)
        reject(error);
      })
    });
  },
  [POST_REKAP_PENANGGUNGJAWAB](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`user/data-penanggungjawab`, token, bodyData)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [GET_REKAP_TUGAS](context, data) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`user/data-tugas?tahun=${data.tahun}&bulan=${data.bulan}${data.keyword ? `&keyword=${data.keyword}` : ''}`, token)
      .then((response) => {
        context.commit('SET_LOADINGTABLE', false)
        context.commit('SET_REKAP_TUGAS', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        context.commit('SET_LOADINGTABLE', false)
        reject(error);
      })
    });
  },
  [POST_REKAP_TUGAS](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`user/data-tugas`, token, bodyData)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [GET_KOMISARISWILAYAH](context, data) {
    return new Promise((resolve, reject) => {
      ApiService.get(`user/optionsKomisarisWilayah${data.keyword ? `?keyword=${data.keyword}` : ''}`, token)
      .then((response) => {
          context.commit('SET_KOMISARISWILAYAH', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_WILAYAHPANJAITAN](context, data) {
    return new Promise((resolve, reject) => {
      ApiService.get(`user/optionsWilayahPanjaitan${data.keyword ? `?keyword=${data.keyword}` : ''}`, token)
      .then((response) => {
          context.commit('SET_WILAYAHPANJAITAN', response.data.result)
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