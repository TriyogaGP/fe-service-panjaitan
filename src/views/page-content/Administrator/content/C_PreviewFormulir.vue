<template>
  <div>
		<v-card class="mb-0 pa-8" outlined elevation="0">
      <h2 class="subheading black--text"><u>>>Data Log In</u></h2>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Consumer Type
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
          {{ levelOptions.filter(str => str.value === DataStepOne.level )[0].title }}
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Wilayah Panjaiatan
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
          {{ wilayahPanjaitanText === '00' ? 'Tidak Memiliki Wilayah' : wilayahPanjaitanText }}
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Nama Lengkap
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
          {{ DataStepOne.nama_lengkap }}
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Username
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					{{ DataStepOne.username }}
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Kata Sandi
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<!-- {{ passText }} ({{ DataStepOne.password }}) -->
					{{ DataStepOne.password }}
				</v-col>
			</v-row>
		</v-card>
    <v-row no-gutters>
			<v-col cols="12" class="float-right">
				<Button
					class="float-right mt-3 white--text text--darken-2"
					color-button="#00479b"
					:nama-button="`${kondisi === 'ADD' ? 'Simpan' : 'Ubah'} Data`"
					@proses="simpanData()"
				/>
				<Button
					class="float-right mr-4 mt-3"
					color-button="#9b1f15"
					nama-button="Kembali"
					@proses="backStep()"
				/>
			</v-col>
		</v-row>
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
        @proses="goToProses"
        @cancel="dialogNotifikasi = false"
      />
    </v-dialog>
	</div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import PopUpNotifikasi from "../../../Layout/PopUpNotifikasi.vue";
export default {
  components: {
    PopUpNotifikasi
  },
	props: {
    stepperVal: {
      type: Number,
      default: null
    },
    // DataStepOne: Object,
    // DataStepTwo: Object,
  },
  data: () => ({
		lazyStep2: false,
		preview: true,
    kondisi: '',
    passText: '',
		levelOptions: [
			{ title: 'Super Administrator', value: 1 },
			{ title: 'Administrator Pusat', value: 2 },
			{ title: 'Administrator Wilayah', value: 3 },
			{ title: 'Administrator Bidang', value: 4 },
		],

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	setup(){
		let DataStepOne = JSON.parse(localStorage.getItem('stepOne'))
		return { DataStepOne } 
	},
	computed: {
		...mapState({
			wilayahpanjaitanOptions: store => store.setting.wilayahpanjaitanOptions,
    }),
		wilayahPanjaitanText(){
			let data = this.wilayahpanjaitanOptions.filter(str => str.kode === this.DataStepOne.wilayah)
			return this.DataStepOne.wilayah === '00' || this.DataStepOne.wilayah === null ? '00' : data.length ? data[0].label : null
		},
  },
	watch: {
    stepperVal(n, o) {
      if (n != o && n == 2) {
        this.lazyStep2 = true;
      } else {
        this.lazyStep2 = false;
      }
    },
	},
	mounted() {
    this.kondisi = this.$route.params.kondisi
		this.getWilayahPanjaitan()
	},
	methods: {
		...mapActions({
			fetchData: 'fetchData',
			getWilayahPanjaitan: 'setting/getWilayahPanjaitan',
		}),
		simpanData() {
      let bodyData = {
				jenis: this.kondisi,
				idAdmin: this.DataStepOne.id_user,
				consumerType: this.DataStepOne.level,
				wilayah: this.DataStepOne.wilayah === null ? '00' : this.DataStepOne.wilayah,
				nama: this.DataStepOne.nama_lengkap,
				username: this.DataStepOne.username,
				password: this.DataStepOne.password,
      }
      this.$store.dispatch('user/postAdministrator', bodyData)
      .then((res) => {
				localStorage.removeItem('stepOne')
        this.notifikasi("success", res.data.message, "2")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
    goToProses(){
			this.$router.push({name: "DataAdministrator"});
		},
		cancel() {
      this.stepperVal = --this.stepperVal;
    },
    backStep() {
      this.$emit("backStep", 1);
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