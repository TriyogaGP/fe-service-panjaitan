<template>
  <div>
    <h1 class="subheading grey--text text-decoration-underline">Formulir Keanggotaan</h1>
    <div class="text-right wadah">
      <span class="link" @click="gotolist()">Data Keanggotaan</span>
      <v-icon size="small" class="iconstyle" icon="mdi mdi-menu-right" />
      <span>Formulir Keanggotaan</span>
    </div>
    <v-stepper v-model="stepperVal">
      <v-stepper-header>
        <v-stepper-item
          :complete="stepperVal > 1"
          title="Data Pribadi"
          :value="1"
        ></v-stepper-item>

        <v-divider></v-divider>

        <v-stepper-item
          :complete="stepperVal > 2"
          title="Data Istri & Tanggungan"
          :value="2"
        ></v-stepper-item>

        <v-divider></v-divider>

        <v-stepper-item
          :complete="stepperVal > 3"
          title="Data Kelengkapan"
          :value="3"
        ></v-stepper-item>

        <v-divider></v-divider>

        <v-stepper-item
          title="Preview Formulir"
          :value="4"
        ></v-stepper-item>
      </v-stepper-header>

      <v-stepper-window>
        <v-stepper-window-item :value="1">
          <C_DataBiodata 
            :stepper-val="stepperVal"
            :data-step-one="tampungStepOne"
            @StepOne="nextStep(1)"
            @BackToList="gotolist()"
          />
        </v-stepper-window-item>

        <v-stepper-window-item :value="2">
          <C_DataAnakIstri
            :stepper-val="stepperVal"
            :data-step-two="tampungStepTwo"
            :data-step-two-anak="tampungStepTwoAnak"
            @backStep="backStep(2)"
            @StepTwo="nextStep(2)"
          />
        </v-stepper-window-item>

        <v-stepper-window-item :value="3">
          <C_DataKelengkapan 
            :stepper-val="stepperVal"
            :data-step-three="tampungStepThree"
            @backStep="backStep(3)"
            @StepThree="nextStep(3)"
          />
        </v-stepper-window-item>

        <v-stepper-window-item :value="4">
          <v-lazy v-model="lazyStep2">
            <C_PreviewFormulir 
              :stepper-val="stepperVal"
              @backStep="stepperVal = $event"
            />
          </v-lazy>
        </v-stepper-window-item>
      </v-stepper-window>
    </v-stepper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { useMeta } from 'vue-meta'
