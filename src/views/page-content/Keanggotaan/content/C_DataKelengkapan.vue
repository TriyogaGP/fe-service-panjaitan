<template>
  <div>
		<v-card class="mb-0 pa-8" outlined elevation="0">
			<h2 class="subheading black--text"><u>>>Data Kelengkapan</u></h2>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Jabatan Pengurus *
				</v-col>
				<v-col
					cols="12"
					md="8"	
					class="pt-3"
				>
					<TextField
						v-model="inputDataKelengkapan.jabatan_pengurus"
						label-tf="Jabatan Pengurus"
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
					Wilayah *
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<Autocomplete
						v-model="inputDataKelengkapan.wilayah"
						:data-a="wilayahpanjaitanOptions"
						item-title="label"
						item-value="kode"
						label-a="Wilayah"
						:disabled-a="roleID === '1' || roleID === '2' ? false : true"
						:clearable-a="true"
						@ubah="wilayahPanjaitan('komisaris', $event)"
					/>
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Nama Komisaris Wilayah *
				</v-col>
				<v-col
					cols="12"
					md="8"	
					class="pt-3"
				>
					<Autocomplete
						v-model="inputDataKelengkapan.komisaris_wilayah"
						:data-a="komisariswilayahOptions"
						item-title="namaKomisaris"
						item-value="kodeKomisarisWilayah"
						label-a="Nama Komisaris Wilayah"
						:clearable-a="true"
						:disabled-a="inputDataKelengkapan.wilayah ? false : true"
						@ubah="wilayahPanjaitan('daerah', $event)"
					/>
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Daerah Komisaris *
				</v-col>
				<v-col
					cols="12"
					md="8"	
					class="pt-3"
				>
					<TextField
						v-model="inputDataKelengkapan.daerah"
						label-tf="Daerah Komisaris"
						:clearable-tf="true"
						:disabled-tf="true"
					/>
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Ompu *
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<Autocomplete
						v-model="inputDataKelengkapan.ompu"
						:data-a="ompuOptions"
						item-title="label"
						item-value="kode"
						label-a="Ompu"
						:clearable-a="true"
					/>
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Generasi *
				</v-col>
				<v-col
					cols="12"
					md="8"	
					class="pt-3"
				>
					<TextField
						v-model="inputDataKelengkapan.generasi"
						label-tf="Generasi"
						:clearable-tf="true"
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
					@proses="stepThree()"
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
		dataStepThree: Object,
  },
  data: () => ({
		roleID: '',
		inputDataKelengkapan: {
      id_biodata: '',
      jabatan_pengurus: '',
      wilayah: null,
      komisaris_wilayah: null,
      daerah: '',
      ompu: null,
      generasi: '',
    },
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
			ompuOptions: store => store.setting.ompuOptions,
			wilayahpanjaitanOptions: store => store.setting.wilayahpanjaitanOptions,
			komisariswilayahOptions: store => store.setting.komisariswilayahOptions,
		}),
  },
	watch: {
		inputDataKelengkapan:{
			deep: true,
			handler(value) {
				if(value.jabatan_pengurus != '' && value.wilayah != null && value.komisaris_wilayah != null && value.ompu != null && value.generasi != ''){
					this.kondisiTombol = false
				}else{
					this.kondisiTombol = true
				}
				localStorage.setItem('stepThree', JSON.stringify(value))
			}
		},
		dataStepThree: {
			deep: false,
			handler(value) {
				this.inputDataKelengkapan = {
					id_biodata: value.id_biodata ? value.id_biodata : '',
					jabatan_pengurus: value.jabatan_pengurus ? value.jabatan_pengurus : '',
					wilayah: value.wilayah ? value.wilayah.kode : null,
					komisaris_wilayah: value.komisaris_wilayah ? value.komisaris_wilayah.kodeKomisarisWilayah : null,
					daerah: value.daerah ? value.daerah : null,
					ompu: value.ompu ? value.ompu.kode : null,
					generasi: value.generasi ? value.generasi : '',
				}

				this.getKomisarisWilayah({ kodeWilayah: this.inputDataKelengkapan.wilayah });
			}
		},
	},
	mounted() {
		this.inputDataKelengkapan.id_biodata = this.$route.params.uid;
		this.roleID = localStorage.getItem('roleID')
		this.kondisi = this.$route.params.kondisi;
		if(this.kondisi === 'ADD' && this.roleID === '3') {
			this.inputDataKelengkapan.wilayah = localStorage.getItem('wilayah')
			this.getKomisarisWilayah({ kodeWilayah: this.inputDataKelengkapan.wilayah });
		}
		this.getOmpu();
		this.getWilayahPanjaitan();
	},
	methods: {
		...mapActions({
			getOmpu: 'setting/getOmpu',
			getWilayahPanjaitan: 'setting/getWilayahPanjaitan',
			getKomisarisWilayah: 'setting/getKomisarisWilayah',
		}),
		wilayahPanjaitan(kondisi, e){
			if(kondisi === 'komisaris'){
				if(e){
					this.getKomisarisWilayah({ kodeWilayah: e });
					if(e !== this.inputDataKelengkapan.wilayah){
						this.inputDataKelengkapan.komisaris_wilayah = null
						this.inputDataKelengkapan.daerah = ''
					}
				}else{
					this.inputDataKelengkapan.komisaris_wilayah = null
					this.inputDataKelengkapan.daerah = ''
				}
			}else if(kondisi === 'daerah'){
				if(e){
					this.getKomisarisWilayah({ kodeWilayah: this.inputDataKelengkapan.wilayah });
					let data = this.komisariswilayahOptions.filter(str => str.kodeKomisarisWilayah === e)
					this.inputDataKelengkapan.daerah = data[0].daerah
				}else{
					this.inputDataKelengkapan.daerah = ''
				}
			}
		},
		backStep() {
      this.$emit("backStep", 2);
    },
		stepThree() {
			this.$emit("StepThree");
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