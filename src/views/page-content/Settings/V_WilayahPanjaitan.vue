<template>
  <div>
    <h1 class="subheading grey--text text-decoration-underline">Data Wilayah Panjaitan</h1>
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
      <v-data-table
        loading-text="Sedang memuat... Harap tunggu"
        no-data-text="Tidak ada data yang tersedia"
        no-results-text="Tidak ada catatan yang cocok ditemukan"
        :headers="headers"
        :loading="loadingtable"
        :items="DataWilayahPanjaitan"
        expand-on-click
        item-value="kode"
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
        <template #[`item.statusWilayah`]="{ item }">
          <v-icon size="small" v-if="item.raw.statusWilayah" color="green" icon="mdi mdi-check" />
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
                :disabled-button="!item.raw.statusWilayah"
                @proses="openDialog(item.raw, 1)"
              />
              <Button
                color-button="#0bd369"
                :icon-prepend-button="item.raw.statusWilayah ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"
                :nama-button="item.raw.statusWilayah ? 'Non Active' : 'Active'"
                size-button="x-small"
                @proses="postRecord('STATUSRECORD', item.raw, !item.raw.statusWilayah)"
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
                      getWilayahPanjaitans({page: 1, limit: limit, keyword: ''})
                    }"
                    @keyup.enter="() => {
                      page = 1
                      getWilayahPanjaitans({page: 1, limit: limit, keyword: searchData})
                    }"
                  />
                </v-col>
                <v-col cols="12" md="3" class="d-flex justify-end align-center">
                  <Autocomplete
                    v-model="page"
                    :data-a="pageOptions"
                    label-a="Page"
                    :disabled-a="DataWilayahPanjaitan.length ? false : true"
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
                  :disabled-a="DataWilayahPanjaitan.length ? false : true"
                />
                <Button
                  variant="plain"
                  size-button="large"
                  model-button="comfortable"
                  color-button="#ffffff"
                  icon-button="mdi mdi-arrow-left-circle-outline"
                  :disabled-button="DataWilayahPanjaitan.length ? pageSummary.page != 1 ? false : true : true"
                  @proses="() => { page = pageSummary.page - 1 }"
                />
                <Button
                  variant="plain"
                  size-button="large"
                  model-button="comfortable"
                  color-button="#ffffff"
                  icon-button="mdi mdi-arrow-right-circle-outline"
                  :disabled-button="DataWilayahPanjaitan.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
                  @proses="() => { page = pageSummary.page + 1 }"
                />
              </div>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="DialogWilayahPanjaitan"
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
              @proses="() => { clearData(); DialogWilayahPanjaitan = false; }"
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
              <TextField
                v-model="inputDataWilayahPanjaitan.label"
                label-tf="Wilayah"
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
              Nama Ketua Wilayah Panjaitan
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <TextField
                v-model="inputDataWilayahPanjaitan.nama_ketua_wilayah"
                label-tf="Nama Ketua Wilayah Panjaitan"
                :clearable-tf="true"
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
		DataWilayahPanjaitan: [],
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
      { title: "KODE", key: "kode", sortable: false, width: "15%" },
      { title: "WILAYAH", key: "label", sortable: true, width: "25%" },
      { title: "NAMA KETUA WILAYAH", key: "namaKetuaWilayah", sortable: true, width: "25%" },
      { title: "STATUS", key: "statusWilayah", sortable: true, width: "3%" },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
    roleID: '',
    idLog: '',
    inputDataWilayahPanjaitan: {
      id: '',
      kode: '',
      label: '',
      nama_ketua_wilayah: '',
    },
    editedIndex: 0,
    kondisiTombol: true,
    DialogWilayahPanjaitan: false,

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
    }),
    ...mapGetters({
      wilayahpanjaitanAll: 'setting/wilayahpanjaitanAll',
    }),
  },
  watch: {
    wilayahpanjaitanAll: {
      deep: true,
      handler(value){
        this.pageOptions = []
        this.DataWilayahPanjaitan = value.records
				this.pageSummary = {
					page: this.DataWilayahPanjaitan.length ? value.pageSummary.page : 0,
					limit: this.DataWilayahPanjaitan.length ? value.pageSummary.limit : 0,
					total: this.DataWilayahPanjaitan.length ? value.pageSummary.total : 0,
					totalPages: this.DataWilayahPanjaitan.length ? value.pageSummary.totalPages : 0
				}
        for (let index = 1; index <= this.pageSummary.totalPages; index++) {
          this.pageOptions.push(index)
        }
      }
    },
    inputDataWilayahPanjaitan: {
      deep: true,
      handler(value){
        if(value.label != '' && value.nama_ketua_wilayah != ''){
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
          this.getWilayahPanjaitans({page: value, limit: this.limit, keyword: this.searchData, sorting: this.kumpulSort})
        }
			}
		},
    limit: {
			deep: true,
			handler(value) {
        this.page = 1
				this.getWilayahPanjaitans({page: 1, limit: value, keyword: this.searchData, sorting: this.kumpulSort})
			}
		},
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    this.roleID = localStorage.getItem('roleID')
    this.idLog = localStorage.getItem('idLogin')
		this.getWilayahPanjaitans({page: this.page, limit: this.limit, keyword: this.searchData, sorting: this.kumpulSort});
	},
	methods: {
		...mapActions({
			getWilayahPanjaitans: 'setting/getWilayahPanjaitans',
    }),
    postRecord(jenis, item, status) {
      let bodyData = {
        ADDEDIT: {
          jenis: jenis,
          id: jenis === 'ADD' ? '' : this.inputDataWilayahPanjaitan.id,
          label: this.inputDataWilayahPanjaitan.label,
          nama_ketua_wilayah: this.inputDataWilayahPanjaitan.nama_ketua_wilayah,
        },
        DELETESTATUS: {
          jenis: jenis,
          id: item ? item.id : '',
          status,
        },
      }
      this.$store.dispatch('setting/postWilayahPanjaitans', jenis === 'ADD' || jenis === 'EDIT' ? bodyData.ADDEDIT : bodyData.DELETESTATUS)
      .then((res) => {
        this.DialogWilayahPanjaitan = false
        this.getWilayahPanjaitans({page: this.page, limit: this.limit, keyword: this.searchData, sorting: this.kumpulSort})
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    openDialog(item, index){
      this.editedIndex = index
      if(index == 0){
        this.clearData()
      }else{
        this.inputDataWilayahPanjaitan = {
          id: item.id,
          kode: item.kode,
          label: item.label,
          nama_ketua_wilayah: item.namaKetuaWilayah,
        }
      }
      this.DialogWilayahPanjaitan = true
    },
    clearData(){
      this.inputDataWilayahPanjaitan = {
        id: '',
        kode: '',
        label: '',
        nama_ketua_wilayah: '',
      }
    },
    updateSort(data) {
      this.sortBy = data
			this.kumpulSort = this.sortBy.map((val) => {
        return `${val.key}-${val.order === 'asc' ? 'ASC' : 'DESC'}`
      }).join(',')
  		this.getWilayahPanjaitans({page: this.page, limit: this.limit, keyword: this.searchData, sorting: this.kumpulSort});
		},
    clickrow(event, data) {
      const index = this.$data.expanded.find(i => i === data?.item?.raw?.kode);
      if(typeof index === 'undefined') return this.$data.expanded = [];
      this.$data.expanded.splice(0, 1)
      this.$data.expanded.push(data?.item?.raw?.kode);
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