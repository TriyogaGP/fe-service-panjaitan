<template>
  <div>
    <h1 class="subheading grey--text text-decoration-underline">Detail Iuran Keanggotaan</h1>
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
      <v-data-table
        loading-text="Sedang memuat... Harap tunggu"
        no-data-text="Tidak ada data yang tersedia"
        no-results-text="Tidak ada catatan yang cocok ditemukan"
        :headers="headers"
        :loading="loadingtable"
        :items="dataIuran"
        item-key="idIuran"
        hide-default-header
        hide-default-footer
        class="elavation-3 rounded"
      >
        <!-- header -->
        <template #headers="{  }">
          <tr>
            <td rowspan="2" class="tableHeader">NOMOR INDUK</td>
            <td rowspan="2" class="tableHeader">NAMA LENGKAP</td>
            <td :colspan="(Number(jumlahBulanTemp))" class="tableHeader" style="text-align: center;">BULAN</td>
            <td rowspan="2" class="tableHeader">TOTAL</td>
            <td rowspan="2" class="tableHeader">AKSI</td>
          </tr>
          <tr>
            <td v-for="index in (Number(jumlahBulanTemp))" :key="index" class="tableHeader">
              {{ bulan[index-1] }}
            </td>
          </tr>
        </template>
        <template #loader>
          <LoaderDataTables />
        </template>
        <template #item="{ item }">
          <tr v-if="item.raw.nik !== ''">
            <td class="tableHeader">{{ item.raw.nik }}</td>
            <td class="tableHeader">{{ item.raw.namaLengkap }}</td>
            <td v-for="index in (Number(jumlahBulanTemp))" :key="index" class="tableHeader" style="text-align: center;">
              {{ item.raw.iuran[conditionValue[index-1].name] === 0 ? 0 : `Rp. ${currencyDotFormatNumber(item.raw.iuran[conditionValue[index-1].name])}` }}
            </td>
            <td class="tableHeader">{{ item.raw.totalIuran === '0' ? 0 : `Rp. ${currencyDotFormatNumber(item.raw.totalIuran)}` }}</td>
            <td class="tableHeader">
              <v-icon color="white" icon="mdi mdi-pencil" style="cursor: pointer;" @click="openDialog(item.raw)"/>
            </td>
          </tr>
          <tr v-else>
            <td colspan="2" class="tableHeader" style="text-align: center;">TOTAL</td>
            <td v-for="index in (Number(jumlahBulanTemp))" :key="index" class="tableHeader" style="text-align: center;">
              {{ item.raw.iuran[conditionValue[index-1].name] === 0 ? 0 : `Rp. ${currencyDotFormatNumber(item.raw.iuran[conditionValue[index-1].name])}` }}
            </td>
            <td class="tableHeader">{{ item.raw.totalIuran === 0 ? 0 : `Rp. ${currencyDotFormatNumber(item.raw.totalIuran)}` }}</td>
            <td class="tableHeader"></td>
          </tr>
        </template>
        <template #bottom />
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="DialogIuran"
			scrollable
			persistent
			transition="dialog-bottom-transition"
			width="auto"
    >
			<v-card color="background-dialog-card">
				<v-toolbar color="surface">
					<v-toolbar-title>Ubah Data Iuran</v-toolbar-title>
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
							Nama Lengkap
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="detailIuran.namaLengkap"
								label-tf="Nama Lengkap"
								:readonly-tf="true"
							/>
						</v-col>
					</v-row>
					<v-row no-gutters>
						<v-col
							cols="12"
							md="4"
							class="pt-2 d-flex align-center font-weight-bold"
						>
							Januari
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="detailIuran.iuran.januari"
								label-tf="Januari"
                @keypress="onlyNumber($event, 15, detailIuran.iuran.januari)"
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
							Februari
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="detailIuran.iuran.februari"
								label-tf="Februari"
                @keypress="onlyNumber($event, 15, detailIuran.iuran.februari)"
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
							Maret
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="detailIuran.iuran.maret"
								label-tf="Maret"
                @keypress="onlyNumber($event, 15, detailIuran.iuran.maret)"
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
							April
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="detailIuran.iuran.april"
								label-tf="April"
                @keypress="onlyNumber($event, 15, detailIuran.iuran.april)"
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
							Mei
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="detailIuran.iuran.mei"
								label-tf="Mei"
                @keypress="onlyNumber($event, 15, detailIuran.iuran.mei)"
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
							Juni
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="detailIuran.iuran.juni"
								label-tf="Juni"
                @keypress="onlyNumber($event, 15, detailIuran.iuran.juni)"
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
							Juli
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="detailIuran.iuran.juli"
								label-tf="Juli"
                @keypress="onlyNumber($event, 15, detailIuran.iuran.juli)"
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
							Agustus
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="detailIuran.iuran.agustus"
								label-tf="Agustus"
                @keypress="onlyNumber($event, 15, detailIuran.iuran.agustus)"
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
							September
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="detailIuran.iuran.september"
								label-tf="September"
                @keypress="onlyNumber($event, 15, detailIuran.iuran.september)"
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
							Oktober
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="detailIuran.iuran.oktober"
								label-tf="Oktober"
                @keypress="onlyNumber($event, 15, detailIuran.iuran.oktober)"
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
							November
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="detailIuran.iuran.november"
								label-tf="November"
                @keypress="onlyNumber($event, 15, detailIuran.iuran.november)"
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
							Desember
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="detailIuran.iuran.desember"
								label-tf="Desember"
                @keypress="onlyNumber($event, 15, detailIuran.iuran.desember)"
								:clearable-tf="true"
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
							class="text-end"
							cols="12"
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
  name: 'DataIuran',
  components: {
    PopUpNotifikasi,
  },
  data: () => ({
    dataIuran: [],
    jumlahBulanTemp: 12,
    tahun: new Date(),
    // bulan: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
    bulan: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'],
    conditionValue: [],
    detailIuran: {
      idBiodata: '',
      idIuran: '',
      nik: '',
      namaLengkap: '',
      komisarisWilayah: '',
      iuran: {
        januari: 0,
        februari: 0,
        maret: 0,
        april: 0,
        mei: 0,
        juni: 0,
        juli: 0,
        agustus: 0,
        september: 0,
        oktober: 0,
        november: 0,
        desember: 0
      },
      totalIuran: 0,
    },
    DialogIuran: false,
    headers: [
      { title: "NOMOR INDUK", key: "nik", sortable: false, width: "20%" },
      { title: "NAMA LENGKAP", key: "namaLengkap", sortable: false, width: "20%" },
      { title: "BULAN1", key: "bulan1", sortable: false, width: "60%" },
      { title: "BULAN2", key: "bulan2", sortable: false, width: "60%" },
      { title: "BULAN3", key: "bulan3", sortable: false, width: "60%" },
      { title: "BULAN4", key: "bulan4", sortable: false, width: "60%" },
      { title: "BULAN5", key: "bulan5", sortable: false, width: "60%" },
      { title: "BULAN6", key: "bulan6", sortable: false, width: "60%" },
      { title: "BULAN7", key: "bulan7", sortable: false, width: "60%" },
      { title: "BULAN8", key: "bulan8", sortable: false, width: "60%" },
      { title: "BULAN9", key: "bulan9", sortable: false, width: "60%" },
      { title: "BULAN10", key: "bulan10", sortable: false, width: "60%" },
      { title: "BULAN11", key: "bulan11", sortable: false, width: "60%" },
      { title: "BULAN12", key: "bulan12", sortable: false, width: "60%" },
      { title: "TOTAL", key: "total", sortable: false, width: "60%" },
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
      title: "Data Administrator",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })

    const route = useRoute()
    let komisaris_wilayah = route.params.komisaris_wilayah
    return { komisaris_wilayah }
  },
  computed: {
    ...mapState({
      loadingtable: store => store.user.loadingtable,
    }),
    ...mapGetters({
      iuranAll: 'user/iuranAll', 
    }),
  },
  watch: {
    iuranAll: {
			deep: true,
			async handler(value) {
        this.conditional();
        let dataiuran = []
        let totaliuran = 0
        await value.map(str => {
          dataiuran.push(str.iuran)
          totaliuran += Number(str.totalIuran)
        })
        const countObj = dataiuran.reduce((acc, curr) => {
          return {
            januari: acc.januari + curr.januari,
            februari: acc.februari + curr.februari,
            maret: acc.maret + curr.maret,
            april: acc.april + curr.april,
            mei: acc.mei + curr.mei,
            juni: acc.juni + curr.juni,
            juli: acc.juli + curr.juli,
            agustus: acc.agustus + curr.agustus,
            september: acc.september + curr.september,
            oktober: acc.oktober + curr.oktober,
            november: acc.november + curr.november,
            desember: acc.desember + curr.desember,
          };
        }, {
          januari: 0,
          februari: 0,
          maret: 0,
          april: 0,
          mei: 0,
          juni: 0,
          juli: 0,
          agustus: 0,
          september: 0,
          oktober: 0,
          november: 0,
          desember: 0
        });
        
        this.dataIuran = value.length ? [...value, {
          idBiodata: '',
          idIuran: '',
          nik: '',
          namaLengkap: '',
          komisarisWilayah: '',
          iuran: countObj,
          totalIuran: totaliuran,
        }] : []
      }
    },
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    this.getIuran({ komisaris_wilayah: this.komisaris_wilayah, tahun: this.tahun.getFullYear() })
	},
	methods: {
    ...mapActions({
      fetchData: 'fetchData',
      getIuran: "user/getIuran", 
    }),
    conditional(){
      this.conditionValue = []
      let bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
      for (let index = 0; index < Number(this.jumlahBulanTemp); index++) {
        this.conditionValue.push({
          name: bulan[index].toLowerCase(),
        })
      }
    },
    openDialog(item){
      this.detailIuran = {
        idBiodata: item.idBiodata,
        idIuran: item.idIuran,
        nik: item.nik,
        namaLengkap: item.namaLengkap,
        komisarisWilayah: item.komisarisWilayah,
        iuran: {
          januari: item.iuran.januari,
          februari: item.iuran.februari,
          maret: item.iuran.maret,
          april: item.iuran.april,
          mei: item.iuran.mei,
          juni: item.iuran.juni,
          juli: item.iuran.juli,
          agustus: item.iuran.agustus,
          september: item.iuran.september,
          oktober: item.iuran.oktober,
          november: item.iuran.november,
          desember: item.iuran.desember
        },
        totalIuran: item.totalIuran,
      }
      this.DialogIuran = true
    },
    postRecord(){
      let bodyData = {
        idIuran: this.detailIuran.idIuran,
        idBiodata: this.detailIuran.idBiodata,
        tahun: String(this.tahun.getFullYear()),
        iuran: {
          tahun: String(this.tahun.getFullYear()),
          iuran: {
            januari: Number(this.detailIuran.iuran.januari),
            februari: Number(this.detailIuran.iuran.februari),
            maret: Number(this.detailIuran.iuran.maret),
            april: Number(this.detailIuran.iuran.april),
            mei: Number(this.detailIuran.iuran.mei),
            juni: Number(this.detailIuran.iuran.juni),
            juli: Number(this.detailIuran.iuran.juli),
            agustus: Number(this.detailIuran.iuran.agustus),
            september: Number(this.detailIuran.iuran.september),
            oktober: Number(this.detailIuran.iuran.oktober),
            november: Number(this.detailIuran.iuran.november),
            desember: Number(this.detailIuran.iuran.desember)
          }
        }
      }
      // return console.log(bodyData);
      this.$store.dispatch('user/postIuran', bodyData)
      .then((res) => {
        this.closeDialog()
        this.getIuran({ komisaris_wilayah: this.komisaris_wilayah, tahun: this.tahun.getFullYear() })
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    closeDialog(){
      this.detailIuran = {
        idBiodata: '',
        idIuran: '',
        nik: '',
        namaLengkap: '',
        komisarisWilayah: '',
        iuran: {
          januari: 0,
          februari: 0,
          maret: 0,
          april: 0,
          mei: 0,
          juni: 0,
          juli: 0,
          agustus: 0,
          september: 0,
          oktober: 0,
          november: 0,
          desember: 0
        },
        totalIuran: 0,
      }
      this.DialogIuran = false
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