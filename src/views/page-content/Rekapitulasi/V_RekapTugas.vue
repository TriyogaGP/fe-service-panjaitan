<template>
  <div>
    <h1 class="subheading grey--text text-decoration-underline">REKAP ULAON / NAMASA (LAS NI ROHA / HABOT NI ROHA)</h1>
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
      <v-data-table
        loading-text="Sedang memuat... Harap tunggu"
        no-data-text="Tidak ada data yang tersedia"
        no-results-text="Tidak ada catatan yang cocok ditemukan"
        :headers="headers"
        :loading="loadingtable"
        :items="dataTugas"
        item-key="idRekap"
        :items-per-page="500"
        hide-default-header
        hide-default-footer
        class="elavation-3 rounded"
      >
        <!-- header -->
        <template #headers="{  }">
          <tr>
            <td rowspan="2" class="tableHeader" width="100%" style="text-align: center;">WILAYAH</td>
            <td colspan="8" class="tableHeader" width="10%" style="text-align: center;">ULAON LAS NI ROHA</td>
            <td colspan="7" class="tableHeader" width="10%" style="text-align: center; border-left: 2px solid white;">HABOT NI ROHA</td>
            <td rowspan="2" class="tableHeader" width="10%" style="text-align: center;">Total</td>
            <td rowspan="2" class="tableHeader" width="10%" style="text-align: center;">Aksi</td>
          </tr>
          <tr>
            <td v-for="index in 8" :key="index" class="tableHeader">
              {{ headerField[index-1] }}
            </td>
            <td v-for="index in 7" :key="index" class="tableHeader">
              {{ headerField[index+7] }}
            </td>
          </tr>
        </template>
        <template #loader>
          <LoaderDataTables />
        </template>
        <template #item="{ item }">
          <tr v-if="item.raw.idRekap !== ''">
            <td class="tableHeader pl-6">{{ `${item.raw.wilayahNama} (${item.raw.wilayahKode})` }}</td>
            <td v-for="index in Number(jumlahFieldTemp)" :key="index" width="10%" class="tableHeader" :style="item.raw.tugas !== null ? item.raw.tugas[conditionValue[index-1].name] === 0 ? 'text-align: center;' : 'text-align: center; background-color: yellow; color: black;' : 'text-align: center;'">
              {{ item.raw.tugas !== null ? item.raw.tugas[conditionValue[index-1].name] === 0 ? 0 : item.raw.tugas[conditionValue[index-1].name] : '' }}
            </td>
            <td class="tableHeader" :style="item.raw.tugas !== null ? item.raw.tugas[conditionValue[15].name] === 0 ? 'text-align: center;' : 'text-align: center; background-color: yellow; color: black;' : 'text-align: center;'">
              {{ item.raw.tugas !== null ? item.raw.tugas[conditionValue[15].name] === 0 ? 0 : item.raw.tugas[conditionValue[15].name] : '' }}
            </td>
            <td class="tableHeader">
              <v-icon v-if="tahun === now && bulan === nowmonth" color="white" icon="mdi mdi-pencil" style="cursor: pointer;" @click="openDialog(item.raw)"/>
            </td>
          </tr>
          <tr v-else>
            <td class="tableHeader" style="text-align: left;">{{ item.raw.bulan === 'jmlbulanini' ? `JUMLAH BULAN INI` : item.raw.bulan === 'jmlsampaibulanini' ? `JUMLAH SAMPAI BULAN INI`  : `JUMLAH SAMPAI BULAN LALU` }}</td>
            <td v-for="index in Number(jumlahFieldTemp)" :key="index" class="tableHeader" width="10%" :style="item.raw.tugas !== null ? item.raw.tugas[conditionValue[index-1].name] === 0 ? 'text-align: center;' : 'text-align: center; background-color: yellow; color: black;' : 'text-align: center;'">
              {{ item.raw.tugas !== null ? item.raw.tugas[conditionValue[index-1].name] === 0 ? 0 : item.raw.tugas[conditionValue[index-1].name] : '' }}
            </td>
            <td class="tableHeader" :style="item.raw.tugas !== null ? item.raw.tugas[conditionValue[15].name] === 0 ? 'text-align: center;' : 'text-align: center; background-color: yellow; color: black;' : 'text-align: center;'">
              {{ item.raw.tugas !== null ? item.raw.tugas[conditionValue[15].name] === 0 ? 0 : item.raw.tugas[conditionValue[15].name] : '' }}
            </td>
            <td class="tableHeader"></td>
          </tr>
        </template>
        <template #top>
          <v-row no-gutters class="pa-2">
            <v-col cols="12" md="6" style="font-size: 10pt;" class="text-left d-flex align-center font-weight-bold">
              {{ `Total Keseluruhan Tahun ${tahun} : ${totalKeseluruhanTugasPerTahun === 0 ? 0 : totalKeseluruhanTugasPerTahun}` }}<br>
              {{ `Total Keseluruhan : ${totalKeseluruhanTugas === 0 ? 0 : totalKeseluruhanTugas}` }}
            </v-col>
            <v-col cols="12" md="6" class="text-right">
              <v-row no-gutters class="pa-2">
                <v-col cols="12" md="4" class="text-right pr-2">
                  <TextField
                    v-model="searchData"
                    icon-prepend-tf="mdi mdi-magnify"
                    label-tf="Pencarian..."
                    :clearable-tf="true"
                    @click:clear="() => {
                      getRekapTugas({ tahun: tahun, bulan: bulan, keyword: '' })
                    }"
                    @keyup.enter="() => {
                      getRekapTugas({ tahun: tahun, bulan: bulan, keyword: searchData })
                    }"
                  />
                </v-col>
                <v-col cols="12" md="4" class="text-right pr-2">
                  <Autocomplete
                    v-model="bulan"
                    :data-a="bulanOptions"
                    item-title="label"
                    item-value="kode"
                    label-a="Bulan"
                  />
                </v-col>
                <v-col cols="12" md="4" class="text-right">
                  <Autocomplete
                    v-model="tahun"
                    :data-a="tahunOptions"
                    label-a="Tahun"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-divider :thickness="2" class="border-opacity-100" color="white" />
        </template>
        <template #bottom />
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="DialogTugas"
			scrollable
			persistent
			transition="dialog-bottom-transition"
			width="auto"
    >
			<v-card color="background-dialog-card">
				<v-toolbar color="surface">
					<v-toolbar-title>Ubah Data Tugas</v-toolbar-title>
					<v-spacer />
					<v-toolbar-items>
						<Button
							variant="plain"
							color-button="#ffffff"
							icon-button="mdi mdi-close"
							model-button="comfortable"
							size-button="large"
							@proses="closeDialog()"
						/>
					</v-toolbar-items>
				</v-toolbar>
				<v-card-text class="pt-4 v-dialog--custom">
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
							class="pt-3"
						>
							{{ `${detailTugas.wilayah} (${detailTugas.kode})` }}
						</v-col>
					</v-row>
					<v-row no-gutters>
						<v-col
							cols="12"
							md="4"
							class="pt-2 d-flex align-center font-weight-bold"
						>
							Bulan - Tahun
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							{{ `${bulanText} - ${tahun}` }}
						</v-col>
					</v-row>
          <h2 class="pt-4">--- Data Menikah (ULAON LAS NI ROHA) ---</h2>
					<v-row no-gutters>
						<v-col
							cols="12"
							md="4"
							class="pt-2 d-flex align-center font-weight-bold"
						>
              Anak Mangoli
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="detailTugas.tugas.Anak_Mangoli"
								label-tf="Anak Mangoli"
                @keypress="onlyNumber($event, 2, detailTugas.tugas.Anak_Mangoli)"
							/>
						</v-col>
					</v-row>
					<v-row no-gutters>
						<v-col
							cols="12"
							md="4"
							class="pt-2 d-flex align-center font-weight-bold"
						>
              Boru Muli
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="detailTugas.tugas.Boru_Muli"
								label-tf="Boru Muli"
                @keypress="onlyNumber($event, 2, detailTugas.tugas.Boru_Muli)"
							/>
						</v-col>
					</v-row>
					<v-row no-gutters>
						<v-col
							cols="12"
							md="4"
							class="pt-2 d-flex align-center font-weight-bold"
						>
              Bere Mangoli/Muli
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="detailTugas.tugas.Bere_Mangoli"
								label-tf="Bere Mangoli/Muli"
                @keypress="onlyNumber($event, 2, detailTugas.tugas.Bere_Mangoli)"
							/>
						</v-col>
					</v-row>
					<v-row no-gutters>
						<v-col
							cols="12"
							md="4"
							class="pt-2 d-flex align-center font-weight-bold"
						>
              Pasahat Sulang2 Pahompu
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="detailTugas.tugas.Pasahat"
								label-tf="Pasahat Sulang2 Pahompu"
                @keypress="onlyNumber($event, 2, detailTugas.tugas.Pasahat)"
							/>
						</v-col>
					</v-row>
					<v-row no-gutters>
						<v-col
							cols="12"
							md="4"
							class="pt-2 d-flex align-center font-weight-bold"
						>
              Manjalo Sulang2 Pahompu
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="detailTugas.tugas.Manjalo"
								label-tf="Manjalo Sulang2 Pahompu"
                @keypress="onlyNumber($event, 2, detailTugas.tugas.Manjalo)"
							/>
						</v-col>
					</v-row>
					<v-row no-gutters>
						<v-col
							cols="12"
							md="4"
							class="pt-2 d-flex align-center font-weight-bold"
						>
              Resepsi
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="detailTugas.tugas.Resepsi"
								label-tf="Resepsi"
                @keypress="onlyNumber($event, 2, detailTugas.tugas.Resepsi)"
							/>
						</v-col>
					</v-row>
					<v-row no-gutters>
						<v-col
							cols="12"
							md="4"
							class="pt-2 d-flex align-center font-weight-bold"
						>
               3M/ 2M/ 1M
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="detailTugas.tugas.M123"
								label-tf=" 3M/ 2M/ 1M"
                @keypress="onlyNumber($event, 2, detailTugas.tugas.M123)"
							/>
						</v-col>
					</v-row>
          <h2 class="pt-4">--- Data Meninggal (HABOT NI ROHA) ---</h2>
          <v-row no-gutters>
						<v-col
							cols="12"
							md="4"
							class="pt-2 d-flex align-center font-weight-bold"
						>
               Ama
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="detailTugas.tugas.Ama"
								label-tf=" Ama"
                @keypress="onlyNumber($event, 2, detailTugas.tugas.Ama)"
							/>
						</v-col>
					</v-row>
          <v-row no-gutters>
						<v-col
							cols="12"
							md="4"
							class="pt-2 d-flex align-center font-weight-bold"
						>
               Ina
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="detailTugas.tugas.Ina"
								label-tf=" Ina"
                @keypress="onlyNumber($event, 2, detailTugas.tugas.Ina)"
							/>
						</v-col>
					</v-row>
          <v-row no-gutters>
						<v-col
							cols="12"
							md="4"
							class="pt-2 d-flex align-center font-weight-bold"
						>
               Hela
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="detailTugas.tugas.Hela"
								label-tf=" Hela"
                @keypress="onlyNumber($event, 2, detailTugas.tugas.Hela)"
							/>
						</v-col>
					</v-row>
          <v-row no-gutters>
						<v-col
							cols="12"
							md="4"
							class="pt-2 d-flex align-center font-weight-bold"
						>
               Boru
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="detailTugas.tugas.Boru"
								label-tf=" Boru"
                @keypress="onlyNumber($event, 2, detailTugas.tugas.Boru)"
							/>
						</v-col>
					</v-row>
          <v-row no-gutters>
						<v-col
							cols="12"
							md="4"
							class="pt-2 d-flex align-center font-weight-bold"
						>
               Naposo (Doli2/ Anak Boru)
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="detailTugas.tugas.Anak_Boru"
								label-tf=" Naposo (Doli2/ Anak Boru)"
                @keypress="onlyNumber($event, 2, detailTugas.tugas.Anak_Boru)"
							/>
						</v-col>
					</v-row>
          <v-row no-gutters>
						<v-col
							cols="12"
							md="4"
							class="pt-2 d-flex align-center font-weight-bold"
						>
               Dakda-nak
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="detailTugas.tugas.Dakdanak"
								label-tf=" Dakda-nak"
                @keypress="onlyNumber($event, 2, detailTugas.tugas.Dakdanak)"
							/>
						</v-col>
					</v-row>
				</v-card-text>
				<v-divider />
				<v-card-actions>
					<v-row 
						no-gutters
						class="mt-1 mr-3"
					>
						<v-col
							class="text-start d-flex align-center font-weight-bold"
							cols="12"
              md="6"
            >
              {{ `TOTAL MENIKAH: ${detailTugas.tugas.totalmenikah} | TOTAL MENINGGAL: ${detailTugas.tugas.totalmeninggal}` }}<br>
              {{ `TOTAL: ${detailTugas.tugas.total}` }}
						</v-col>
						<v-col
							class="text-end"
							cols="12"
              md="6"
						>
							<Button 
								color-button="black"
								nama-button="Proses Data"
								@proses="postRecord()"
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
        @cancel="dialogNotifikasi = false"
      />
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { useMeta } from 'vue-meta'
import { useRoute } from "vue-router";
import PopUpNotifikasi from "../../Layout/PopUpNotifikasi.vue";
export default {
  name: 'DataTugas',
  components: {
    PopUpNotifikasi,
  },
  data: () => ({
    dataTugas: [],
    jumlahFieldTemp: 15,
    now: new Date().getFullYear(),
    nowmonth: new Date().getMonth() + 1,
    tahun: new Date().getFullYear(),
    bulan: new Date().getMonth() + 1,
    bulanOptions: [
      {kode:1, label:'Januari'},
      {kode:2, label:'Februari'},
      {kode:3, label:'Maret'},
      {kode:4, label:'April'},
      {kode:5, label:'Mei'},
      {kode:6, label:'Juni'},
      {kode:7, label:'Juli'},
      {kode:8, label:'Agustus'},
      {kode:9, label:'September'},
      {kode:10, label:'Oktober'},
      {kode:11, label:'November'},
      {kode:12, label:'Desember'}
    ],
    headerField: ['Anak Mangoli', 'Boru Muli', 'Bere Mangoli/Muli', 'Pasahat Sulang2 Pahompu', 'Manjalo Sulang2 Pahompu', 'Resepsi', '3M/ 2M/ 1M', 'Total Menikah', 'Ama', 'Ina', 'Hela', 'Boru', 'Naposo (Doli2/ Anak Boru)', 'Dakda-nak', 'Total Meninggal', 'Total'],
    conditionValue: [],
		searchData: '',
    detailTugas: {
      idRekap: '',
      kode: '',
      wilayah: '',
      bulan: '',
      tahun: '',
      tugas: {
        Anak_Mangoli: 0,
        Boru_Muli: 0,
        Bere_Mangoli: 0,
        Pasahat: 0,
        Manjalo: 0,
        Resepsi: 0,
        M123: 0,
        totalmenikah: 0,
        Ama: 0,
        Ina: 0,
        Hela: 0,
        Boru: 0,
        Anak_Boru: 0,
        Dakdanak: 0,
        totalmeninggal: 0,
        total: 0
      },
      totalTugas: 0,
    },
    totalKeseluruhanTugas: 0,
    totalKeseluruhanTugasPerTahun: 0,
    DialogTugas: false,
    headers: [
      { title: "WILAYAH", key: "WILAYAH", sortable: false, width: "20%" },
      { title: "FIELD1", key: "field1", sortable: false, width: "60%" },
      { title: "FIELD2", key: "field2", sortable: false, width: "60%" },
      { title: "FIELD3", key: "field3", sortable: false, width: "60%" },
      { title: "FIELD4", key: "field4", sortable: false, width: "60%" },
      { title: "FIELD5", key: "field5", sortable: false, width: "60%" },
      { title: "FIELD6", key: "field6", sortable: false, width: "60%" },
      { title: "FIELD7", key: "field7", sortable: false, width: "60%" },
      { title: "TOTALMENIKAH", key: "totalmenikah", sortable: false, width: "60%" },
      { title: "FIELD8", key: "field1", sortable: false, width: "60%" },
      { title: "FIELD9", key: "field2", sortable: false, width: "60%" },
      { title: "FIELD10", key: "field3", sortable: false, width: "60%" },
      { title: "FIELD11", key: "field4", sortable: false, width: "60%" },
      { title: "FIELD12", key: "field5", sortable: false, width: "60%" },
      { title: "FIELD13", key: "field6", sortable: false, width: "60%" },
      { title: "TOTALMENINGGAL", key: "totalmenikah", sortable: false, width: "60%" },
      { title: "AKSI", key: "aksi", sortable: false, width: "60%" },
    ],

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Detail Tugas",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })

    const route = useRoute()
  },
  computed: {
    ...mapState({
      loadingtable: store => store.user.loadingtable,
    }),
    ...mapGetters({
      rekaptugasAll: 'user/rekaptugasAll', 
    }),
    tahunOptions(){
      let tahun = []
      // for (let index = 2024; index <= Number(this.now); index++) {
      for (let index = 2024; index <= 2030; index++) {
        tahun.push(index)
      }
      return tahun
    },
    bulanText(){
      let text = this.bulanOptions.filter(val => val.kode === this.bulan)
      return text.length ? text[0].label : ''
    },
  },
  watch: {
    rekaptugasAll: {
			deep: true,
			async handler(value) {
        if(value === null) {
          this.dataTugas = []
          this.totalKeseluruhanTugas = 0
          this.totalKeseluruhanTugasPerTahun = 0
          this.notifikasi("warning", "Data Tidak Ditemukan", "1")
        }

        this.conditional();
        this.dataTugas = value.result
        this.totalKeseluruhanTugas = value.totalKeseluruhanTugas
        this.totalKeseluruhanTugasPerTahun = value.totalKeseluruhanTugasPerTahun
      }
    },
    detailTugas: {
		  deep: true,
      async handler(value) {
        this.detailTugas.tugas.totalmenikah = Number(value.tugas.Anak_Mangoli) + Number(value.tugas.Boru_Muli) + Number(value.tugas.Bere_Mangoli) +
          Number(value.tugas.Pasahat) + Number(value.tugas.Manjalo) + Number(value.tugas.Resepsi) + Number(value.tugas.M123);
        this.detailTugas.tugas.totalmeninggal = Number(value.tugas.Ama) + Number(value.tugas.Ina) + Number(value.tugas.Hela) + Number(value.tugas.Boru) +
          Number(value.tugas.Anak_Boru) + Number(value.tugas.Dakdanak);
        this.detailTugas.tugas.total = Number(value.tugas.totalmenikah) + Number(value.tugas.totalmeninggal);
      }
    },
    tahun: {
			deep: true,
			async handler(value) {
        this.getRekapTugas({ tahun: value, bulan: this.bulan, keyword: this.searchData })
      }
    },
    bulan: {
			deep: true,
			async handler(value) {
        this.getRekapTugas({ tahun: this.tahun, bulan: value, keyword: this.searchData })
      }
    },
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    this.getRekapTugas({ tahun: this.tahun, bulan: this.bulan, keyword: this.searchData })
	},
	methods: {
    ...mapActions({
      fetchData: 'fetchData',
      getRekapTugas: "user/getRekapTugas", 
    }),
    conditional(){
      this.conditionValue = []
      let headerField = ['Anak_Mangoli', 'Boru_Muli', 'Bere_Mangoli', 'Pasahat', 'Manjalo', 'Resepsi', 'M123', 'totalmenikah', 'Ama', 'Ina', 'Hela', 'Boru', 'Anak_Boru', 'Dakdanak', 'totalmeninggal', 'total']
      for (let index = 0; index < (Number(this.jumlahFieldTemp) + 1); index++) {
        this.conditionValue.push({
          name: headerField[index],
        })
      }
    },
    openDialog(item){
      this.detailTugas = {
        idRekap: item.idRekap,
        kode: item.wilayahKode,
        wilayah: item.wilayahNama,
        bulan: this.bulan,
        tahun: this.tahun,
        tugas: {
          Anak_Mangoli: item.tugas.Anak_Mangoli,
          Boru_Muli: item.tugas.Boru_Muli,
          Bere_Mangoli: item.tugas.Bere_Mangoli,
          Pasahat: item.tugas.Pasahat,
          Manjalo: item.tugas.Manjalo,
          Resepsi: item.tugas.Resepsi,
          M123: item.tugas.M123,
          totalmenikah: item.tugas.totalmenikah,
          Ama: item.tugas.Ama,
          Ina: item.tugas.Ina,
          Hela: item.tugas.Hela,
          Boru: item.tugas.Boru,
          Anak_Boru: item.tugas.Anak_Boru,
          Dakdanak: item.tugas.Dakdanak,
          totalmeninggal: item.tugas.totalmeninggal,
          total: item.tugas.tugas
        },
        totalTugas: item.totalTugas,
      }
      this.DialogTugas = true
    },
    postRecord(){
      let bodyData = {
        idRekap: this.detailTugas.idRekap,
        wilayah: this.detailTugas.kode,
        tahun: String(this.tahun),
        bulan: Number(this.bulan),
        menikah: {
          bulan: Number(this.bulan),
          data: {
            Anak_Mangoli: Number(this.detailTugas.tugas.Anak_Mangoli),
            Boru_Muli: Number(this.detailTugas.tugas.Boru_Muli),
            Bere_Mangoli: Number(this.detailTugas.tugas.Bere_Mangoli),
            Pasahat: Number(this.detailTugas.tugas.Pasahat),
            Manjalo: Number(this.detailTugas.tugas.Manjalo),
            Resepsi: Number(this.detailTugas.tugas.Resepsi),
            M123: Number(this.detailTugas.tugas.M123),
            totalmenikah: Number(this.detailTugas.tugas.totalmenikah),
          }
        },
        meninggal: {
          bulan: Number(this.bulan),
          data: {
            Ama: Number(this.detailTugas.tugas.Ama),
            Ina: Number(this.detailTugas.tugas.Ina),
            Hela: Number(this.detailTugas.tugas.Hela),
            Boru: Number(this.detailTugas.tugas.Boru),
            Anak_Boru: Number(this.detailTugas.tugas.Anak_Boru),
            Dakdanak: Number(this.detailTugas.tugas.Dakdanak),
            totalmeninggal: Number(this.detailTugas.tugas.totalmeninggal),
          }
        }
      }
      // return console.log(bodyData);
      this.$store.dispatch('user/postRekapTugas', bodyData)
      .then((res) => {
        this.closeDialog()
        this.getRekapTugas({ tahun: this.tahun, bulan: this.bulan, keyword: this.searchData })
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    closeDialog(){
      this.detailTugas = {
        idRekap: '',
        kode: '',
        wilayah: '',
        bulan: '',
        tahun: '',
        tugas: {
          Anak_Mangoli: 0,
          Boru_Muli: 0,
          Bere_Mangoli: 0,
          Pasahat: 0,
          Manjalo: 0,
          Resepsi: 0,
          M123: 0,
          totalmenikah: 0,
          Ama: 0,
          Ina: 0,
          Hela: 0,
          Boru: 0,
          Anak_Boru: 0,
          Dakdanak: 0,
          totalmeninggal: 0,
          total: 0
        },
        totalTugas: 0,
      }
      this.totalKeseluruhanTugas = 0
      this.totalKeseluruhanTugasPerTahun = 0
      this.DialogTugas = false
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
.tableHeader {
  font-weight: bold;
  color: white;
  font-size: 7.5pt;
  border-bottom: 2px solid white;
}
</style>