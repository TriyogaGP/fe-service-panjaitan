<template>
  <div>
    <v-card class="mb-2 pa-1 rounded" variant="outlined" elevation="4">
      <v-row no-gutters>
        <v-col cols="12" md="8" class="d-flex align-center pl-2">
          <span v-if="roleID === '1' || roleID === '2'" style="font-size: 12pt; font-weight: bold;">
            {{ `Total Iuran 12 Wilayah : ${WilayahPanjaitanTotalIuran === 0 ? 'Rp. 0' : `Rp. ${currencyDotFormatNumber(WilayahPanjaitanTotalIuran)}`}` }}
          </span>
          <span v-else style="font-size: 12pt; font-weight: bold;">
            {{ `Total Iuran Wilayah ${optionKomisaris.length ? optionKomisaris[0].namaWilayah : ''} : ${total === 0 ? 'Rp. 0' : `Rp. ${currencyDotFormatNumber(total)}`}` }}
          </span>
        </v-col>
        <v-col cols="12" md="4" class="pr-2">
          <TextField
            v-model="searchData"
            icon-prepend-tf="mdi mdi-magnify"
            label-tf="Pencarian..."
            :clearable-tf="true"
            @click:clear="() => {
              searchData = ''
              roleID === '1' || roleID === '2' ? getWilayahPanjaitan({ keyword: searchData }) : getKomisarisWilayah({ keyword: searchData })
            }"
            @keyup.enter="() => {
              roleID === '1' || roleID === '2' ? getWilayahPanjaitan({ keyword: searchData }) : getKomisarisWilayah({ keyword: searchData })
            }"
          />
        </v-col>
      </v-row>
      <v-container fluid>
        <v-row v-if="roleID === '1' || roleID === '2'">
          <v-col
            v-for="hasil in DataWilayahPanjaitan"
            :key="hasil.kode"
            cols="12"
            lg="4"
          >
            <v-card color="white" style="border: 2px solid #000;" @click="LinkRoute(hasil.kode)">
              <v-sheet color="#c12626" class="sheetData" elevation="2" style="padding: 5px;">
                <v-divider :thickness="2" class="border-opacity-75" color="white"/>
                <v-card-title class="text-white"><h6>{{ hasil.label }}</h6></v-card-title>
                <v-divider :thickness="2" class="border-opacity-75" color="white"/>
              </v-sheet>
              <v-card-text style="display: flex; align-items: center; justify-content: center; padding: 5px; height: 100px;">
                <v-img
                  :src="hasil.lambang"
                  :height="150"
                  aspect-ratio="16/9"
                />
              </v-card-text>
              <v-card-actions style="padding: 5px !important; min-height: 20px !important;">
                <v-row no-gutters>
                  <v-col
                    class="d-flex align-center justify-center"
                    cols="12"
                    md="12"
                  >
                    <h3 style="font-size: 9pt; font-weight: bold;">{{ `${hasil.totalIuran === 0 ? 'Rp. 0' : `Rp. ${currencyDotFormatNumber(hasil.totalIuran)}`}` }}</h3>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col
            v-for="hasil in optionKomisaris"
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
              <v-card-text style="display: flex; align-items: center; justify-content: center; padding: 5px; height: 30px;">
                <span v-html="hasil.namaKomisaris" style="font-size: 9pt; font-weight: bold;"/>
              </v-card-text>
              <v-card-actions style="padding: 5px !important; min-height: 20px !important;">
                <v-row no-gutters>
                  <v-col
                    class="d-flex align-center justify-center"
                    cols="12"
                    md="12"
                  >
                    <h3 style="font-size: 9pt; font-weight: bold;">{{ `${hasil.totalIuran === 0 ? 'Rp. 0' : `Rp. ${currencyDotFormatNumber(hasil.totalIuran)}`}` }}</h3>
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
import { mapActions, mapState, mapGetters } from "vuex";
import { useMeta } from 'vue-meta'
import PopUpNotifikasi from "../../Layout/PopUpNotifikasi.vue";
export default {
  name: 'DataIuran',
  components: {
    PopUpNotifikasi,
  },
  data: () => ({
    roleID: '',
    BASE_URL: '',
    searchData: '',
    DataWilayahPanjaitan: [],
    WilayahPanjaitanTotalIuran: 0,

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Data Iuran",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
    return { }
  },
  computed: {
		...mapState({
			wilayahpanjaitanOptions: store => store.user.wilayahpanjaitanOptions,
			komisariswilayahOptions: store => store.user.komisariswilayahOptions,
		}),
    ...mapGetters({
    }),
    optionKomisaris(){
      if(localStorage.getItem('roleID') === '3'){
        let wilayah = localStorage.getItem('wilayah')
        let namakomisaris = this.komisariswilayahOptions.filter(str => str.kodeWilayah === wilayah)
			  return namakomisaris
      }
      return this.komisariswilayahOptions
    },
    total(){
      let wilayah = localStorage.getItem('wilayah')
      let namakomisaris = this.komisariswilayahOptions.filter(str => str.kodeWilayah === wilayah)
      const total = namakomisaris.reduce((acc, curr) => {
				return { totalIuran: acc.totalIuran + curr.totalIuran };
			}, { totalIuran: 0 });
      
      return total.totalIuran
    }
  },
  watch: {
    wilayahpanjaitanOptions: {
			deep: true,
			async handler(value) {
        this.DataWilayahPanjaitan = value.result
        this.WilayahPanjaitanTotalIuran = value.totalKeseluruhanIuranWilayah
      }
    },
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    this.roleID = localStorage.getItem('roleID')
    this.BASEURL = process.env.VUE_APP_BASE_URL
		this.getWilayahPanjaitan({ keyword: this.searchData })
		this.getKomisarisWilayah({ keyword: this.searchData })
	},
	methods: {
		...mapActions({
      fetchData: 'fetchData',
			getWilayahPanjaitan: 'user/getWilayahPanjaitan',
			getKomisarisWilayah: 'user/getKomisarisWilayah',
    }),
    LinkRoute(kode){
      this.$router.push({name: "DataKomisaris", params: { kode }});
      console.log(kode);
    },
    LinkRouteKomisaris(kode){
      this.$router.push({name: "DataDetailIuran", params: { komisaris_wilayah: kode }});
      console.log(kode);
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

<style>
</style>