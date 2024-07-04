<template>
  <div>
    <h1 class="subheading grey--text text-decoration-underline">Data Komisaris Wilayah</h1>
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
      <v-data-table
        loading-text="Sedang memuat... Harap tunggu"
        no-data-text="Tidak ada data yang tersedia"
        no-results-text="Tidak ada catatan yang cocok ditemukan"
        :headers="headers"
        :loading="loadingtable"
        :items="DataKomisarisWilayah"
        expand-on-click
        item-value="idKomisaris"
        :sort-by="sortBy"
        density="comfortable"
        hide-default-footer
        hide-default-header
        multi-sort
        class="elavation-3 rounded"
        sort-asc-icon="mdi mdi-sort-alphabetical-ascending"
        sort-desc-icon="mdi mdi-sort-alphabetical-descending"
        :items-per-page="itemsPerPage"
        @page-count="pageCount = $event"
        @click:row="clickrow"
        v-model:expanded="expanded"
        @update:sort-by="updateSort($event)"
      >
        <!-- header -->
        <template #headers="{ columns, isSorted, getSortIcon, toggleSort }">
          <tr>
            <td v-for="header in columns" :key="header.title" class="tableHeader">
              <span v-if="header.sortable" class="mr-2" style="cursor: pointer; width: 100%;" @click="() => toggleSort(header)">{{ header.title.toUpperCase() }}</span>
              <span v-else>{{ header.title.toUpperCase() }}</span>
              <v-icon v-if="isSorted(header)" :icon="getSortIcon(header)"></v-icon>
            </td>
          </tr>
        </template>
        <template #loader>
          <LoaderDataTables />
        </template>
        <template #[`item.number`]="{ item }">
          {{ page > 1 ? ((page - 1)*limit) + item.index + 1 : item.index + 1 }}
        </template>
        <template #[`item.wilayah`]="{ item }">
          <span>{{ `${item.raw.namaWilayah} (${item.raw.kodeWilayah})` }}</span>
        </template>
        <template #[`item.statusKomisaris`]="{ item }">
          <v-icon size="small" v-if="item.raw.statusKomisaris" color="green" icon="mdi mdi-check" />
          <v-icon size="small" v-else color="red" icon="mdi mdi-close" />
        </template>
        <template #expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length">
              <Button 
                color-button="#0bd369"
                icon-prepend-button="mdi mdi-pencil"
                nama-button="Ubah"
                size-button="x-small"
                :disabled-button="!item.raw.statusKomisaris"
                @proses="openDialog(item.raw, 1)"
              />
              <Button
                color-button="#0bd369"
                :icon-prepend-button="item.raw.statusKomisaris ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"
                :nama-button="item.raw.statusKomisaris ? 'Non Active' : 'Active'"
                size-button="x-small"
                @proses="postRecord('STATUSRECORD', item.raw, !item.raw.statusKomisaris)"
              />
              <Button 
                color-button="#bd3a07"
                icon-prepend-button="mdi mdi-delete"
                size-button="x-small"
                :disabled-button="!item.raw.statusKomisaris"
                nama-button="Hapus"
                @click="postRecord('DELETE', item.raw, null)"
              />
            </td>
          </tr>
        </template>
        <template #top>
          <v-row no-gutters class="pa-2">
            <v-col cols="12" md="6" class="d-flex align-center">
              <Button 
                color-button="light-blue darken-3"
                icon-prepend-button="mdi mdi-plus-thick"
                nama-button="Tambah"
                size-button="x-small"
                @proses="openDialog(null, 0)"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-row no-gutters>
                <v-col cols="12" md="9" class="pr-2">
                  <TextField
                    v-model="searchData"
                    icon-prepend-tf="mdi mdi-magnify"
                    label-tf="Pencarian..."
                    :clearable-tf="true"
                    @click:clear="() => {
                      page = 1
                      getKomisarisWilayah({page: 1, limit: limit, keyword: ''})
                    }"
                    @keyup.enter="() => {
                      page = 1
                      getKomisarisWilayah({page: 1, limit: limit, keyword: searchData})
                    }"
                  />
                </v-col>
                <v-col cols="12" md="3" class="d-flex justify-end align-center">
                  <Autocomplete
                    v-model="page"
                    :data-a="pageOptions"
                    label-a="Page"
                    :disabled-a="DataKomisarisWilayah.length ? false : true"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-divider :thickness="2" class="border-opacity-100" color="white" />
        </template>
        <template #bottom>
          <v-divider :thickness="2" class="border-opacity-100" color="white" />
          <v-row no-gutters>
            <v-col cols="12" lg="10" class="pa-2 d-flex justify-start align-center">
              <span>Halaman <strong>{{ pageSummary.page ? pageSummary.page : 0 }}</strong> dari Total Halaman <strong>{{ pageSummary.totalPages ? pageSummary.totalPages : 0 }}</strong> (Records {{ pageSummary.total ? pageSummary.total : 0 }})</span>
            </v-col>
            <v-col cols="12" lg="2" class="pa-2 text-right">
              <div class="d-flex justify-start align-center">
                <Autocomplete
                  v-model="limit"
                  pilihan-a="select"
                  :data-a="limitPage"
                  label-a="Limit"
                  :disabled-a="DataKomisarisWilayah.length ? false : true"
                />
                <Button
                  variant="plain"
                  size-button="large"
                  model-button="comfortable"
                  color-button="#ffffff"
                  icon-button="mdi mdi-arrow-left-circle-outline"
                  :disabled-button="DataKomisarisWilayah.length ? pageSummary.page != 1 ? false : true : true"
                  @proses="() => { page = pageSummary.page - 1 }"
                />
                <Button
                  variant="plain"
                  size-button="large"
                  model-button="comfortable"
                  color-button="#ffffff"
                  icon-button="mdi mdi-arrow-right-circle-outline"
                  :disabled-button="DataKomisarisWilayah.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
                  @proses="() => { page = pageSummary.page + 1 }"
                />
              </div>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="DialogKomisarisWilayah"
      scrollable
      persistent
      transition="dialog-bottom-transition"
      width="auto"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>{{editedIndex == 0 ? 'Tambah' : editedIndex == 1 ? 'Ubah' : 'View'}} Data Komisaris Wilayah</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { clearData(); DialogKomisarisWilayah = false; }"
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
              <Autocomplete
                v-model="inputDataKomisarisWilayah.kode_wilayah"
                :data-a="wilayahpanjaitanOptions"
                item-title="label"
                item-value="kode"
                label-a="Wilayah"
                :disabled-a="editedIndex == 0 ? false : true"
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
              Nama Komisaris Wilayah
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <TextField
                v-model="inputDataKomisarisWilayah.nama_komisaris"
                label-tf="Nama Komisaris Wilayah"
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
              Daerah
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <TextArea
                v-model="inputDataKomisarisWilayah.daerah"
                label-ta="Daerah"
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
                v-if="editedIndex == 0"
                color-button="black"
                nama-button="Simpan Data"
                :disabled-button="kondisiTombol"
                @proses="postRecord('ADD', null, null)"
              />
              <Button 
                v-if="editedIndex == 1"
                color-button="black"
                nama-button="Ubah Data"
                :disabled-button="kondisiTombol"
                @proses="postRecord('EDIT', null, null)"
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
import PopUpNotifikasi from "../../Layout/PopUpNotifikasi.vue";
export default {
  name: 'DataKomisaris Wilayah',
  components: {
    PopUpNotifikasi
  },
  data: () => ({
		expanded: [],
		DataKomisarisWilayah: [],
		searchData: '',
    page: 1,
    pageCount: 0,
    itemsPerPage: 100,
    limit: 10,
		limitPage: [5,10,20,50,100],
    pageOptions: [],
		pageSummary: {
			page: '',
			limit: '',
			total: '',
			totalPages: ''
		},
    sortBy: [],
		kumpulSort: '',
		headers: [
      { title: "NO", key: "number", sortable: false, width: "3%" },
      { title: "#", key: "data-table-expand", sortable: false, width: "3%" },
      { title: "KODE KOMISARIS", key: "kodeKomisarisWilayah", sortable: true, width: "15%" },
      { title: "WILAYAH", key: "wilayah", sortable: true, width: "25%" },
      { title: "NAMA KOMISARIS", key: "namaKomisaris", sortable: true, width: "25%" },
      { title: "DAERAH", key: "daerah", sortable: true, width: "25%" },
      { title: "STATUS", key: "statusKomisaris", sortable: true, width: "3%" },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
    roleID: '',
    idLog: '',
    inputDataKomisarisWilayah: {
      id_komisaris: '',
      kode_wilayah: null,
      nama_komisaris: '',
      daerah: '',
    },
    editedIndex: 0,
    kondisiTombol: true,
    DialogKomisarisWilayah: false,

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Data Komisaris Wilayah",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
  },
  computed: {
    ...mapState({
      loadingtable: store => store.setting.loadingtable,
			wilayahpanjaitanOptions: store => store.setting.wilayahpanjaitanOptions,
    }),
    ...mapGetters({
      komisariswilayahAll: 'setting/komisariswilayahAll',
    }),
  },
  watch: {
    komisariswilayahAll: {
      deep: true,
      handler(value){
        this.pageOptions = []
        this.DataKomisarisWilayah = value.records
				this.pageSummary = {
					page: this.DataKomisarisWilayah.length ? value.pageSummary.page : 0,
					limit: this.DataKomisarisWilayah.length ? value.pageSummary.limit : 0,
					total: this.DataKomisarisWilayah.length ? value.pageSummary.total : 0,
					totalPages: this.DataKomisarisWilayah.length ? value.pageSummary.totalPages : 0
				}
        for (let index = 1; index <= this.pageSummary.totalPages; index++) {
          this.pageOptions.push(index)
        }
      }
    },
    inputDataKomisarisWilayah: {
      deep: true,
      handler(value){
        if(value.kode_wilayah != null && value.nama_komisaris != ''){
          this.kondisiTombol = false
        }else{
          this.kondisiTombol = true
        }
      }
    },
    page: {
			deep: true,
			handler(value) {
        if(value){
          this.getKomisarisWilayah({page: value, limit: this.limit, keyword: this.searchData, sorting: this.kumpulSort})
        }
			}
		},
    limit: {
			deep: true,
			handler(value) {
        this.page = 1
				this.getKomisarisWilayah({page: 1, limit: value, keyword: this.searchData, sorting: this.kumpulSort})
			}
		},
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    this.roleID = localStorage.getItem('roleID')
    this.idLog = localStorage.getItem('idLogin')
		this.getKomisarisWilayah({page: this.page, limit: this.limit, keyword: this.searchData, sorting: this.kumpulSort});
	},
	methods: {
		...mapActions({
      getKomisarisWilayah: 'setting/getKomisaris',
			getWilayahPanjaitan: 'setting/getWilayahPanjaitan',
    }),
    postRecord(jenis, item, status) {
      let bodyData = {
        ADDEDIT: {
          jenis: jenis,
          id_komisaris: jenis === 'ADD' ? '' : this.inputDataKomisarisWilayah.id_komisaris,
          kode_wilayah: this.inputDataKomisarisWilayah.kode_wilayah,
          nama_komisaris: this.inputDataKomisarisWilayah.nama_komisaris,
          daerah: this.inputDataKomisarisWilayah.daerah,
        },
        DELETESTATUS: {
          jenis: jenis,
          id_komisaris: item.idKomisaris ? item.idKomisaris : null,
          status,
        },
      }
      this.$store.dispatch('setting/postKomisaris', jenis === 'ADD' || jenis === 'EDIT' ? bodyData.ADDEDIT : bodyData.DELETESTATUS)
      .then((res) => {
        this.DialogKomisarisWilayah = false
        this.getKomisarisWilayah({page: this.page, limit: this.limit, keyword: this.searchData, sorting: this.kumpulSort})
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    openDialog(item, index){
      this.editedIndex = index
      this.getWilayahPanjaitan();
      if(index == 0){
        this.clearData()
      }else{
        this.inputDataKomisarisWilayah = {
          id_komisaris: item.idKomisaris,
          kode_wilayah: item.kodeWilayah,
          nama_komisaris: item.namaKomisaris,
          daerah: item.daerah,
        }
      }
      this.DialogKomisarisWilayah = true
    },
    clearData(){
      this.inputDataKomisarisWilayah = {
        id_komisaris: '',
        kode_wilayah: null,
        daerah: '',
      }
    },
    updateSort(data) {
      this.sortBy = data
			this.kumpulSort = this.sortBy.map((val) => {
        return `${val.key}-${val.order === 'asc' ? 'ASC' : 'DESC'}`
      }).join(',')
  		this.getKomisarisWilayah({page: this.page, limit: this.limit, keyword: this.searchData, sorting: this.kumpulSort});
		},
    clickrow(event, data) {
      const index = this.$data.expanded.find(i => i === data?.item?.raw?.idKomisaris);
      if(typeof index === 'undefined') return this.$data.expanded = [];
      this.$data.expanded.splice(0, 1)
      this.$data.expanded.push(data?.item?.raw?.idKomisaris);
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