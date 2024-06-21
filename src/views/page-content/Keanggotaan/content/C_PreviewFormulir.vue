<template>
  <div>
		<v-card class="mb-0 pa-8" outlined elevation="0">
      <h2 class="subheading black--text"><u>>>Data Pribadi</u></h2>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Nama Lengkap Suami
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-2"
				>
          {{ DataStepOne.nama_lengkap }}
					<v-tooltip v-if="DataStepOne.status_suami === 'Meninggal'" location="top">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" size="middle" icon="mdi mdi-cross" color="icon-red" />
            </template>
            <span>Meninggal</span>
          </v-tooltip>
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Tempat, Tanggal Lahir
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-2"
				>
					{{ DataStepOne.tempat }}, {{ convertDateForMonth(DataStepOne.tanggal_lahir_suami) }}
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Alamat
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-2"
				>
					{{ DataStepOne.alamat }}
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
					class="pt-2"
				>
					{{ provinsiText }}
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
					class="pt-2"
				>
          {{ kabkotaText }}
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
					class="pt-2"
				>
          {{ kecamatanText }}				
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
					class="pt-2"
				>
					{{ kelurahanText }}
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
					class="pt-2"
				>
          {{ DataStepOne.kode_pos ? DataStepOne.kode_pos : '-' }}
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
					class="pt-2"
				>
					{{ DataStepOne.telp }}
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Pekerjaan Suami
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-2"
				>
          {{ DataStepOne.pekerjaan_suami }}
				</v-col>
			</v-row>
      <h2 class="subheading black--text pt-4"><u>>>Data Istri</u></h2>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Nama Lengkap Istri
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-2"
				>
          {{ DataStepTwo.nama_istri }}
					<v-tooltip v-if="DataStepTwo.status_istri === 'Meninggal'" location="top">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" size="middle" icon="mdi mdi-cross" color="icon-red" />
            </template>
            <span>Meninggal</span>
          </v-tooltip>
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Tanggal Lahir Istri
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-2"
				>
					{{ convertDateForMonth(DataStepTwo.tanggal_lahir_istri) }}
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Pekerjaan Istri
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-2"
				>
          {{ DataStepTwo.pekerjaan_istri }}
				</v-col>
			</v-row>
      <h2 class="subheading black--text pt-4"><u>>>Data Tanggungan</u></h2>
			<span v-if="DataStepTwoAnak.namaAnak[0] === ''">Tidak memiliki tanggungan</span>
			<template v-else>
				<div v-for="i in DataStepTwoAnak.anaklength" :key="i">
					<v-row no-gutters>
						<v-col
							cols="12"
							md="12"
							class="pt-2 d-flex align-center font-weight-bold"
						>
							--- Tanggungan {{ i }} ---
						</v-col>
					</v-row>
					<v-row no-gutters>
						<v-col
							cols="12"
							md="4"
							class="pt-2 d-flex align-center font-weight-bold"
						>
							Nama Tanggungan
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-2"
						>
							{{ `${DataStepTwoAnak.namaAnak[i-1]} - ${DataStepTwoAnak.kategoriAnak[i-1]}` }}
							<v-tooltip v-if="DataStepTwoAnak.statusAnak[i-1] === 'Meninggal'" location="top">
								<template v-slot:activator="{ props }">
									<v-icon v-bind="props" size="middle" icon="mdi mdi-cross" color="icon-red" />
								</template>
								<span>Meninggal</span>
							</v-tooltip>
						</v-col>
					</v-row>
					<v-row no-gutters>
						<v-col
							cols="12"
							md="4"
							class="pt-2 d-flex align-center font-weight-bold"
						>
							Tanggal Lahir Tanggungan
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-2"
						>
							{{ convertDateForMonth(DataStepTwoAnak.tanggalLahir[i-1]) }}
						</v-col>
					</v-row>
				</div>
			</template>
      <h2 class="subheading black--text pt-4"><u>>>Data Kelengkapan</u></h2>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Jabatan Pengurus
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-2"
				>
          {{ DataStepThree.jabatan_pengurus }}
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Wilayah
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-2"
				>
          {{ wilayahText }}
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Nama Komisaris Wilayah
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-2"
				>
          {{ namakomisarisText }}
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Daerah Komisaris
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-2"
				>
          {{ DataStepThree.daerah }}
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Ompu
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-2"
				>
          {{ ompuText }}
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col
					cols="12"
					md="4"
					class="pt-2 d-flex align-center font-weight-bold"
				>
					Generasi
				</v-col>
				<v-col
					cols="12"
					md="8"
					class="pt-2"
				>
          {{ DataStepThree.generasi }}
				</v-col>
			</v-row>
		</v-card>
    <v-row no-gutters>
			<v-col cols="12" class="float-right">
				<Button
					class="float-right mt-3 white--text text--darken-2"
					color-button="#00479b"
					:nama-button="`${kondisi === 'ADD' ? 'Simpan' : 'Ubah'} Data`"
					@proses="kondisi === 'ADD' ? simpanData() : prosesData()"
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
      v-model="dialogQuestion"
      transition="dialog-bottom-transition"
      persistent
      width="600px"
    >
      <v-card color="background-dialog-card">
        <v-card-text class="pa-5">
          <div class="d-flex justify-end">
            <Button
              variant="plain"
              color-button="#000000"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { dialogQuestion = false; }"
            />
          </div>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="12"
            >
              <TextArea
                v-model="reason"
                label-ta="Apa alasan menghapus record ini ?"
                rows="4"
                :clearable-ta="true"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-row 
            no-gutters
            class="mr-3"
          >
            <v-col
              class="text-end"
              cols="12"
            >
              <Button 
                color-button="black"
                nama-button="Request"
                @proses="simpanData()"
              />
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    // DataStepThree: Object,
  },
  data: () => ({
		lazyStep2: false,
		preview: true,
    kondisi: '',
    reason: '',

    //notifikasi
    dialogQuestion: false,
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	setup(){
		let DataStepOne = JSON.parse(localStorage.getItem('stepOne'))
		let DataStepTwo = JSON.parse(localStorage.getItem('stepTwo'))
		let DataStepTwoAnak = JSON.parse(localStorage.getItem('stepTwoAnak'))
		let DataStepThree = JSON.parse(localStorage.getItem('stepThree'))
		return { DataStepOne, DataStepTwo, DataStepTwoAnak, DataStepThree } 
	},
	computed: {
		...mapState({
			ompuOptions: store => store.setting.ompuOptions,
			wilayahpanjaitanOptions: store => store.setting.wilayahpanjaitanOptions,
			komisariswilayahOptions: store => store.setting.komisariswilayahOptions,
			ProvinsiOptions: store => store.setting.ProvinsiOptions,
			KabKotaOptions: store => store.setting.KabKotaOptions,
			KecamatanOptions: store => store.setting.KecamatanOptions,
			KelurahanOptions: store => store.setting.KelurahanOptions,
		}),
		wilayahText(){
			let namawilayah = this.komisariswilayahOptions.filter(str => str.kodeWilayah === this.DataStepThree.wilayah)
			return namawilayah.length ? namawilayah[0].namaWilayah : '-'
		},
		namakomisarisText(){
			let namakomisaris = this.komisariswilayahOptions.filter(str => str.kodeKomisarisWilayah === this.DataStepThree.komisaris_wilayah)
			return namakomisaris.length ? namakomisaris[0].namaKomisaris : '-'
		},
		ompuText(){
			return this.ompuOptions.filter(str => str.kode === this.DataStepThree.ompu)[0].label
		},
		provinsiText(){
			return this.DataStepOne.provinsi ? this.ProvinsiOptions.filter(str => str.kode === this.DataStepOne.provinsi)[0].nama : '-'
		},
		kabkotaText(){
			let kabkota = this.DataStepOne.kabkota ? this.KabKotaOptions.filter(str => str.kode === this.DataStepOne.kabkota)[0] : '-'
			return kabkota === '-' ? '-' : `${kabkota.jenisKabKota} ${kabkota.nama}`
		},
		kecamatanText(){
			return this.DataStepOne.kecamatan ? this.KecamatanOptions.filter(str => str.kode === this.DataStepOne.kecamatan)[0].nama : '-'
		},
		kelurahanText(){
			let keldes = this.DataStepOne.kelurahan ? this.KelurahanOptions.filter(str => str.kode === this.DataStepOne.kelurahan)[0] : '-'
			return keldes === '-' ? '-' : `${keldes.jenisKelDes} ${keldes.nama}`
		},
  },
	watch: {
    stepperVal(n, o) {
      if (n != o && n == 4) {
        this.lazyStep2 = true;
      } else {
        this.lazyStep2 = false;
      }
    },
	},
	mounted() {
    this.kondisi = this.$route.params.kondisi
		this.getOmpu();
		this.getWilayahPanjaitan();
		this.getKomisarisWilayah({ KodeWilayah: '' });
		this.getWilayah2023({ bagian: 'provinsi', KodeWilayah: null })
		this.getWilayah2023({ bagian: 'kabkota', KodeWilayah: this.DataStepOne.provinsi })
		this.getWilayah2023({ bagian: 'kecamatan', KodeWilayah: this.DataStepOne.kabkota })
		this.getWilayah2023({ bagian: 'kelurahan', KodeWilayah: this.DataStepOne.kecamatan })
	},
	methods: {
		...mapActions({
			getOmpu: 'setting/getOmpu',
			getWilayahPanjaitan: 'setting/getWilayahPanjaitan',
			getKomisarisWilayah: 'setting/getKomisarisWilayah',
			getWilayah2023: "setting/getWilayah2023",
		}),
		prosesData() {
			if(localStorage.getItem('roleID') === '1' || localStorage.getItem('roleID') === '2') simpanData();
      if(localStorage.getItem('roleID') === '3') this.dialogQuestion = true;
		},
		simpanData() {
			let anak = []
			for (let index = 0; index < this.DataStepTwoAnak.anaklength; index++) {
				anak.push({
					kategoriAnak: this.DataStepTwoAnak.kategoriAnak[index],
					namaAnak: this.DataStepTwoAnak.namaAnak[index],
					tanggalLahir: this.convertDateToPicker2(this.DataStepTwoAnak.tanggalLahir[index]),
					statusAnak: this.DataStepTwoAnak.statusAnak[index],
				});
			}

      let bodyData = {
			  jenis: this.kondisi,
			  idBiodata: this.DataStepOne.id_biodata,
        namaLengkap: this.DataStepOne.nama_lengkap,
        tempat: this.DataStepOne.tempat,
        tanggalLahirSuami: this.convertDateToPicker2(this.DataStepOne.tanggal_lahir_suami),
        alamat: this.DataStepOne.alamat,
        provinsi: this.DataStepOne.provinsi,
        kabKota: this.DataStepOne.kabkota,
        kecamatan: this.DataStepOne.kecamatan,
        kelurahan: this.DataStepOne.kelurahan,
        kodePos: this.DataStepOne.kode_pos,
        pekerjaanSuami: this.DataStepOne.pekerjaan_suami,
        telp: this.DataStepOne.telp,
        namaIstri: this.DataStepTwo.nama_istri,
        tanggalLahirIstri: this.convertDateToPicker2(this.DataStepTwo.tanggal_lahir_istri),
        pekerjaanIstri: this.DataStepTwo.pekerjaan_istri,
        anak: anak[0].namaAnak === '' ? [] : anak,
        jabatanPengurus: this.DataStepThree.jabatan_pengurus,
        wilayah: this.DataStepThree.wilayah,
        komisarisWilayah: this.DataStepThree.komisaris_wilayah,
        ompu: this.DataStepThree.ompu,
        generasi: this.DataStepThree.generasi,
        statusSuami: this.DataStepOne.status_suami,
        statusIstri: this.DataStepTwo.status_istri,
        reason: this.reason,
      }

			// return console.log(bodyData);
      this.$store.dispatch('user/postKeanggotaan', bodyData)
      .then((res) => {
				this.reason = ''
				localStorage.removeItem('stepOne')
				localStorage.removeItem('stepTwo')
				localStorage.removeItem('stepTwoAnak')
				localStorage.removeItem('stepThree')
				this.notifikasi("success", res.data.message, "2")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
		},
    goToProses(){
			this.$router.push({name: "DataKeanggotaan"});
		},
		cancel() {
      this.stepperVal = --this.stepperVal;
    },
    backStep() {
      this.$emit("backStep", 3);
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