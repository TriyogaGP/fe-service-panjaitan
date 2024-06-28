<template>
  <div>
    <v-card class="mb-2 pa-1 rounded" variant="outlined" elevation="4">
      <v-container fluid>
        <v-row v-if="roleID === '1' || roleID === '2'">
          <v-col
            v-for="hasil in wilayahpanjaitanOptions"
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
              <v-card-actions>
                <v-img
                  :src="hasil.lambang"
                  :height="150"
                  aspect-ratio="16/9"
                />
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
              <v-card-actions style="display: flex; justify-content: center;">
                <span v-html="hasil.namaKomisaris" style="font-size: 9pt; font-weight: bold;"/>
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
			wilayahpanjaitanOptions: store => store.setting.wilayahpanjaitanOptions,
			komisariswilayahOptions: store => store.setting.komisariswilayahOptions,
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
  },
  watch: {
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    this.roleID = localStorage.getItem('roleID')
    this.BASEURL = process.env.VUE_APP_BASE_URL
		this.getWilayahPanjaitan()
		this.getKomisarisWilayah({ KodeWilayah: '' })
	},
	methods: {
		...mapActions({
      fetchData: 'fetchData',
			getWilayahPanjaitan: 'setting/getWilayahPanjaitan',
			getKomisarisWilayah: 'setting/getKomisarisWilayah',
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