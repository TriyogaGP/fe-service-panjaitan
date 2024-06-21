<template>
  <div>
		<v-card class="mb-0 pa-8" outlined elevation="0">
			<h2 class="subheading black--text"><u>>>Data Istri</u></h2>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Nama Lengkap Istri *
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
								v-model="inputDataIstri.nama_istri"
								label-tf="Nama Lengkap Istri"
								:clearable-tf="true"
							/>
						</v-col>
						<v-col
							cols="12"
							md="6"
							class="pl-2 d-flex align-center font-weight-bold"
						>
							<Autocomplete
								v-model="inputDataIstri.status_istri"
								:data-a="statusOptions"
								item-title="title"
								item-value="value"
								label-a="Status Istri"
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
					Tanggal Lahir Istri *
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<vue-date-picker
						v-model="inputDataIstri.tanggal_lahir_istri"
						placeholder="Tanggal Lahir Istri"
						format="dd-MM-yyyy"
						:enable-time-picker="false"
						auto-apply
					/>
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Pekerjaan Istri *
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-3"
				>
					<TextField
						v-model="inputDataIstri.pekerjaan_istri"
						label-tf="Pekerjaan Istri"
						:clearable-tf="true"
					/>
				</v-col>
			</v-row>
			<h2 class="subheading black--text"><u>>>Data Tanggungan</u></h2>
			<div v-for="i in inputDataAnak.anaklength" :key="i">
				<v-row no-gutters>
					<v-col
						cols="12"
						md="12"
						class="pt-2 d-flex align-center font-weight-bold"
					>
						Tanggungan {{ i }}
					</v-col>
				</v-row>
				<v-row no-gutters>
					<v-col
						cols="12"
						md="12"
						class="pt-3"
					>
						<v-row no-gutters>
							<v-col
								cols="12"
								md="5"
								class="d-flex align-center"
							>
								<TextField
									v-model="inputDataAnak.namaAnak[i-1]"
									label-tf="Nama Lengkap"
									:clearable-tf="true"
								/>
							</v-col>
							<v-col
								cols="12"
								md="2"
								class="pl-2 d-flex align-center"
							>
								<Autocomplete
									v-model="inputDataAnak.kategoriAnak[i-1]"
									:data-a="kategoriOptions"
									item-title="title"
									item-value="value"
									label-a="Kategori"
									:clearable-a="true"
								/>
							</v-col>
							<v-col
								cols="12"
								md="2"
								class="pl-2 d-flex align-center"
							>
								<Autocomplete
									v-model="inputDataAnak.statusAnak[i-1]"
									:data-a="statusOptions"
									item-title="title"
									item-value="value"
									label-a="Status"
									:clearable-a="true"
								/>
							</v-col>
							<v-col
								cols="12"
								md="3"
								class="pl-2 d-flex align-center"
								style="font-size: 9pt;"
							>
								<vue-date-picker
									v-model="inputDataAnak.tanggalLahir[i-1]"
									placeholder="Tanggal Lahir"
									format="dd-MM-yyyy"
									:enable-time-picker="false"
									auto-apply
								/>
								<span>
									<Button
										v-if="i === 1"
										model-button="comfortable"
										color-button="surface"
										class="ml-2"
										icon-button="mdi mdi-plus-thick"
										@proses="prosesTanggungan('tambah', null)"
									/>
									<v-tooltip activator="parent" location="top">tambah</v-tooltip>
								</span>
								<span>
									<Button
										v-if="i === 1 && kondisi === 'EDIT'"
										model-button="comfortable"
										color-button="surface"
										class="ml-2"
										icon-button="mdi mdi-delete"
										@proses="prosesTanggungan('hapus', i-1)"
									/>
										<!-- :disabled-button="inputDataAnak.anaklength === 1 ? true : false" -->
									<v-tooltip activator="parent" location="top">hapus</v-tooltip>
								</span>
								<span>
									<Button
										v-if="i > 1"
										model-button="comfortable"
										color-button="surface"
										class="ml-2"
										icon-button="mdi mdi-delete"
										@proses="prosesTanggungan('hapus', i-1)"
									/>
									<v-tooltip activator="parent" location="top">hapus</v-tooltip>
								</span>
							</v-col>
						</v-row>
					</v-col>
				</v-row>
			</div>
		</v-card>
		<v-row no-gutters>
			<v-col cols="12" class="float-right">
				<Button
					class="float-right mt-3 white--text text--darken-2"
					color-button="#00479b"
					nama-button="Selanjutnya"
					:disabled-button="kondisiTombol"
					@proses="stepTwo()"
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
		dataStepTwo: Object,
		dataStepTwoAnak: Object,
  },
  data: () => ({
		inputDataIstri: {
			id_biodata: '',
      nama_istri: '',
      tanggal_lahir_istri: '',
      pekerjaan_istri: '',
      status_istri: null,
    },
		inputDataAnak: {
			kategoriAnak: [],
			namaAnak: [],
			tanggalLahir: [],
			statusAnak: [],
			anaklength: 0,
		},
		kondisiTombol: true,
    statusOptions: [
			{ title: 'Hidup', value: 'Hidup' },
			{ title: 'Meninggal', value: 'Meninggal' },
		],
    kategoriOptions: [
			{ title: 'Anak', value: 'Anak' },
			{ title: 'Boru', value: 'Boru' },
		],

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	watch: {
		inputDataIstri:{
			deep: true,
			handler(value) {
				if(value.nama_istri != '' && value.status_istri != null && value.tanggal_lahir_istri != '' && value.pekerjaan_istri != ''){
					this.kondisiTombol = false
				}else{
					this.kondisiTombol = true
				}
				localStorage.setItem('stepTwo', JSON.stringify(this.inputDataIstri))
			}
		},
		inputDataAnak:{
			deep: true,
			handler(value) {
				localStorage.setItem('stepTwoAnak', JSON.stringify(this.inputDataAnak))
			}
		},
		dataStepTwo: {
			deep: true,
			handler(value) {
				this.inputDataIstri = {
					id_biodata: value.id_biodata ? value.id_biodata : '',
					nama_istri: value.nama_istri ? value.nama_istri : '',
					tanggal_lahir_istri: value.tanggal_lahir_istri ? value.tanggal_lahir_istri : '',
					pekerjaan_istri: value.pekerjaan_istri ? value.pekerjaan_istri : '',
					status_istri: value.status_istri === 'Meninggal' ? 'Meninggal' : value.status_istri === 'Hidup' ? 'Hidup' : null,
				}
			}
		},
		dataStepTwoAnak: {
			deep: true,
			handler(value) {
				this.inputDataAnak = {
					kategoriAnak: value.kategoriAnak ? value.kategoriAnak : [],
					namaAnak: value.namaAnak ? value.namaAnak : [],
					tanggalLahir: value.tanggalLahir ? value.tanggalLahir : [],
					statusAnak: value.statusAnak ? value.statusAnak : [],
					anaklength: value.anaklength,
				}
			}
		},
	},
	mounted() {
		this.inputDataIstri.id_biodata = this.$route.params.uid;
		this.kondisi = this.$route.params.kondisi;
		if(this.kondisi === 'ADD') {
			this.inputDataAnak.anaklength = 1;
			this.inputDataAnak.kategoriAnak.push(null);
			this.inputDataAnak.namaAnak.push('');
			this.inputDataAnak.tanggalLahir.push('');
			this.inputDataAnak.statusAnak.push(null);
		}
	},
	methods: {
		...mapActions({
		}),
		prosesTanggungan(kondisi, index){
			if(this.kondisi === 'ADD') {
				if(kondisi === 'tambah'){
					this.inputDataAnak.anaklength += 1;
					this.inputDataAnak.kategoriAnak.push(null);
					this.inputDataAnak.namaAnak.push('');
					this.inputDataAnak.tanggalLahir.push('');
					this.inputDataAnak.statusAnak.push('');
				}else if(kondisi === 'hapus'){
					this.inputDataAnak.anaklength -= 1;
					this.inputDataAnak.kategoriAnak.splice(index, 1);
					this.inputDataAnak.namaAnak.splice(index, 1);
					this.inputDataAnak.tanggalLahir.splice(index, 1);
					this.inputDataAnak.statusAnak.splice(index, 1);
				}
			}else if(this.kondisi === 'EDIT') {
				if(kondisi === 'tambah'){
					this.inputDataAnak.anaklength += 1;
					this.inputDataAnak.kategoriAnak.push(null);
					this.inputDataAnak.namaAnak.push('');
					this.inputDataAnak.tanggalLahir.push('');
					this.inputDataAnak.statusAnak.push('');
				}else if(kondisi === 'hapus'){
					this.inputDataAnak.anaklength -= 1;
					this.inputDataAnak.kategoriAnak.splice(index, 1);
					this.inputDataAnak.namaAnak.splice(index, 1);
					this.inputDataAnak.tanggalLahir.splice(index, 1);
					this.inputDataAnak.statusAnak.splice(index, 1);
					if(this.inputDataAnak.anaklength === 0){
						this.inputDataAnak.kategoriAnak.push(null);
						this.inputDataAnak.namaAnak.push('');
						this.inputDataAnak.tanggalLahir.push('');
						this.inputDataAnak.statusAnak.push(null);
					}
				}
			}
		},
		backStep() {
      this.$emit("backStep");
    },
		stepTwo() {
			this.$emit("StepTwo");
			this.$emit("StepTwoAnak");
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