import C_DataBiodata from "./content/C_DataBiodata.vue";
import C_DataAnakIstri from "./content/C_DataAnakIstri.vue";
import C_DataKelengkapan from "./content/C_DataKelengkapan.vue";
import C_PreviewFormulir from "./content/C_PreviewFormulir.vue";
export default {
  name: 'FormulirKeanggotaan',
  components: {
    C_DataBiodata,
    C_DataAnakIstri,
    C_DataKelengkapan,
    C_PreviewFormulir
  },
  data: () => ({
    stepperVal: 1,
    steps: 4,
    lazyStep2: false,
    tampungStepOne: {
      id_biodata: '',
      nama_lengkap: '',
      tempat: '',
      tanggal_lahir_suami: '',
      alamat: '',
      provinsi: null,
      kabkota: null,
      kecamatan: null,
      kelurahan: null,
      kode_pos: '',
      pekerjaan_suami: '',
      telp: '',
      status_suami: null,
    },
    tampungStepTwo: {
      id_biodata: '',
      nama_istri: '',
      tanggal_lahir_istri: '',
      pekerjaan_istri: '',
      status_istri: null,
    },
    tampungStepTwoAnak: {
      kategoriAnak: [],
      namaAnak: [],
      tanggalLahir: [],
      statusAnak: [],
      // anaklength: 0,
    },
    tampungStepThree: {
      id_biodata: '',
      jabatan_pengurus: '',
      wilayah: null,
      komisaris_wilayah: null,
      daerah: '',
      ompu: null,
      generasi: '',
    },
  }),
  setup() {
    useMeta({
      title: "Formulir Keanggotaan",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
  },
  computed: {
    ...mapGetters({
      keanggotaanBy: 'user/keanggotaanBy',
    })
  },
  watch: {
    stepperVal(n, o) {
      if (n !== o) {
        window.scrollTo(0, 0);
      }

      if (n != o && n == 4) {
        this.lazyStep2 = true;
      } else {
        this.lazyStep2 = false;
      }
    },
    keanggotaanBy: {
      deep: true,
      handler(value) {
        if(this.stepperVal === 1){
          this.tampungStepOne = {
            id_biodata: value.idBiodata ? value.idBiodata : '',
            nama_lengkap: value.namaLengkap ? value.namaLengkap : '',
            tempat: value.tempat ? value.tempat : '',
            tanggal_lahir_suami: value.tanggalLahirSuami ? value.tanggalLahirSuami : '',
            alamat: value.alamat ? value.alamat : '',
            provinsi: value.provinsi ? value.provinsi : null,
            kabkota: value.kabKota ? value.kabKota : null,
            kecamatan: value.kecamatan ? value.kecamatan : null,
            kelurahan: value.kelurahan ? value.kelurahan : null,
            kode_pos: value.kodePos ? value.kodePos : '',
            pekerjaan_suami: value.pekerjaanSuami ? value.pekerjaanSuami : '',
            telp: value.telp ? value.telp : '',
					  status_suami: value.statusSuami === 'Meninggal' ? 'Meninggal' : value.statusSuami === 'Hidup' ? 'Hidup' : null,
          }
        }
        if(this.stepperVal === 2){
          this.tampungStepTwo = {
            id_biodata: value.idBiodata ? value.idBiodata : '',
            nama_istri: value.namaIstri ? value.namaIstri : '',
            tanggal_lahir_istri: value.tanggalLahirIstri ? value.tanggalLahirIstri : '',
            pekerjaan_istri: value.pekerjaanIstri ? value.pekerjaanIstri : '',
					  status_istri: value.statusIstri === 'Meninggal' ? 'Meninggal' : value.statusIstri === 'Hidup' ? 'Hidup' : null,
          }
          this.tampungStepTwoAnak = {
            kategoriAnak: value.anak.length ? value.anak.map(val => val.kategoriAnak) : [],
            namaAnak: value.anak.length ? value.anak.map(val => val.namaAnak) : [],
            tanggalLahir: value.anak.length ? value.anak.map(val => val.tanggalLahir) : [],
            statusAnak: value.anak.length ? value.anak.map(val => val.statusAnak) : [],
            anaklength: this.$route.params.kondisi === 'EDIT' ? value.anak.length ? value.anak.length : 1 : 0,
          }
        }
        if(this.stepperVal === 3){
          this.tampungStepThree = {
            id_biodata: value.idBiodata ? value.idBiodata : '',
            jabatan_pengurus: value.jabatanPengurus ? value.jabatanPengurus : '',
            wilayah: value.wilayah ? value.wilayah : null,
            komisaris_wilayah: value.komisarisWilayah ? value.komisarisWilayah : null,
            daerah: value.komisarisWilayah ? value.komisarisWilayah.daerah : null,
            ompu: value.ompu ? value.ompu : null,
            generasi: value.generasi ? value.generasi : '',
          }
          // console.log(this.tampungStepThree);
        }
      },
    }
  },
  mounted() {
    // let uid = this.$route.params.uid;
    if(this.$route.params.kondisi === 'EDIT') return this.getKeanggotaanbyUID(this.$route.params.uid)
  },
	methods: {
		...mapActions({
      getKeanggotaanbyUID: 'user/getKeanggotaanbyUID',
    }),
    gotolist() {
      localStorage.removeItem('stepOne')
      localStorage.removeItem('stepTwo')
      localStorage.removeItem('stepTwoAnak')
      localStorage.removeItem('stepThree')
      this.$router.push({name: "DataKeanggotaan", params: { kategori: 'all' }});
    },
    nextStep(step) {
      this.stepperVal = step + 1;
      if(this.$route.params.kondisi === 'EDIT') return this.getKeanggotaanbyUID(this.$route.params.uid)
    },
    backStep(step) {
      this.stepperVal = step - 1;
      if(this.$route.params.kondisi === 'EDIT') return this.getKeanggotaanbyUID(this.$route.params.uid)
    },
	}
}
</script>