<template>
  <div>
    <h1 class="subheading grey--text text-decoration-underline">DAFTAR NAMASA HABOT NI ROHA DOHOT PARHOBAS</h1>
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
      <v-data-table
        loading-text="Sedang memuat... Harap tunggu"
        no-data-text="Tidak ada data yang tersedia"
        no-results-text="Tidak ada catatan yang cocok ditemukan"
        :headers="headers"
        :loading="loadingtable"
        :items="RekapMeninggal"
        expand-on-click
        item-value="idRekap"
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
        <template #[`item.tanggal`]="{ item }">
          <span>{{ `${convertDateForDay(item.raw.tanggal)}, ${convertDateForMonth(item.raw.tanggal)}` }}</span>
        </template>
        <template #[`item.wilayah`]="{ item }">
          <span>{{ `${item.raw.WilayahPanjaitan.label} (${item.raw.WilayahPanjaitan.kode})` }}</span>
        </template>
        <template #expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length">
              <Button 
                color-button="#0bd369"
                icon-prepend-button="mdi mdi-pencil"
                nama-button="Ubah"
                size-button="x-small"
                @proses="openDialog(item.raw, 1)"
              />
              <Button 
                color-button="#bd3a07"
                icon-prepend-button="mdi mdi-delete"
                nama-button="Hapus"
                size-button="x-small"
                @proses="postRecord(item.raw, 'DELETE')"
              />
            </td>
          </tr>
          <tr>
            <td :colspan="columns.length">
              <v-card color="background-dialog-card" class="mt-2 mb-2">
                <v-card-text>
                  <v-row no-gutters>
                    <v-col
                      cols="12"
                      md="5"
                      class="pt-2 d-flex align-center font-weight-bold text-caption"
                    >
                    Hari, Tanggal
                    </v-col>
                    <v-col
                      cols="12"
                      md="7"
                      class="pt-2"
                    >
                      : {{ `${convertDateForDay(item.raw.tanggal)}, ${convertDateForMonth(item.raw.tanggal)}` }}
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col
                      cols="12"
                      md="5"
                      class="pt-2 d-flex align-center font-weight-bold text-caption"
                    >
                    Wilayah
                    </v-col>
                    <v-col
                      cols="12"
                      md="7"
                      class="pt-2"
                    >
                      : {{ `${item.raw.WilayahPanjaitan.label} (${item.raw.WilayahPanjaitan.kode})` }}
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col
                      cols="12"
                      md="5"
                      class="pt-2 d-flex align-center font-weight-bold text-caption"
                    >
                      Namonding
                    </v-col>
                    <v-col
                      cols="12"
                      md="7"
                      class="pt-2"
                    >
                      : {{ item.raw.kategori }}
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col
                      cols="12"
                      md="5"
                      class="pt-2 d-flex align-center font-weight-bold text-caption"
                    >
                      Goar Ni Namonding
                    </v-col>
                    <v-col
                      cols="12"
                      md="7"
                      class="pt-2"
                    >
                      : {{ item.raw.nama }}
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col
                      cols="12"
                      md="5"
                      class="pt-2 d-flex align-center font-weight-bold text-caption"
                    >
                    Hasuhuton / Namanghabaluhon
                    </v-col>
                    <v-col
                      cols="12"
                      md="7"
                      class="pt-2"
                    >
                      : {{ item.raw.yangDitinggal }}
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col
                      cols="12"
                      md="5"
                      class="pt-2 d-flex align-center font-weight-bold text-caption"
                    >
                    Inganan
                    </v-col>
                    <v-col
                      cols="12"
                      md="7"
                      class="pt-2"
                    >
                      : {{ item.raw.rumahDuka }}
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col
                      cols="12"
                      md="5"
                      class="pt-2 d-flex align-center font-weight-bold text-caption"
                    >
                    Tonggo Raja/Pasada Tahi/Adat Partuatna
                    </v-col>
                    <v-col
                      cols="12"
                      md="7"
                      class="pt-2"
                    >
                      : {{ item.raw.acaraAdat }}
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col
                      cols="12"
                      md="5"
                      class="pt-2 d-flex align-center font-weight-bold text-caption"
                    >
                    Penanggung Jawab
                    </v-col>
                    <v-col
                      cols="12"
                      md="7"
                      class="pt-2"
                    >
                      : {{ item.raw.penanggungJawab }}
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col
                      cols="12"
                      md="5"
                      class="pt-2 d-flex align-center font-weight-bold text-caption"
                    >
                    Raja Arhata / Parsinabul / Namanguluhon
                    </v-col>
                    <v-col
                      cols="12"
                      md="7"
                      class="pt-2"
                    >
                      : {{ item.raw.yangMemberiSumbangan }}
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col
                      cols="12"
                      md="5"
                      class="pt-2 d-flex align-center font-weight-bold text-caption"
                    >
                    Keterangan
                    </v-col>
                    <v-col
                      cols="12"
                      md="7"
                      class="pt-2"
                    >
                      : {{ item.raw.keterangan }}
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </td>
          </tr>
        </template>
        <template #top>
          <v-row no-gutters class="pa-2">
            <v-col cols="12" md="4" class="d-flex align-center">
              <Button 
                color-button="light-blue darken-3"
                icon-prepend-button="mdi mdi-plus-thick"
                nama-button="Tambah"
                size-button="x-small"
                @proses="openDialog(null, 0)"
              />
              <Button 
                color-button="#0bd369"
                icon-prepend-button="mdi mdi-import"
                nama-button="Import"
                size-button="x-small"
                @proses="() => { dialogImport = true }"
              />
              <v-menu
                open-on-click
                rounded="t-xs b-lg"
                offset-y
                transition="slide-y-transition"
                bottom
              >
                <template v-slot:activator="{ props }">
                  <Button 
                    v-bind="props"
                    color-button="#0bd369"
                    icon-prepend-button="mdi mdi-export"
                    icon-append-button="mdi mdi-menu-down"
                    nama-button="Export"
                    size-button="x-small"
                  />
                </template>

                <v-list
                  :lines="false"
                  density="comfortable"
                  nav
                  dense
                  class="listData"
                >
                  <v-list-item
                    @click="exportExcel('full', !tanggal.length ? 'full' : 'byfilter')"
                    color="nav-back"
                    class="SelectedMenu"
                    title="Export Data Excel All"
                  >
                    <template v-slot:append>
                      <v-icon size="middle" icon="mdi mdi-file-excel" color="icon-white" />
                    </template>
                    <template v-slot:title>
                      <span class="menufont">Export Data Excel All</span>
                    </template>
                  </v-list-item>
                  <v-list-item
                    @click="exportExcel('by', null)"
                    color="nav-back"
                    class="SelectedMenu"
                    title="Export Data Excel By Range Tanggal"
                    :disabled="!tanggal.length"
                  >
                    <template v-slot:append>
                      <v-icon size="middle" icon="mdi mdi-file-excel" color="icon-white" />
                    </template>
                    <template v-slot:title>
                      <span class="menufont">Export Data Excel By Range Tanggal</span>
                    </template>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
            <v-col cols="12" md="8">
              <v-row no-gutters>
                <v-col cols="12" md="4" class="pr-2">
                  <TextField
                    v-model="searchData"
                    icon-prepend-tf="mdi mdi-magnify"
                    label-tf="Pencarian..."
                    :clearable-tf="true"
                    @click:clear="() => {
                      page = 1
                      getRekapMeninggal({page: 1, limit: limit, keyword: '', tanggal: tanggal})
                    }"
                    @keyup.enter="() => {
                      page = 1
                      getRekapMeninggal({page: 1, limit: limit, keyword: searchData, tanggal: tanggal})
                    }"
                  />
                </v-col>
                <v-col cols="12" md="5" class="pr-2">
                  <vue-date-picker
                    v-model="tanggal"
                    placeholder="StartDate - EndDate"
                    format="dd-MM-yyyy"
                    :enable-time-picker="false"
                    :auto-position="false"
                    position="left"
                    range
                    :multi-calendars="{ solo: true }"
                    :month-change-on-scroll="false"
                    auto-apply
                  />
                </v-col>
                <v-col cols="12" md="3" class="d-flex justify-end align-center">
                  <Autocomplete
                    v-model="page"
                    :data-a="pageOptions"
                    label-a="Page"
                    :disabled-a="RekapMeninggal.length ? false : true"
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
                  :disabled-a="RekapMeninggal.length ? false : true"
                />
                <Button
                  variant="plain"
                  size-button="large"
                  model-button="comfortable"
                  color-button="#ffffff"
                  icon-button="mdi mdi-arrow-left-circle-outline"
                  :disabled-button="RekapMeninggal.length ? pageSummary.page != 1 ? false : true : true"
                  @proses="() => { page = pageSummary.page - 1 }"
                />
                <Button
                  variant="plain"
                  size-button="large"
                  model-button="comfortable"
                  color-button="#ffffff"
                  icon-button="mdi mdi-arrow-right-circle-outline"
                  :disabled-button="RekapMeninggal.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
                  @proses="() => { page = pageSummary.page + 1 }"
                />
              </div>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="dialogImport"
      scrollable
			persistent
      transition="dialog-bottom-transition"
      width="800px"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Import Data Rekap Meninggal</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { dialogImport = false; }"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pt-4">
          <v-card class="pa-2 d-flex justify-center align-center" elevation="1" outlined>
            <div class="kotak" @click="$refs.inputExcel.click()">
              <v-icon size="large" icon="mdi mdi-file-excel" color="black" />
              <div style="font-weight: bold;">Upload File</div>
            </div>
            <input 
              ref="inputExcel"
              :key="componentKey"
              type="file"
              accept=".xlsx,.xls"
              style="display: none"
              @change="importExcel($event)"
            >
          </v-card>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-row 
            no-gutters
            class="mr-3"
          >
            <v-col
              class="text-start"
              cols="12"
            >
              <Button
                color-button="light-blue darken-3"
                icon-prepend-button="mdi mdi-download"
                nama-button="Download Template"
                @proses="downloadTemplate()"
              />
            </v-col>
          </v-row>         
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay v-model="isLoadingDownload" persistent class="align-center justify-center">
      <div style="width: 550px;">
        <v-progress-linear
          class="pa-3"
          indeterminate
          color="black darken-3"
        />
        <h4 style="color: #FFF; text-align: center; background-color: #272727;">Sedang proses download template, harap menunggu ...</h4>
      </div>
    </v-overlay>
    <v-overlay v-model="isLoadingImport" persistent class="align-center justify-center">
      <div style="width: 550px;">
        <v-progress-linear
          v-model="progress"
          color="#c12626"
          height="25"
          striped
          :active="show"
          :indeterminate="query"
          :query="true"
        >
          <template v-slot:default="{ value }">
            <strong style="color: #FFF; text-align: center;">{{ Math.ceil(value) }}%</strong>
          </template>
        </v-progress-linear>
        <h4 style="color: #FFF; text-align: center; background-color: #272727;">Sedang proses import data, harap menunggu ...</h4>
      </div>
    </v-overlay>
    <v-overlay v-model="isLoadingExport" persistent class="align-center justify-center">
      <div style="width: 550px;">
        <v-progress-linear
          class="pa-3"
          indeterminate
          color="black darken-3"
        />
        <h4 style="color: #FFF; text-align: center; background-color: #272727;">Sedang proses export data, harap menunggu ...</h4>
      </div>
    </v-overlay>
    <v-dialog
      v-model="DialogAdministrator"
      scrollable
      persistent
      transition="dialog-bottom-transition"
      width="auto"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>{{editedIndex == 0 ? 'Tambah' : 'Ubah'}} Rekap Meninggal</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { clearData(); DialogAdministrator = false; }"
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
              Wilayah *
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <Autocomplete
                v-model="inputData.wilayah"
                :data-a="wilayahpanjaitanOptions"
                item-title="label"
                item-value="kode"
                label-a="Wilayah"
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
							Tanggal *
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
              <vue-date-picker
                v-model="inputData.tanggal"
                placeholder="Tanggal"
                format="dd-MM-yyyy"
                :enable-time-picker="false"
                :auto-position="false"
                position="left"
                :month-change-on-scroll="false"
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
              Namonding *
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="inputData.kategori"
								label-tf="Namonding"
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
              Goar Ni Namonding *
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
              <TextArea
                v-model="inputData.nama"
                label-ta="Goar Ni Namonding"
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
							Hasuhuton / Namanghabaluhon *
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="inputData.yangDitinggal"
								label-tf="Hasuhuton / Namanghabaluhon"
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
            Inganan *
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
              <TextArea
                v-model="inputData.rumahDuka"
                label-ta="Inganan"
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
							Tonggo Raja / Pasada Tahi / Adat Partuatna *
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
              <TextArea
                v-model="inputData.acaraAdat"
                label-ta="Tonggo Raja / Pasada Tahi / Adat Partuatna"
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
							Penanggung Jawab *
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="inputData.penanggungJawab"
								label-tf="Penanggung Jawab"
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
							Raja Arhata / Parsinabul / Namanguluhon *
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="inputData.yangMemberiSumbangan"
								label-tf="Raja Arhata / Parsinabul / Namanguluhon"
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
							Keterangan *
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
              <TextArea
                v-model="inputData.keterangan"
                label-ta="Keterangan"
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
						class="mt-1 mr-3"
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
								@proses="postRecord(null, 'ADD')"
							/>
							<Button 
								v-if="editedIndex == 1"
								color-button="black"
								nama-button="Ubah Data"
								:disabled-button="kondisiTombol"
								@proses="postRecord(null, 'EDIT')"
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
  name: 'RekapMeninggal',
  components: {
    PopUpNotifikasi,
  },
  data: () => ({
		expanded: [],
		RekapMeninggal: [],
		searchData: '',
		tanggal: [],
    page: 1,
    pageCount: 0,
    itemsPerPage: 100,
    limit: 20,
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
      { title: "NO", key: "number", sortable: false, width: "5%" },
      { title: "#", key: "data-table-expand", sortable: false, width: "5%" },
      { title: "HARI / TANGGAL", key: "tanggal", sortable: true },
      { title: "WILAYAH", key: "wilayah", sortable: true },
      { title: "NAMONDING", key: "kategori", sortable: true },
      { title: "GOAR NI NAMONDING", key: "nama", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
    roleID: '',
    inputData: {
      idRekap: '',
      wilayah: null,
      tanggal: '',
      kategori: '',
      nama: '',
      yangDitinggal: '',
      rumahDuka: '',
      acaraAdat: '',
      penanggungJawab: '',
      yangMemberiSumbangan: '',
      keterangan: '',
    },
    DialogAdministrator: false,
    editedIndex: 0,
		kondisiTombol: true,
    dialogImport: false,
    isLoadingExport: false,
    isLoadingDownload: false,
    isLoadingImport: false,
    progress: 0,
    query: false,
    show: true,
    interval: 0,
    componentKey: 0,
    BASEURL: '',
    dataJumlahImport: 0,

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Rekap Meninggal",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
  },
  computed: {
    ...mapState({
      loadingtable: state => state.user.loadingtable,
			wilayahpanjaitanOptions: store => store.setting.wilayahpanjaitanOptions,
    }),
    ...mapGetters({
      rekapmeninggalAll: 'user/rekapmeninggalAll',
    }),
  },
  watch: {
    rekapmeninggalAll: {
			deep: true,
			handler(value) {
        this.pageOptions = []
        this.RekapMeninggal = value.records
				this.pageSummary = {
					page: this.RekapMeninggal.length ? value.pageSummary.page : 0,
					limit: this.RekapMeninggal.length ? value.pageSummary.limit : 0,
					total: this.RekapMeninggal.length ? value.pageSummary.total : 0,
					totalPages: this.RekapMeninggal.length ? value.pageSummary.totalPages : 0
				}
        for (let index = 1; index <= this.pageSummary.totalPages; index++) {
          this.pageOptions.push(index)
        }
      }
		},
    inputData: {
      deep: true,
      handler(value){
        if(value.tanggal == null){ this.inputData.tanggal = '' }
        if(value.kategori == null){ this.inputData.kategori = '' }
        if(value.nama == null){ this.inputData.nama = '' }
        if(value.yangDitinggal == null){ this.inputData.yangDitinggal = '' }
        if(value.rumahDuka == null){ this.inputData.rumahDuka = '' }
        if(value.acaraAdat == null){ this.inputData.acaraAdat = '' }
        if(value.penanggungJawab == null){ this.inputData.penanggungJawab = '' }
        if(value.yangMemberiSumbangan == null){ this.inputData.yangMemberiSumbangan = '' }
        if(value.keterangan == null){ this.inputData.keterangan = '' }

        if(value.wilayah != null && value.tanggal != '' && value.kategori != '' && value.nama != '' && value.yangDitinggal != ''
           && value.rumahDuka != '' && value.acaraAdat != '' && value.penanggungJawab != '' && value.yangMemberiSumbangan != ''
            && value.keterangan != ''){
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
          this.getRekapMeninggal({page: value, limit: this.limit, keyword: this.searchData, sorting: this.kumpulSort, tanggal: this.tanggal})
        }
			}
		},
    limit: {
			deep: true,
			handler(value) {
        this.page = 1
				this.getRekapMeninggal({page: 1, limit: value, keyword: this.searchData, sorting: this.kumpulSort, tanggal: this.tanggal})
			}
		},
    tanggal: {
			deep: true,
			handler(value) {
        this.page = 1
        if(value === null) this.tanggal = []
				this.getRekapMeninggal({page: 1, limit: this.limit, keyword: this.searchData, sorting: this.kumpulSort, tanggal: this.tanggal})
			}
		},
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    this.BASEURL = process.env.VUE_APP_BASE_URL
    this.roleID = localStorage.getItem('roleID')
		this.getRekapMeninggal({page: this.page, limit: this.limit, keyword: this.searchData, sorting: this.kumpulSort, tanggal: this.tanggal});
    this.getWilayahPanjaitan();
	},
	methods: {
    ...mapActions({
      fetchData: 'fetchData',
      uploadFiles: 'upload/uploadFiles',
      getRekapMeninggal: 'user/getRekapMeninggal',
			getWilayahPanjaitan: 'setting/getWilayahPanjaitan',
    }),
    postRecord(item, jenis) {
      let bodyData = {
        ADDEDIT: {
          jenis: jenis,
          idRekap: jenis === 'ADD' ? '' : this.inputData.idRekap,
          wilayah: this.inputData.wilayah,
          tanggal: this.convertDateToPicker2(this.inputData.tanggal),
          kategori: this.inputData.kategori,
          nama: this.inputData.nama,
          yangDitinggal: this.inputData.yangDitinggal,
          rumahDuka: this.inputData.rumahDuka,
          acaraAdat: this.inputData.acaraAdat,
          penanggungJawab: this.inputData.penanggungJawab,
          yangMemberiSumbangan: this.inputData.yangMemberiSumbangan,
          keterangan: this.inputData.keterangan,
        },
				DELETE: {
					jenis: jenis,
					idRekap: item?.idRekap,
				}
      }
      this.$store.dispatch('user/postRekapMeninggal', jenis === 'ADD' || jenis === 'EDIT' ? bodyData.ADDEDIT : bodyData.DELETE)
      .then((res) => {
        this.clearData()
        this.DialogAdministrator = false
        this.getRekapMeninggal({page: 1, limit: this.limit, keyword: this.searchData, sorting: this.kumpulSort, tanggal: this.tanggal})
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.DialogAdministrator = false
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    openDialog(item, index){
      this.editedIndex = index
      this.getWilayahPanjaitan();
      if(index == 0){
        this.clearData()
      }else{
        this.inputData = {
          idRekap: item.idRekap,
          wilayah: item.wilayah,
          tanggal: item.tanggal,
          kategori: item.kategori,
          nama: item.nama,
          yangDitinggal: item.yangDitinggal,
          rumahDuka: item.rumahDuka,
          acaraAdat: item.acaraAdat,
          penanggungJawab: item.penanggungJawab,
          yangMemberiSumbangan: item.yangMemberiSumbangan,
          keterangan: item.keterangan,
        }
      }
      this.DialogAdministrator = true
    },
    downloadTemplate() {
      this.isLoadingDownload = true
			fetch(`${this.BASEURL}user/template?kategori=rekapmeninggal`, {
				method: 'GET',
				dataType: "xml",
			})
			.then(response => response.arrayBuffer())
			.then(async response => {
        setTimeout(() => {
          this.isLoadingDownload = false
          let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          this.downloadBlob(blob,`Template Data Rekap Meninggal.xlsx`)
          this.notifikasi("success", `Sukses Download Template Data Rekap Meninggal`, "1")
        }, 3000)
			})
		},
    async importExcel(e) {
      let files = e.target.files[0];
      if(files){
				const bodyData = {
					jenis: "excel",
					kategori: "rekapmeninggal",
				  createupdateBy: localStorage.getItem('idLogin'),
					files: files,
				};
				try {
          this.isLoadingImport = true
          this.query = true
          this.show = true
					await this.uploadFiles(bodyData)
          .then(async response => {
            files = ''
            this.$refs.inputExcel.value = null
            let dataResp = response.data.result
            this.dataJumlahImport = dataResp.jsonData;
            this.queryAndIndeterminate(1)
          })
        } catch (err) {
          this.isLoadingImport = false
          this.query = false
          this.show = false
          this.componentKey++;
          files = ''
          this.$refs.inputExcel.value = null
          this.notifikasi("error", "Gagal Import Data Rekap Meninggal", "1")
				}
			}else{
        this.isLoadingImport = false
        this.query = false
        this.show = false
        this.componentKey++;
        files = ''
        this.$refs.inputExcel.value = null
        this.notifikasi("warning", "Ulangi lagi Import Data Rekap Meninggal", "1")
      }  
    },
    exportExcel(kategori, bagian) {
      let wilayah, nameFile, url;
      if(!this.RekapMeninggal.length) return this.notifikasi("warning", 'Gagal Export Excel, Data belum tersedia !', "1")
      if(kategori === 'full'){
        if(bagian === 'full') {
          wilayah = this.wilayahpanjaitanOptions.map(str => str.kode).join(', ');
          nameFile = `Data Rekap Meninggal`;
          url = `?bagian=rekapmeninggal&kategori=${kategori}&wilayah=${wilayah}`
        }else if(bagian === 'byfilter') {
          let limit = 100;
          const totalPages = Math.ceil(this.pageSummary.total / limit)
          wilayah = this.wilayahpanjaitanOptions.map(str => str.kode).join(', ');
          nameFile = `Data Rekap Meninggal By Range Date`;
          url = `?bagian=rekapmeninggal&kategori=byfilter&wilayah=${wilayah}${this.tanggal.length ? `&startdate=${this.convertDateToPicker2(this.tanggal[0])}&enddate=${this.convertDateToPicker2(this.tanggal[1])}` : ''}&totalPages=${totalPages}&limit=${limit}`
        }
      }else if(kategori === 'by'){
        let limit = 100;
        const totalPages = Math.ceil(this.pageSummary.total / limit)
        wilayah = this.wilayahpanjaitanOptions.map(str => str.kode).join(', ');
        nameFile = `Data Rekap Meninggal By Range Date`;
        url = `?bagian=rekapmeninggal&kategori=byfilter&wilayah=${wilayah}${this.tanggal.length ? `&startdate=${this.convertDateToPicker2(this.tanggal[0])}&enddate=${this.convertDateToPicker2(this.tanggal[1])}` : ''}&totalPages=${totalPages}&limit=${limit}`
      }
      this.isLoadingExport = true
      fetch(`${this.BASEURL}user/exportexcel${url}`, {
        method: 'GET',
        dataType: "xml",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`
        }
      })
      .then(response => response.arrayBuffer())
      .then(async response => {
        setTimeout(() => {
          this.isLoadingExport = false
          let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          this.downloadBlob(blob,`${nameFile}.xlsx`)
          this.notifikasi("success", 'Sukses Export Excel', "1")
        }, 3000)
      })
		},
    queryAndIndeterminate(dataindex) {
      this.query = true
      this.show = true
      this.progress = 0
      let nilai = 0

      setTimeout(() => {
        this.query = false
        this.interval = setInterval(() => {
          if (this.progress === 100) {
            this.tutupDialog()
            this.getRekapMeninggal({page: this.page, limit: this.limit, keyword: this.searchData, sorting: this.kumpulSort, tanggal: this.tanggal})
            return this.notifikasi("success", "Berhasil import Data Rekap Meninggal", "1")
          }
          nilai += dataindex
          const data = (nilai / this.dataJumlahImport) * 100
          this.progress = Math.ceil(data)
        }, 2000)
      }, 10000)
    },
    downloadBlob(blob, name = '') {
			const blobUrl = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = blobUrl;
			link.download = name;
			document.body.appendChild(link);
			link.dispatchEvent(
				new MouseEvent('click', { 
					bubbles: true, 
					cancelable: true, 
					view: window 
				})
			);
			document.body.removeChild(link);
		},
    tutupDialog(){
      clearInterval(this.interval)
      this.query = false
      this.show = false
      this.progress = 0
      this.dataJumlahImport = 0;
      this.isLoadingImport = false
      this.dialogImport = false
    },
    clearData(){
      this.inputData = {
        idRekap: '',
        wilayah: null,
        tanggal: '',
        kategori: '',
        nama: '',
        yangDitinggal: '',
        rumahDuka: '',
        acaraAdat: '',
        penanggungJawab: '',
        yangMemberiSumbangan: '',
        keterangan: '',
      }
    },
    updateSort(data) {
      this.sortBy = data
			this.kumpulSort = this.sortBy.map((val) => {
        return `${val.key}-${val.order === 'asc' ? 'ASC' : 'DESC'}`
      }).join(',')
  		this.getRekapMeninggal({page: this.page, limit: this.limit, keyword: this.searchData, sorting: this.kumpulSort, tanggal: this.tanggal});
		},
    clickrow(event, data) {
      const index = this.$data.expanded.find(i => i === data?.item?.raw?.idRekap);
      if(typeof index === 'undefined') return this.$data.expanded = [];
      this.$data.expanded.splice(0, 1)
      this.$data.expanded.push(data?.item?.raw?.idRekap);
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
.kotak {
	border: 2px solid #000;
  display: inline-flex;
  justify-content: center;
  border-radius: 10px !important;
  background: #FFF;
  color: #000;
  padding: 2px;
  font-size: 10pt;
  width: 90px;
  height: 100px;
  text-align: -webkit-center;
  align-content: center;
  flex-wrap: wrap;
  flex-direction: row;
  cursor: pointer;
}
.listData {
	width: 300px !important;
}
</style>