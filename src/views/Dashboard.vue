<template>
  <div>
    <h1 class="subheading grey--text text-decoration-underline">Dashboard</h1>
    <v-card class="mb-2 pa-1 rounded" variant="outlined" elevation="4">
      <h2 class="subheading grey--text text-decoration-underline">Total KK dari 12 Wilayah</h2>
      <v-container fluid>
        <v-row>
          <v-col
            v-for="hasil in dataDashboard"
            :key="hasil.kode"
            cols="12"
            lg="3"
          >
            <v-card color="white" style="border: 2px solid #000;" @click="LinkRoute(hasil.kode)">
              <v-sheet color="#c12626" class="sheetData" elevation="2" style="padding: 5px;">
                <v-divider :thickness="2" class="border-opacity-75" color="white"/>
                <v-card-title class="text-white"><h6>{{ hasil.label }}</h6></v-card-title>
                <v-divider :thickness="2" class="border-opacity-75" color="white"/>
              </v-sheet>
              <v-card-text class="d-flex flex-column justify-center align-center">
                <v-card-title class="text-black"><h6>{{ `${hasil.jml} orang` }}</h6></v-card-title>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-dialog
      v-model="dialogNotifikasi"
      transition="dialog-bottom-transition"
      persistent
      width="500px"
    >
      <PopUpNotifikasi
        :notifikasi-kode="notifikasiKode"
        :notifikasi-text="notifikasiText"
        :notifikasi-button="notifikasiButton"
        @cancel="dialogNotifikasi = false"
      />
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { useMeta } from 'vue-meta'
import PopUpNotifikasi from "./Layout/PopUpNotifikasi.vue";

export default {
  name: 'Dashboard',
  components: { PopUpNotifikasi },
  data: () => ({
    totalNotif: 0,
    cols: 4,
    roleID: '',
    
    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Dashboard",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })

  },
  computed: {
    ...mapState({
			dataDashboard: store => store.user.dataDashboard,
		}),
  },
  watch: {
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    this.roleID = localStorage.getItem('roleID')
    this.getDashboard()
  },  
	methods: {
    ...mapActions({
      getDashboard: 'user/getDashboard',
      uploadFiles: 'upload/uploadFiles',
    }),
    LinkRoute(kode){
      this.$router.push({name: "DataKeanggotaan", params: { kategori: this.roleID === '1' || this.roleID === '2' ? kode : 'all' }});
    },
    notifikasi(kode, text, proses){
      this.dialogNotifikasi = true
      this.notifikasiKode = kode
      this.notifikasiText = text
      this.notifikasiButton = proses
    },
  }
}
</script>
<style scoped>
.v-chip-group {
  display: flex;
  justify-content: center;
}
.v-chip {
  cursor: default;
}
.box{
	width: 120px;
	height: 50px;
  background-image:-moz-linear-gradient(top, #272727, #c12626);
	background-image: -webkit-gradient(linear, 100% 25%, 50% 100%, from(#272727), to(#c12626), color-stop(1,#c12626));
	border-radius: 10px;
	padding: 0px 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
	text-align: center;
	font-size: 8pt;
	font-weight: bold;
	color: white;
}
</style>