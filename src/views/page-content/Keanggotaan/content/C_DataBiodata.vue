<template>
  <div>
		<v-card class="mb-0 pa-8" outlined elevation="0">
			<h2 class="subheading black--text"><u>>>Data Biodata</u></h2>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Nama Lengkap *
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<v-row no-gutters>
						<v-col
							cols="12"
							md="6"
							class="d-flex align-center font-weight-bold"
						>
							<TextField
								v-model="inputDataBiodata.nama_lengkap"
								label-tf="Nama Lengkap"
								:clearable-tf="true"
							/>
						</v-col>
						<v-col
							cols="12"
							md="6"
							class="pl-2 d-flex align-center font-weight-bold"
						>
							<Autocomplete
								v-model="inputDataBiodata.status_suami"
								:data-a="statusOptions"
								item-title="title"
								item-value="value"
								label-a="Status Suami"
								:clearable-a="true"
							/>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Tempat, Tanggal Lahir Suami *
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<v-row no-gutters>
						<v-col
							cols="12"
							md="6"
							class="d-flex justify-center align-center"
						>
							<TextField
								v-model="inputDataBiodata.tempat"
								label-tf="Tempat Lahir Suami"
								:clearable-tf="true"
							/>
						</v-col>
						<v-col
							cols="12"
							md="6"
							class="pl-2 d-flex justify-end align-center"
						>
							<vue-date-picker
								v-model="inputDataBiodata.tanggal_lahir_suami"
								placeholder="Tanggal Lahir"
								format="dd-MM-yyyy"
								:enable-time-picker="false"
								auto-apply
							/>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Telepon
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<TextField
						v-model="inputDataBiodata.telp"
						label-tf="Telepon"
						:clearable-tf="true"
						@keypress="onlyNumber($event, 15, inputDataBiodata.telp)"
					/>
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Pekerjaan Suami *
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<TextField
						v-model="inputDataBiodata.pekerjaan_suami"
						label-tf="Pekerjaan Suami"
						:clearable-tf="true"
					/>
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Alamat *
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<TextArea
						v-model="inputDataBiodata.alamat"
						label-ta="Alamat"
						rows="4"
						:clearable-ta="true"
					/>
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Provinsi
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<Autocomplete
						v-model="inputDataBiodata.provinsi"
						:data-a="ProvinsiOptions"
						item-title="nama"
						item-value="kode"
						label-a="Provinsi"
						:clearable-a="true"
						@ubah="wilayah('provinsi', $event)"
					/>
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Kabupaten / Kota
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<Autocomplete
						v-model="inputDataBiodata.kabkota"
						:data-a="optionsKabKota"
						item-title="nama"
						item-value="kode"
						label-a="Kabupaten / Kota"
						:clearable-a="true"
						:disabled-a="inputDataBiodata.provinsi ? false : true"
						@ubah="wilayah('kabkota', $event)"
					/>
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Kecamatan
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<Autocomplete
						v-model="inputDataBiodata.kecamatan"
						:data-a="KecamatanOptions"
						item-title="nama"
						item-value="kode"
						label-a="Kecamatan"
						:clearable-a="true"
						:disabled-a="inputDataBiodata.kabkota ? false : true"
						@ubah="wilayah('kecamatan', $event)"
					/>
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Kelurahan / Desa
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<Autocomplete
						v-model="inputDataBiodata.kelurahan"
						:data-a="optionsKelurahan"
						item-title="nama"
						item-value="kode"
						label-a="Kelurahan / Desa"
						:clearable-a="true"
						:disabled-a="inputDataBiodata.kecamatan ? false : true"
						@ubah="wilayah('kelurahan', $event)"
					/>
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Kode Pos
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<TextField
						v-model="inputDataBiodata.kode_pos"
						label-tf="Kode Pos"
						:disabled-tf="true"
					/>
				</v-col>
			</v-row>
		</v-card>
		<v-row no-gutters>
			<v-col cols="12" class="float-right">
				<Button
					class="float-right mt-3 white--text text--darken-2"
					color-button="#00479b"
					nama-button="Selanjutnya"
					:disabled-button="kondisiTombol"
					@proses="stepOne()"
				/>
				<Button
					class="float-right mr-4 mt-3"
					color-button="#9b1f15"
					nama-button="Kembali Ke List"
					@proses="gotolist()"
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
    dataStepOne: Object,
  },
  data: () => ({
		inputDataBiodata: {
      id_biodata: '',
      nomor_induk: '',
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
		statusOptions: [
			{ title: 'Hidup', value: 'Hidup' },
			{ title: 'Meninggal', value: 'Meninggal' },
		],
    kondisi: '',
    kondisiTombol: true,

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	computed: {
		...mapState({
      ProvinsiOptions: state => state.setting.ProvinsiOptions,
      KabKotaOptions: state => state.setting.KabKotaOptions,
      KecamatanOptions: state => state.setting.KecamatanOptions,
      KelurahanOptions: state => state.setting.KelurahanOptions,
    }),
		optionsKabKota(){
      let kabkota = this.KabKotaOptions.map(x => {
        return {
          kode: x.kode,
          nama: `${x.jenisKabKota} ${x.nama}`
        }
      })
      return kabkota
    },
		optionsKelurahan(){
      let kel = this.KelurahanOptions.map(x => {
        return {
          kode: x.kode,
          nama: `${x.jenisKelDes} ${x.nama}`
        }
      })
      return kel
    },
  },
	watch: {
		inputDataBiodata: {
			deep: true,
			handler(value) {
				if(!value.provinsi){
					this.inputDataBiodata.kabkota = null
					this.inputDataBiodata.kecamatan = null
					this.inputDataBiodata.kelurahan = null
					this.inputDataBiodata.kode_pos = null
				}
				
				if(value.nama_lengkap != '' && value.status_suami != null && value.tempat != '' && value.tanggal_lahir_suami != '' && value.pekerjaan_suami != '' && 
				value.alamat != ''){
					this.kondisiTombol = false
				}else{
					this.kondisiTombol = true
				}
				localStorage.setItem('stepOne', JSON.stringify(value))
			}
		},
		dataStepOne: {
			deep: false,
			handler(value) {
				this.inputDataBiodata = {
					id_biodata: value.id_biodata ? value.id_biodata : '',
					nama_lengkap: value.nama_lengkap ? value.nama_lengkap : '',
					tempat: value.tempat ? value.tempat : '',
					tanggal_lahir_suami: value.tanggal_lahir_suami ? value.tanggal_lahir_suami : '',
					alamat: value.alamat ? value.alamat : '',
					provinsi: value.provinsi ? value.provinsi.kode : null,
					kabkota: value.kabkota ? value.kabkota.kode : null,
					kecamatan: value.kecamatan ? value.kecamatan.kode : null,
					kelurahan: value.kelurahan ? value.kelurahan.kode : null,
					kode_pos: value.kode_pos ? value.kode_pos : '',
					pekerjaan_suami: value.pekerjaan_suami ? value.pekerjaan_suami : '',
					telp: value.telp ? value.telp : '',
					status_suami: value.status_suami === 'Meninggal' ? 'Meninggal' : value.status_suami === 'Hidup' ? 'Hidup' : null,
				}

				this.getWilayah2023({ bagian: 'kabkota', KodeWilayah: this.inputDataBiodata.provinsi })
				this.getWilayah2023({ bagian: 'kecamatan', KodeWilayah: this.inputDataBiodata.kabkota })
				this.getWilayah2023({ bagian: 'kelurahan', KodeWilayah: this.inputDataBiodata.kecamatan })
			}
		},
	},
	mounted() {
		this.inputDataBiodata.id_biodata = this.$route.params.uid;
		this.kondisi = this.$route.params.kondisi;
		this.getWilayah2023({ bagian: 'provinsi', KodeWilayah: null })
	},
	methods: {
		...mapActions({
			getWilayah2023: 'setting/getWilayah2023',
		}),
		wilayah(kondisi, e){
			if(kondisi === 'provinsi'){
				if(e){
					this.getWilayah2023({ bagian: 'kabkota', KodeWilayah: e })
					this.inputDataBiodata.kabkota = null
					this.inputDataBiodata.kecamatan = null
					this.inputDataBiodata.kelurahan = null
					this.inputDataBiodata.kode_pos = ''
				}
			}else if(kondisi === 'kabkota'){
				if(e){
					this.getWilayah2023({ bagian: 'kecamatan', KodeWilayah: e })
					if(e !== this.inputDataBiodata.kecamatan) {
						this.inputDataBiodata.kecamatan = null
						this.inputDataBiodata.kelurahan = null
						this.inputDataBiodata.kode_pos = ''
					}
				}else{
					this.inputDataBiodata.kecamatan = null
					this.inputDataBiodata.kelurahan = null
					this.inputDataBiodata.kode_pos = ''
				}
			}else if(kondisi === 'kecamatan'){
				if(e){
					this.getWilayah2023({ bagian: 'kelurahan', KodeWilayah: e })
					if(e !== this.inputDataBiodata.kelurahan) {
						this.inputDataBiodata.kelurahan = null
						this.inputDataBiodata.kode_pos = ''	
					}
				}else{
					this.inputDataBiodata.kelurahan = null
					this.inputDataBiodata.kode_pos = ''
				}
			}else if(kondisi === 'kelurahan'){
				if(e){
					let data = this.KelurahanOptions.filter(str => str.kode === e)
					if(this.$route.params.kondisi === 'ADD'){
						this.inputDataBiodata.kode_pos = data[0].kodePos
					}else if(this.$route.params.kondisi === 'EDIT'){
						this.inputDataBiodata.kode_pos = this.inputDataBiodata.kode_pos ? data.length ? data[0].kodePos : this.inputDataBiodata.kode_pos : data[0].kodePos
					}
				}else{
					this.inputDataBiodata.kode_pos = ''
				}
			}
		},
		onClickVisible(d) {
      this[d] = !this[d]
    },
		gotolist() {
      this.$emit("BackToList");
    },
		stepOne() {
			this.$emit("StepOne");
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