<template>
  <div>
    <h1 class="subheading grey--text text-decoration-underline">Dashboard</h1>
    <v-card class="mb-2 pa-1 rounded" variant="outlined" elevation="4">
      <h2 class="subheading grey--text text-decoration-underline">{{ `Data Dari Wilayah ${dataTotal.length ? `${dataTotal[0].label}` : ''} (${dataTotal.length ? `${dataTotal[0].jml}` : '0'} KK / ${dataTotal.length ? `${dataTotal[0].totalJiwa}` : '0'} Jiwa)` }}</h2>
      <v-container fluid>
        <v-row>
          <v-col
            v-for="hasil in dataDashboardTwo"
            :key="hasil.kodeKomisarisWilayah"
            cols="12"
            lg="4"
          >
            <v-card color="white" style="border: 2px solid #000;" @click="LinkRouteKomisaris(hasil.kodeKomisarisWilayah)">
              <v-sheet color="#c12626" class="sheetData" elevation="2" style="padding: 5px;">
                <v-divider :thickness="2" class="border-opacity-75" color="white"/>
                <v-card-title class="text-white"><h6>{{ hasil.kodeKomisarisWilayah }}</h6></v-card-title>
                <v-divider :thickness="2" class="border-opacity-75" color="white"/>
              </v-sheet>
              <div class="d-flex flex-column justify-space-between align-center ma-2">
                <v-row>
                  <v-col
                    cols="12"
                    md="12"
                    class="mt-2 d-flex align-center justify-center"
                    style="height: 30px;"
                  >
                    <span v-html="hasil.namaKomisaris" style="font-size: 9pt; font-weight: bold;"/>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    cols="12"
                    md="12"
                    class="d-flex align-center justify-center"
                    style="height: 60px;"
                  >
                    <span v-html="hasil.daerah" style="font-size: 9pt; font-weight: bold;"/>
                  </v-col>
                </v-row>
              </div>
              <v-divider :thickness="2" class="border-opacity-100 mt-4" color="black" />
              <v-card-actions style="padding: 5px !important; min-height: 20px !important;">
                <v-row no-gutters>
                  <v-col
                    class="d-flex align-center justify-center"
                    cols="12"
                    md="12"
                  >
                    <h3 style="font-size: 12pt; font-weight: bold;">{{ `${hasil.jml} KK / ${hasil.totalJiwa} Jiwa` }}</h3>
                  </v-col>
                </v-row>
              </v-card-actions>
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
import { useRoute } from "vue-router";
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
    const route = useRoute()
    let kategori = route.params.kategori
    return { kategori }
  },
  computed: {
    ...mapState({
			dataDashboard: store => store.user.dataDashboard,
			dataDashboardTwo: store => store.user.dataDashboardTwo,
		}),
    dataTotal(){
      const data = this.dataDashboard.filter(val => val.kode === this.kategori)
      return data
    },
    totalJiwa(){
      const data = this.dataDashboard.reduce((acc, curr) => {
				return { totalJiwa: acc.totalJiwa + curr.totalJiwa };
			}, { totalJiwa: 0 });
      return data.totalJiwa
    },
  },
  watch: {
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    this.roleID = localStorage.getItem('roleID')
    this.getDashboard()
    this.getDashboardTwo({ kodeWilayah: this.kategori })
  },  
	methods: {
    ...mapActions({
      uploadFiles: 'upload/uploadFiles',
      getDashboard: 'user/getDashboard',
      getDashboardTwo: 'user/getDashboardTwo',
			getWilayahPanjaitan: 'setting/getWilayahPanjaitan',
    }),
    LinkRoute(kode){
      this.$router.push({name: "DataKeanggotaan", params: { kategori: this.roleID === '1' || this.roleID === '2' ? kode : 'all' }});
    },
    LinkRouteKomisaris(kode){
      this.$router.push({name: "DataKeanggotaan", params: { kategori: kode }});
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