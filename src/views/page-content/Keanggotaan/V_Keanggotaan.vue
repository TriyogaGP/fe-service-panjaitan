<template>
  <div>
    <h1 class="subheading grey--text text-decoration-underline">Data Keanggotaan</h1>
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
      <v-alert
        color="surface"
        border="start"
        border-color="light-blue accent-4"
        elevation="2"
        density="compact"
        icon="mdi mdi-information"
        title="Informasi"
        class="mb-2"
      >
        <template v-slot:text>
          <ul style="font-size: 12px;">
            <li v-if="roleID === '1' || roleID === '2'">- Tombol Export Data Excel By Filter digunakan untuk export data berupa excel by wilyah tetapi harus memilih filter category ke Wilayah lalu pilih Filter By Wilayah Panjaitan.</li>
            <li>- Jika Admin Wilayah yang meminta untuk perubahan data akan menunggu verifikasi dari Admin Pusat.</li>
            <li>- Tombol Hapus akan menghapus data dari database secara permanen, tetapi jika Admin Wilayah yang meminta untuk menghapus data akan menunggu verifikasi dari Admin Pusat ditandai dengan flag berwarna merah serta status tanda silang.</li>
            <li>- Mengurutkan data berdasarkan NO. ANGGOTA, NAMA, WILYAH, OMPU, STATUS.</li>
          </ul>
        </template>
      </v-alert>
      <v-data-table
        v-model="selectRecord"
        loading-text="Sedang memuat... Harap tunggu"
        no-data-text="Tidak ada data yang tersedia"
        no-results-text="Tidak ada catatan yang cocok ditemukan"
        :headers="headers"
        :loading="loadingtable"
        :items="DataKeanggotaan"
        expand-on-click
        item-value="idBiodata"
        :sort-by="sortBy"
        density="comfortable"
        hide-default-footer
        hide-default-header
        multi-sort
        show-select
        class="elavation-3 rounded"
        sort-asc-icon="mdi mdi-sort-alphabetical-ascending"
        sort-desc-icon="mdi mdi-sort-alphabetical-descending"
        :items-per-page="itemsPerPage"
        @page-count="pageCount = $event"
        @click:row="clickrow"
        @update:modelValue="(event) => { selectRecord = event; }"
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
        <template #[`item.nama`]="{ item }">
          <span v-if="item.raw.statusSuami === 'Meninggal'">
            {{ `Nama Suami : ${item.raw.namaLengkap}` }}
            <v-tooltip v-if="item.raw.statusSuami === 'Meninggal'" location="top">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" size="middle" icon="mdi mdi-cross" color="icon-red" /><br>
              </template>
              <span>Meninggal</span>
            </v-tooltip>
            <span v-if="item.raw.statusSuami === 'Meninggal'">
              {{ `Nama Istri : ${item.raw.namaIstri}` }}
              <v-tooltip v-if="item.raw.statusIstri === 'Meninggal'" location="top">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props" size="middle" icon="mdi mdi-cross" color="icon-red" /><br>
                </template>
                <span>Meninggal</span>
              </v-tooltip>
            </span>
          </span>
          <span v-else>{{ item.raw.namaLengkap }}</span>
        </template>
        <template #[`item.ompu`]="{ item }">
          <span v-html="item.raw.ompu ? item.raw.ompu.label : '-'" />
        </template>
        <template #[`item.wilayah`]="{ item }">
          <div>
            <span>{{ `Wilayah : ${item.raw.wilayah.label} (${item.raw.wilayah.kode})` }}</span><br>
            <span>{{ `Nama Ketua Wilayah : ${item.raw.wilayah.namaKetuaWilayah}` }}</span><br>
            <span :style="item.raw.komisarisWilayah ? '' : 'color: red;'">{{ `Nama Komisaris Wilayah : ${item.raw.komisarisWilayah ? item.raw.komisarisWilayah.namaKomisaris : '-'}` }}</span>
          </div>
        </template>
        <template #[`item.statusAktif`]="{ item }">
          <v-icon size="small" v-if="item.raw.statusBiodata" color="green" icon="mdi mdi-check" />
          <v-icon size="small" v-else color="red" icon="mdi mdi-close" />
        </template>
        <template #[`item.flag`]="{ item }">
          <div class="flag" :style="item.raw.flag ? 'background-color: red;' : 'background-color: green;'" />
        </template>
        <template #expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length">
              <Button
                color-button="#0bd369"
                icon-prepend-button="mdi mdi-pencil"
                nama-button="Ubah"
                size-button="x-small"
                :disabled-button="!item.raw.statusBiodata"
                @proses="ubahData(item.raw.idBiodata)"
              />
              <Button
                v-if="roleID === '1' || roleID === '2'"
                color-button="#0bd369"
                :icon-prepend-button="item.raw.statusBiodata ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"
                :nama-button="item.raw.statusBiodata ? 'Non Active' : 'Active'"
                size-button="x-small"
                @proses="postRecord(item.raw, 'STATUSRECORD', !item.raw.statusBiodata)"
              />
              <Button 
                color-button="#bd3a07"
                icon-prepend-button="mdi mdi-delete"
                size-button="x-small"
                :disabled-button="!item.raw.statusBiodata && (roleID === '3')"
                nama-button="Hapus"
                @click="postRecord(item.raw, 'DELETEHARD', null)"
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
                      md="8"
                    >
                      <v-row no-gutters>
                        <v-col
                          cols="12"
                          md="12"
                          class="pa-3 d-flex align-center font-weight-bold text-h6"
                        >
                          >> Data Pribadi
                        </v-col>
                      </v-row>
                      <v-row no-gutters>
                        <v-col
                          cols="12"
                          md="4"
                          class="pt-2 d-flex align-center font-weight-bold text-caption"
                        >
                        Nama Suami
                        </v-col>
                        <v-col
                          cols="12"
                          md="8"
                          class="pt-2"
                        >
                          : {{ item.raw.namaLengkap }}
                          <v-tooltip v-if="item.raw.statusSuami === 'Meninggal'" location="top">
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
                          class="pt-2 d-flex align-center font-weight-bold text-caption"
                        >
                        Tempat Tanggal Lahir Suami
                        </v-col>
                        <v-col
                          cols="12"
                          md="8"
                          class="pt-2"
                        >
                          : {{ `${item.raw.tempatSuami ? item.raw.tempatSuami : '-'}, ${item.raw.tanggalLahirSuami ? convertDateForMonth(item.raw.tanggalLahirSuami) : '-'}` }}
                        </v-col>
                      </v-row>
                      <v-row no-gutters>
                        <v-col
                          cols="12"
                          md="4"
                          class="pt-2 d-flex align-center font-weight-bold text-caption"
                        >
                          Alamat
                        </v-col>
                        <v-col
                          cols="12"
                          md="8"
                          class="pt-2"
                        >
                          : {{ `${item.raw.alamat ? item.raw.alamat : '-'}${item.raw.kelurahan !== null ? `, ${item.raw.kelurahan.jenisKelDes} ${item.raw.kelurahan.nama}` : '' }${item.raw.kecamatan !== null ? `, Kecamatan ${item.raw.kecamatan.nama}` : '' }${item.raw.kabKota !== null ? `, ${item.raw.kabKota.jenisKabKota} ${item.raw.kabKota.nama}` : ''}${item.raw.provinsi !== null ? `, ${item.raw.provinsi.nama}` : ''} ${item.raw.kodePos !== null ? `${item.raw.kodePos}` : ''}` }}
                        </v-col>
                      </v-row>
                      <v-row no-gutters>
                        <v-col
                          cols="12"
                          md="4"
                          class="pt-2 d-flex align-center font-weight-bold text-caption"
                        >
                          Telepon Suami
                        </v-col>
                        <v-col
                          cols="12"
                          md="8"
                          class="pt-2"
                        >
                          : {{ item.raw.telp ? item.raw.telp : '-' }}
                        </v-col>
                      </v-row>
                      <v-row no-gutters>
                        <v-col
                          cols="12"
                          md="4"
                          class="pt-2 d-flex align-center font-weight-bold text-caption"
                        >
                        Pekerjaan Suami
                        </v-col>
                        <v-col
                          cols="12"
                          md="8"
                          class="pt-2"
                        >
                          : {{ item.raw.pekerjaanSuami ? item.raw.pekerjaanSuami : '-' }}
                        </v-col>
                      </v-row>
                      <v-row v-if="item.raw.statusSuami === 'Meninggal'" no-gutters>
                        <v-col
                          cols="12"
                          md="4"
                          class="pt-2 d-flex align-center font-weight-bold text-caption"
                        >
                        Tanggal Wafat Suami
                        </v-col>
                        <v-col
                          cols="12"
                          md="8"
                          class="pt-2"
                        >
                          : {{ item.raw.tanggalWafatSuami ? convertDateForMonth(item.raw.tanggalWafatSuami) : '-' }}
                          <Button 
                            color-button="light-blue darken-3"
                            icon-prepend-button="mdi mdi-eye"
                            nama-button="Lihat Surat"
                            size-button="x-small"
                          />
                        </v-col>
                      </v-row>
                      <v-row no-gutters>
                        <v-col
                          cols="12"
                          md="12"
                          class="pa-3 d-flex align-center font-weight-bold text-h6"
                        >
                          >> Data Istri
                        </v-col>
                      </v-row>
                      <v-row no-gutters>
                        <v-col
                          cols="12"
                          md="4"
                          class="pt-2 d-flex align-center font-weight-bold text-caption"
                        >
                        Nama Istri
                        </v-col>
                        <v-col
                          cols="12"
                          md="8"
                          class="pt-2"
                        >
                          : {{ item.raw.namaIstri }}
                          <v-tooltip v-if="item.raw.statusIstri === 'Meninggal'" location="top">
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
                          class="pt-2 d-flex align-center font-weight-bold text-caption"
                        >
                          Tempat, Tanggal Lahir Istri
                        </v-col>
                        <v-col
                          cols="12"
                          md="8"
                          class="pt-2"
                        >
                          : {{ `${item.raw.tempatIstri ? item.raw.tempatIstri : '-'}, ${item.raw.tanggalLahirIstri ? convertDateForMonth(item.raw.tanggalLahirIstri) : '-'}` }}
                        </v-col>
                      </v-row>
                      <v-row no-gutters>
                        <v-col
                          cols="12"
                          md="4"
                          class="pt-2 d-flex align-center font-weight-bold text-caption"
                        >
                          Telepon Istri
                        </v-col>
                        <v-col
                          cols="12"
                          md="8"
                          class="pt-2"
                        >
                          : {{ item.raw.telpIstri ? item.raw.telpIstri : '-' }}
                        </v-col>
                      </v-row>
                      <v-row no-gutters>
                        <v-col
                          cols="12"
                          md="4"
                          class="pt-2 d-flex align-center font-weight-bold text-caption"
                        >
                        Pekerjaan Istri
                        </v-col>
                        <v-col
                          cols="12"
                          md="8"
                          class="pt-2"
                        >
                          : {{ item.raw.pekerjaanIstri ? item.raw.pekerjaanIstri : '-' }}
                        </v-col>
                      </v-row>
                      <v-row v-if="item.raw.statusIstri === 'Meninggal'" no-gutters>
                        <v-col
                          cols="12"
                          md="4"
                          class="pt-2 d-flex align-center font-weight-bold text-caption"
                        >
                        Tanggal Wafat Istri
                        </v-col>
                        <v-col
                          cols="12"
                          md="8"
                          class="pt-2"
                        >
                          : {{ item.raw.tanggalWafatIstri ? convertDateForMonth(item.raw.tanggalWafatIstri) : '-' }}
                          <Button 
                            color-button="light-blue darken-3"
                            icon-prepend-button="mdi mdi-eye"
                            nama-button="Lihat Surat"
                            size-button="x-small"
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                    >
                      <div class="mt-4 d-flex flex-column justify-space-between align-center">
                        <div class="avatar">
                          <span class="wadahtulisan">
                            <span class="tulisan">
                              <v-icon color="white" size="x-large" icon="mdi mdi-camera-image" @click="$refs.fotoProfile.click()"/>&nbsp;Ubah Foto Profil
                            </span>
                            <v-divider vertical :thickness="2" color="white" />
                            <span class="tulisan">
                              <v-icon color="white" size="x-large" icon="mdi mdi-camera-account" @click="lihatFoto(item.raw.fotoProfil)"/>&nbsp;Lihat Foto Profil
                            </span>
                          </span>
                          <v-img :src="item.raw.fotoProfil" />
                        </div>
                        <input 
                          ref="fotoProfile"
                          :key="componentKey"
                          type="file"
                          accept="image/*"
                          style="display: none"
                          @change="uploadFotoProfile($event, item.raw.idBiodata)"
                        >
                        <div>
                          <span>
                            <Button 
                              @click="statusData('STATUSMENINGGAL', 'SUAMI', item.raw.idBiodata, `${item.raw.statusSuami === 'Meninggal' ? 'Hidup' : 'Meninggal'}`)"
                              :color-button="`${item.raw.statusSuami === 'Meninggal' ? '#0bd369' : '#c12626'}`"
                              icon-prepend-button="mdi mdi-cross"
                              :nama-button="`${item.raw.statusSuami === 'Meninggal' ? 'Hidup' : 'Meninggal'}`"
                              size-button="x-small"
                            />
                            <v-tooltip activator="parent" location="bottom">Suami</v-tooltip>
                          </span>
                          <span>
                            <Button 
                              @click="statusData('STATUSMENINGGAL', 'ISTRI', item.raw.idBiodata, `${item.raw.statusIstri === 'Meninggal' ? 'Hidup' : 'Meninggal'}`)"
                              :color-button="`${item.raw.statusIstri === 'Meninggal' ? '#0bd369' : '#c12626'}`"
                              icon-prepend-button="mdi mdi-cross"
                              :nama-button="`${item.raw.statusIstri === 'Meninggal' ? 'Hidup' : 'Meninggal'}`"
                              size-button="x-small"
                            />
                            <v-tooltip activator="parent" location="bottom">Istri</v-tooltip>
                          </span>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col
                      cols="12"
                      md="12"
                      class="pa-3 d-flex align-center font-weight-bold text-h6"
                    >
                      >> Data Tanggungan
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col
                      cols="12"
                      md="12"
                      class="d-flex align-center font-weight-bold text-caption"
                    >
                      <table border="1" cellspacing="0" cellpadding="0" width="100%" style="background-color: #272727; border: #FFF;">
                        <tr class="table-header">
                          <td>No</td>
                          <td>Nama</td>
                          <td>Tanggal Lahir</td>
                          <td>Tanggal Wafat</td>
                          <td>Aksi</td>
                        </tr>
                        <template v-if="item.raw.anak.length">
                          <tr style="font-size: 9pt; font-weight: bold; color: white; padding: 10px" v-for="(data, index) in item.raw.anak" :key="index">
                            <td style="text-align: center;" width="5%">{{ index + 1 }}</td>
                            <td style="padding-left: 10px;">
                              {{ data.namaAnak }} 
                              <v-icon size="large" :icon="data.kategoriAnak === 'Anak' ? 'mdi mdi-human-male mdi' : 'mdi-human-female'" color="icon-white" />
                              <v-tooltip v-if="data.statusAnak === 'Meninggal'" location="top">
                                <template v-slot:activator="{ props }">
                                  <v-icon v-bind="props" size="large" icon="mdi mdi-cross" color="icon-red" />
                                </template>
                                <span>Meninggal</span>
                              </v-tooltip>
                            </td>
                            <td style="padding-left: 10px; text-align: center;">{{ data.tanggalLahir ? convertDateForMonth(data.tanggalLahir) : '-' }}</td>
                            <td style="padding-left: 10px; text-align: center;">{{ data.tanggalWafatAnak ? convertDateForMonth(data.tanggalWafatAnak) : '-' }}</td>
                            <td style="padding-left: 10px; text-align: center;">
                              <Button 
                                @click="statusData('STATUSMENINGGAL', 'TANGGUNGAN', data.idAnak, `${data.statusAnak === 'Meninggal' ? 'Hidup' : 'Meninggal'}`)"
                                :color-button="`${data.statusAnak === 'Meninggal' ? '#0bd369' : '#c12626'}`"
                                icon-prepend-button="mdi mdi-cross"
                                :nama-button="`${data.statusAnak === 'Meninggal' ? 'Hidup' : 'Meninggal'}`"
                                size-button="x-small"
                              />
                              <Button 
                                v-if="data.statusAnak === 'Meninggal'"
                                color-button="light-blue darken-3"
                                icon-prepend-button="mdi mdi-eye"
                                nama-button="Lihat Surat"
                                size-button="x-small"
                              />
                            </td>
                          </tr>
                          </template>
                          <template v-else>
                            <tr style="font-size: 9pt; font-weight: bold; color: white; padding: 10px">
                              <td style="text-align: center;" colspan="4">Data tidak ada</td>
                            </tr>
                          </template>
                      </table>
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
                @proses="getUID"
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
                    @click="exportExcel('full')"
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
                    v-if="roleID === '1' || roleID === '2'"
                    @click="exportExcel('by')"
                    color="nav-back"
                    class="SelectedMenu"
                    title="Export Data Excel By Filter"
                    :disabled="(filterby === 'Wilayah' || filterby === 'Komisaris') && filterforby !== null ? false : true"
                  >
                    <template v-slot:append>
                      <v-icon size="middle" icon="mdi mdi-file-excel" color="icon-white" />
                    </template>
                    <template v-slot:title>
                      <span class="menufont">Export Data Excel By Filter</span>
                    </template>
                  </v-list-item>
                  <v-list-item
                    v-if="roleID === '1' || roleID === '2'"
                    @click="exportExcel('komisaris')"
                    color="nav-back"
                    class="SelectedMenu"
                    title="Export Data Excel By Komisaris"
                    :disabled="(filterby === 'Wilayah' || filterby === 'Komisaris') && filterforby !== null ? false : true"
                  >
                    <template v-slot:append>
                      <v-icon size="middle" icon="mdi mdi-file-excel" color="icon-white" />
                    </template>
                    <template v-slot:title>
                      <span class="menufont">Export Data Excel By Komisaris</span>
                    </template>
                  </v-list-item>
                  <v-list-item
                    v-if="roleID === '3'"
                    @click="exportExcel('komisaris')"
                    color="nav-back"
                    class="SelectedMenu"
                    title="Export Data Excel By Komisaris"
                  >
                    <template v-slot:append>
                      <v-icon size="middle" icon="mdi mdi-file-excel" color="icon-white" />
                    </template>
                    <template v-slot:title>
                      <span class="menufont">Export Data Excel By Komisaris</span>
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
                      getKeanggotaan({page: 1, limit: limit, keyword: '', filter: `${filterby}-${filterforby}`, sorting: kumpulSort})
                    }"
                    @keyup.enter="() => {
                      page = 1
                      getKeanggotaan({page: 1, limit: limit, keyword: searchData, filter: `${filterby}-${filterforby}`, sorting: kumpulSort})
                    }"
                  />
                </v-col>
                <v-col cols="12" md="3" class="pr-2">
                  <Autocomplete
                    v-model="filterby"
                    :data-a="optionsFilter"
                    item-title="text"
                    item-value="value"
                    label-a="Filter Category"
                    :clearable-a="true"
                  />
                </v-col>
                <v-col cols="12" md="3" class="pr-2">
                  <Autocomplete
                    v-model="filterforby"
                    :data-a="filterByOptions"
                    item-title="text"
                    item-value="value"
                    label-a="Filter By"
						        :disabled-a="filterby !== null ? false : true"
                    :clearable-a="false"
                  />
                </v-col>
                <v-col cols="12" md="2" class="d-flex justify-end align-center">
                  <Autocomplete
                    v-model="page"
                    :data-a="pageOptions"
                    label-a="Page"
                    :disabled-a="DataKeanggotaan.length ? false : true"
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
            <v-col cols="12" class="pa-2 d-flex justify-start align-center">
              <Button
                v-if="DataKeanggotaan.length && selectRecord.length < DataKeanggotaan.length"
                color-button="#0bd369"
                icon-prepend-button="mdi mdi-select-all"
                :nama-button="`Choose All (${selectRecord.length})`"
                size-button="x-small"
                @proses="allData(DataKeanggotaan)"
              />
              <Button
                v-if="selectRecord.length"
                color-button="#0bd369"
                icon-prepend-button="mdi mdi-select-remove"
                :nama-button="`Remove Select`"
                size-button="x-small"
                @proses="() => { selectRecord = [] }"
              />
              <Button 
                color-button="#bd3a07"
                icon-prepend-button="mdi mdi-delete"
                nama-button="Hapus Record Selected"
                size-button="x-small"
                :disabled-button="!DataKeanggotaan.length"
                @proses="postHapusRecord()"
              />
            </v-col>
          </v-row>
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
                  :disabled-a="DataKeanggotaan.length ? false : true"
                />
                <Button
                  variant="plain"
                  size-button="large"
                  model-button="comfortable"
                  color-button="#ffffff"
                  icon-button="mdi mdi-arrow-left-circle-outline"
                  :disabled-button="DataKeanggotaan.length ? pageSummary.page != 1 ? false : true : true"
                  @proses="() => { page = pageSummary.page - 1 }"
                />
                <Button
                  variant="plain"
                  size-button="large"
                  model-button="comfortable"
                  color-button="#ffffff"
                  icon-button="mdi mdi-arrow-right-circle-outline"
                  :disabled-button="DataKeanggotaan.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
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
          <v-toolbar-title>Import Data Keanggotaan</v-toolbar-title>
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
    <v-dialog
      v-model="dialogCrop"
      scrollable
      persistent
      transition="dialog-bottom-transition"
      width="auto"
    >
      <v-card color="background-dialog-card">
        <v-card-text class="pt-4 v-dialog--custom">
          <Cropper
            ref="cropper"
            class="cropper"
            :src="image.src"
            :stencil-component="RectangleStencil"
          />
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
                nama-button="Tutup"
                @proses="tutupDialogCrop()"
              />
              <Button
                color-button="black"
                nama-button="Crop Lampiran"
                @proses="crop()"
              />
            </v-col>
          </v-row>  
        </v-card-actions>
      </v-card>
		</v-dialog>
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
                @proses="flag === 'updateordelete' ? kirimData(bodyData) : hapusAllRecord()"
              />
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogTanggalWafat"
      transition="dialog-bottom-transition"
      persistent
      width="800px"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Ubah Tanggal Wafat {{ untuk }}</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#FFFFFF"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { dialogTanggalWafat = false; }"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pt-4">
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold text-caption"
            >
              Tanggal Wafat {{ untuk }}
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <vue-date-picker
                v-model="tanggal_wafat"
                :placeholder="`Tanggal Wafat ${untuk}`"
                format="dd-MM-yyyy"
                :enable-time-picker="false"
                teleport-center
                :month-change-on-scroll="false"
                auto-apply
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
                @proses="prosesStatusData(bodyData2)"
              />
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogFotoProfil"
      transition="dialog-bottom-transition"
      persistent
      width="auto"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Foto Profil</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#FFFFFF"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { dialogFotoProfil = false; fotoprofil = ''; }"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pt-4 v-dialog--custom">
          <v-row no-gutters>
            <v-col
              cols="12"
              class="pt-2 d-flex align-center justify-center"
            >
              <div class="avatarFotoProfil">
                <v-img :src="fotoprofil" />
              </div>
            </v-col>
          </v-row>
        </v-card-text>
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
        @download="getProses()"
        @proses="goToProses()"
        @cancel="dialogNotifikasi = false"
      />
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import { useMeta } from 'vue-meta'
import { useRoute } from "vue-router";
import PopUpNotifikasi from "../../Layout/PopUpNotifikasi.vue";
import Stencil from "../../Layout/Stencil.vue";
import { RectangleStencil } from "vue-advanced-cropper";

function getMimeType(file, fallback = null) {
	const byteArray = (new Uint8Array(file)).subarray(0, 4);
  let header = '';
  for (let i = 0; i < byteArray.length; i++) {
      header += byteArray[i].toString(16);
  }
	switch (header) {
    case "89504e47":
      return "image/png";
      case "47494638":
        return "image/gif";
        case "ffd8ffe0":
          case "ffd8ffe1":
    case "ffd8ffe2":
      case "ffd8ffe3":
        case "ffd8ffe8":
          return "image/jpeg";
    default:
      return fallback;
    }
  }

export default {
  name: 'DataKeanggotaan',
  components: {
    PopUpNotifikasi,
    RectangleStencil,
    Stencil,
  },
  data: () => ({
		expanded: [],
		DataKeanggotaan: [],
    selectRecord: [],
		searchData: '',
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
    filterOptions: [
      { text: 'Status', value: 'Status' },
      { text: 'Wilayah', value: 'Wilayah' },
      { text: 'Komisaris', value: 'Komisaris' },
    ],
    filterby: null,
    filterforby: null,
    filterByOptions: [],
    sortBy: [],
		kumpulSort: '',
		flag: '',
		headers: [
      { title: "#", key: "data-table-select", sortable: false, width: "3%" },
      { title: "No", key: "number", sortable: false, width: "3%" },
      { title: "#", key: "data-table-expand", sortable: false, width: "3%" },
      { title: "NO. ANGGOTA", key: "nik", sortable: true, width: "5%" },
      { title: "NAMA", key: "nama", sortable: true, width: "15%" },
      { title: "WILAYAH", key: "wilayah", sortable: true, width: "20%" },
      { title: "OMPU", key: "ompu", sortable: true, width: "5%" },
      { title: "GENERASI", key: "generasi", sortable: false, width: "3%" },
      { title: "STATUS", key: "statusAktif", sortable: true, width: "3%" },
      { title: "FLAG", key: "flag", sortable: false, width: "3%" },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
    roleID: '',
    options: {
      penColor: "#000",
    },
    dialogImport: false,
    isLoadingExport: false,
    isLoadingDownload: false,
    isLoadingImport: false,
    progress: 0,
    query: false,
    show: true,
    interval: 0,
    dataJumlahImport: 0,
    dataJumlahImportAvailable: 0,
    urlSk: window.location.href,
    componentKey: 0,
    downloadFile: '',
    namawilayah: '',
    BASEURL: '',
    idBiodata: '',
    dialogCrop: false,
    image: {
      src: null,
      type: null,
    },
    FileFotoProfil: '',
    fotoProfil: '',
    options: {
      penColor: "#000",
    },
    bodyData: '',
    bodyData2: '',
    reason: '',
    untuk: '',
    tanggal_wafat: '',
    fotoprofil: '',

    //notifikasi
    dialogFotoProfil: false,
    dialogTanggalWafat: false,
    dialogQuestion: false,
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Data Keanggotaan",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
    const route = useRoute()
    let kategori = route.params.kategori
    return { kategori, RectangleStencil }
  },
  computed: {
		...mapState({
			loadingtable: store => store.user.loadingtable,
			wilayahpanjaitanOptions: store => store.setting.wilayahpanjaitanOptions,
			komisariswilayahOptions: store => store.setting.komisariswilayahOptions,
		}),
    ...mapGetters({
      keanggotaanAll: 'user/keanggotaanAll',
      UID: 'setting/userUID',
    }),
    optionsFilter(){
      let roleid = localStorage.getItem('roleID')
      if(roleid === '1' || roleid === '2'){
        return this.filterOptions.filter(str => str.text !== 'Komisaris')
      }else{
        return this.filterOptions.filter(val => val.text !== 'Wilayah')
      }
    }
  },
  watch: {
    UID: {
      deep: true,
			handler(value) {
        this.$router.push({name: "FormulirKeanggotaan", params: { kondisi: 'ADD', uid: value }});
      }
    },
    keanggotaanAll: {
			deep: true,
			handler(value) {
        this.pageOptions = []
        this.DataKeanggotaan = value.records
				this.pageSummary = {
					page: this.DataKeanggotaan.length ? value.pageSummary.page : 0,
					limit: this.DataKeanggotaan.length ? value.pageSummary.limit : 0,
					total: this.DataKeanggotaan.length ? value.pageSummary.total : 0,
					totalPages: this.DataKeanggotaan.length ? value.pageSummary.totalPages : 0
				}
        for (let index = 1; index <= this.pageSummary.totalPages; index++) {
          this.pageOptions.push(index)
        }
      }
		},
    page: {
			deep: true,
			handler(value) {
        if(value){
          this.getKeanggotaan({page: value, limit: this.limit, keyword: this.searchData, filter: `${this.filterby}-${this.filterforby}`, sorting: this.kumpulSort})
        }
			}
		},
    limit: {
			deep: true,
			handler(value) {
        this.page = 1
				this.getKeanggotaan({page: 1, limit: value, keyword: this.searchData, filter: `${this.filterby}-${this.filterforby}`, sorting: this.kumpulSort})
			}
		},
    filterforby: {
			deep: true,
			handler(value) {
        this.page = 1
				this.getKeanggotaan({page: 1, limit: this.limit, keyword: this.searchData, filter: `${this.filterby}-${value}`, sorting: this.kumpulSort})
			}
		},
    filterby: {
			deep: true,
			handler(value, oldValue) {
        if(oldValue === null || oldValue !== value){
          // if(this.kategori === 'all') {
            this.filterByOptions = []
            this.filterforby = null
          // }
        }
        if(value === 'Status'){
          this.filterByOptions.push(
            { text: 'Hidup', value: 'Hidup' },
            { text: 'Meninggal', value: 'Meninggal' }
          )
        }else if(value === 'Wilayah'){
          this.wilayahpanjaitanOptions.map(val => {
            this.filterByOptions.push({ text: val.label, value: val.label })
          })
        }else if(value === 'Komisaris'){
          this.komisariswilayahOptions.map(val => {
            this.filterByOptions.push({ text: val.namaKomisaris, value: val.kodeKomisarisWilayah })
          })
        }
			}
		},
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    this.roleID = localStorage.getItem('roleID')
    this.BASEURL = process.env.VUE_APP_BASE_URL
    this.getWilayahPanjaitan();
    this.getKomisarisWilayah({ kodeWilayah: localStorage.getItem('wilayah') === '00' ? undefined : localStorage.getItem('wilayah') });
    if(this.roleID === '3') {
      let getWilayah = this.wilayahpanjaitanOptions.filter(val => val.kode === localStorage.getItem('wilayah'))
      this.namawilayah = getWilayah.length ? getWilayah[0].label : ''
    }
    if(this.kategori === 'all'){
      this.getKeanggotaan({page: this.page, limit: this.limit, keyword: this.searchData, filter: `${this.filterby}-${this.filterforby}`, sorting: this.kumpulSort});
    }else if(this.kategori.length === 2){
      let getWilayah = this.wilayahpanjaitanOptions.filter(val => val.kode === this.kategori)
      this.searchData = getWilayah.length ? getWilayah[0].label : ''
      this.getKeanggotaan({page: this.page, limit: this.limit, keyword: this.searchData, filter: `${this.filterby}-${this.filterforby}`, sorting: this.kumpulSort});
    }else{
      this.searchData = this.kategori
      this.getKeanggotaan({page: this.page, limit: this.limit, keyword: this.searchData, filter: `${this.filterby}-${this.filterforby}`, sorting: this.kumpulSort});
    }
	},
  beforeDestroy () {
    clearInterval(this.interval)
  },
	methods: {
		...mapActions({
      fetchData: 'fetchData',
      uploadFiles: 'upload/uploadFiles',
      getKeanggotaan: 'user/getKeanggotaan',
			getWilayahPanjaitan: 'setting/getWilayahPanjaitan',
			getKomisarisWilayah: 'setting/getKomisarisWilayah',
      getUID: 'setting/getUID',
    }),
		postRecord(item, jenis, kondisi) {
      this.bodyData = {
        jenis: jenis,
        idBiodata: item.idBiodata,
        kondisi: kondisi,
        reason: this.reason,
      }
      if(localStorage.getItem('roleID') === '1' || localStorage.getItem('roleID') === '2') return this.kirimData(this.bodyData);
      if(localStorage.getItem('roleID') === '3') {
        this.flag = 'updateordelete';
        this.dialogQuestion = true;
      }
    },
    kirimData(bodyData){
      bodyData.reason = this.reason
      this.$store.dispatch('user/postKeanggotaan', bodyData)
      .then((res) => {
        this.dialogQuestion = false;
        this.bodyData = ''
        this.reason = ''
        this.flag = ''
        this.getKeanggotaan({page: 1, limit: this.limit, keyword: this.searchData, filter: `${this.filterby}-${this.filterforby}`, sorting: this.kumpulSort})
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    statusData(jenis, untuk, id, status){
      this.bodyData2 = {
        jenis, untuk,
        statusMeninggal: status,
        idStatus: id,
      }
      this.untuk = this.uppercaseLetterFirst(untuk)
      if(status === 'Meninggal') this.dialogTanggalWafat = true
      if(status === 'Hidup') this.prosesStatusData(this.bodyData2)
    },
    prosesStatusData(bodyData){
      this.$store.dispatch('user/postKeanggotaan', bodyData.statusMeninggal === 'Meninggal' ? { ...bodyData, tanggal_wafat: this.tanggal_wafat ? this.tanggal_wafat : null } : bodyData)
      .then((res) => {
        this.dialogQuestion = false;
        this.dialogTanggalWafat = false;
        this.bodyData = ''
        this.bodyData2 = ''
        this.reason = ''
        this.untuk = ''
        this.tanggal_wafat = ''
        this.getKeanggotaan({page: 1, limit: this.limit, keyword: this.searchData, filter: `${this.filterby}-${this.filterforby}`, sorting: this.kumpulSort})
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    ubahData(uid){
      this.$router.push({name: "FormulirKeanggotaan", params: { kondisi: 'EDIT', uid: uid }});
    },
    allData(item) {
      if(item.length === this.selectRecord.length) return this.notifikasi("warning", "Data sudah di pilih semua pada page ini!", "1")
      item.map(val => {
        if(!this.selectRecord.includes(val.idBiodata)){
          this.selectRecord.push(val.idBiodata)
        }
      })
    },
    postHapusRecord() {
      if(!this.selectRecord.length) return this.notifikasi("warning", "Belum ada record yang di pilih!", "1")
      
      if(localStorage.getItem('roleID') === '1' || localStorage.getItem('roleID') === '2') return this.hapusAllRecord();
      if(localStorage.getItem('roleID') === '3') {
        this.flag = 'deleteselected';
        this.dialogQuestion = true;
      }
    },
    hapusAllRecord() {
      let bodyData = {
        jenis: 'DELETESELECTEDHARD',
        idBiodata: this.selectRecord,
        reason: this.reason,
      }
      this.$store.dispatch('user/postKeanggotaan', bodyData)
      .then((res) => {
        this.dialogQuestion = false;
        this.selectRecord = []
        this.reason = ''
        this.flag = ''
        this.getKeanggotaan({page: this.page, limit: this.limit, keyword: this.searchData, filter: `${this.filterby}-${this.filterforby}`, sorting: this.kumpulSort});
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    async importExcel(e) {
      let files = e.target.files[0];
      if(files){
				const bodyData = {
					jenis: "excel",
					kategori: "datakeanggotaan",
				  wilayah: localStorage.getItem('wilayah'),
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
            this.dataJumlahImportAvailable = dataResp.jsonDataAvailable;
            this.downloadFile = dataResp.path
            this.queryAndIndeterminate(1)
          })
        } catch (err) {
          this.isLoadingImport = false
          this.query = false
          this.show = false
          this.componentKey++;
          files = ''
          this.$refs.inputExcel.value = null
          this.notifikasi("error", "Gagal Import Data Keanggotaan", "1")
				}
			}else{
        this.isLoadingImport = false
        this.query = false
        this.show = false
        this.componentKey++;
        files = ''
        this.$refs.inputExcel.value = null
        this.notifikasi("warning", "Ulangi lagi Import Data Keanggotaan", "1")
      }  
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
            if (this.dataJumlahImportAvailable > 0 && this.progress === 100) { 
              return this.notifikasi("warning2", "Masih terdapat data yang sudah diinputkan !", "3");
            }
            this.tutupDialog()
            this.getKeanggotaan({page: this.page, limit: this.limit, keyword: this.searchData, filter: `${this.filterby}-${this.filterforby}`, sorting: this.kumpulSort});
            return this.notifikasi("success", "Berhasil import Data Keanggotaan", "1")
          }
          nilai += dataindex
          const data = (nilai / this.dataJumlahImport) * 100
          this.progress = Math.ceil(data)
        }, 2000)
      }, 30000)
    },
    exportExcel(kategori) {
      let wilayah, namawilayah, nameFile, url;
      if(!this.DataKeanggotaan.length) return this.notifikasi("warning", 'Gagal Export Excel, Data belum tersedia !', "1")
      if(kategori === 'full'){
        if(this.roleID === '1' || this.roleID === '2') {
          wilayah = this.wilayahpanjaitanOptions.map(str => str.kode).join(', ');
          nameFile = `Data Keanggotaan Seluruh Wilayah`;
          url = `?bagian=datakeanggotaan&kategori=${kategori}&wilayah=${wilayah}`
        }else if(this.roleID === '3') {
          let limit = 100;
          const totalPages = Math.ceil(this.pageSummary.total / limit)
          let getdata = this.wilayahpanjaitanOptions.filter(val => val.kode === localStorage.getItem('wilayah'))
          wilayah = getdata.length ? getdata[0].kode : '-'
          namawilayah = getdata.length ? getdata[0].label : ''
          nameFile = `Data Keanggotaan Wilayah ${namawilayah}`;
          url = `?bagian=datakeanggotaan&kategori=by&wilayah=${wilayah}&totalPages=${totalPages}&limit=${limit}`
        }
      }else if(kategori === 'by'){
        let limit = 100;
        const totalPages = Math.ceil(this.pageSummary.total / limit)
        let getdata = this.wilayahpanjaitanOptions.filter(val => val.label === this.filterforby)
        wilayah = getdata.length ? getdata[0].kode : '-'
        nameFile = `Data Keanggotaan Wilayah ${this.filterforby}`;
        url = `?bagian=datakeanggotaan&kategori=by&wilayah=${wilayah}&totalPages=${totalPages}&limit=${limit}`
      }else if(kategori === 'komisaris'){
        if(this.roleID === '1' || this.roleID === '2') {
          let getdata = this.wilayahpanjaitanOptions.filter(val => val.label === this.filterforby)
          wilayah = getdata.length ? getdata[0].kode : '-'
          namawilayah = getdata.length ? getdata[0].label : ''
          nameFile = `Data Keanggotaan By Komisaris Wilayah ${namawilayah}`;
          url = `?bagian=datakeanggotaan&kategori=komisaris&wilayah=${wilayah}`
        }else if(this.roleID === '3') {
          wilayah = localStorage.getItem('wilayah');
          let getdata = this.wilayahpanjaitanOptions.filter(val => val.kode === wilayah)
          namawilayah = getdata.length ? getdata[0].label : ''
          nameFile = `Data Keanggotaan By Komisaris Wilayah ${namawilayah}`;
          url = `?bagian=datakeanggotaan&kategori=komisaris&wilayah=${wilayah}`
        }
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
    downloadTemplate() {
      this.isLoadingDownload = true
			fetch(`${this.BASEURL}user/template?wilayah=${localStorage.getItem('wilayah')}&kategori=datakeanggotaan`, {
				method: 'GET',
				dataType: "xml",
			})
			.then(response => response.arrayBuffer())
			.then(async response => {
        setTimeout(() => {
          this.isLoadingDownload = false
          let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          this.downloadBlob(blob,`Template Data Keanggotaan${this.roleID === '3' ? ` Wilayah ${this.namawilayah}` : ''}.xlsx`)
          this.notifikasi("success", `Sukses Download Template Data Keanggotaan${this.roleID === '3' ? ` Wilayah ${this.namawilayah}` : ''}`, "1")
        }, 3000)
			})
		},
    async uploadFotoProfile(e, id_biodata) {
      let files = e.target.files[0];
      this.idBiodata = id_biodata
      if(!files) return this.notifikasi("warning", 'Ulangi unggah Foto Profile', "1")
      let ukuran = (files.size / (1024*1024)).toFixed(2);
      if(ukuran > 5.00) { 
        this.componentKey++; 
        return this.notifikasi("warning", 'Unggah Foto Profile anda terlalu besar !', "1")
      }
      this.fotoProfil = files.name
      this.loadImage(files)
    },
    loadImage(files) {
      this.dialogCrop = true
      const blob = URL.createObjectURL(files);
      const reader = new FileReader();
      reader.onload = (e) => {
        this.image = {
          src: blob,
          type: getMimeType(e.target.result, files.type),
        }
      }
      reader.readAsArrayBuffer(files);
    },
    crop() {
			const { canvas } = this.$refs.cropper.getResult();
			canvas.toBlob(async (blob) => {
        this.FileFotoProfil = blob
        let uploadFotoProfil = await this.uploadLampiran(this.idBiodata, this.FileFotoProfil)
        if(uploadFotoProfil != undefined){
          this.tutupDialogCrop()
          this.getKeanggotaan({page: this.page, limit: this.limit, keyword: this.searchData, filter: `${this.filterby}-${this.filterforby}`, sorting: this.kumpulSort});
          this.notifikasi("success", "Berhasil ubah Foto Profile", "2")
        }else{ 
          this.componentKey++;
          this.tutupDialogCrop()
          this.notifikasi("error", 'Gagal ubah Foto Profile', "1")
        }
			}, this.image.type);

		},
    tutupDialogCrop(){
      this.FileFotoProfil = ''
      this.fotoProfil = '';
      this.idBiodata = '';
      this.image = {
        src: null,
        type: null,
      }
      this.$refs.fotoProfile.value = null
      this.$refs.cropper.value = null
      this.dialogCrop = false
    },
    async uploadLampiran(idBiodata, dataUpload) {
			if(dataUpload){
				const bodyData = {
					idUser: idBiodata,
					field: 'fotoprofil',
					nama_folder: idBiodata,
					nama_file: `${idBiodata}-fotoprofil`,
					jenis: "image",
					bagian: "berkas",
					table: "Biodata",
					files: dataUpload,
				};
				try {
					let response = await this.uploadFiles(bodyData);
					return response
				} catch (err) {
					this.notifikasi("error", err.response.data.message, "1")
				}
			}else{
        return undefined
      }
		},
    goToProses() {
      window.location.reload();
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
    getProses() {
      const a = document.createElement("a");
      a.href = this.downloadFile;
      a.download = this.downloadFile.split("/").pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      this.getKeanggotaan({page: this.page, limit: this.limit, keyword: this.searchData, filter: `${this.filterby}-${this.filterforby}`, sorting: this.kumpulSort});
      this.tutupDialog()
      this.dialogNotifikasi = false
      this.dialogImport = false
    },
    lihatFoto(foto) {
      this.fotoprofil = foto
      this.dialogFotoProfil = true
    },
    tutupDialog(){
      clearInterval(this.interval)
      this.query = false
      this.show = false
      this.progress = 0
      this.dataJumlahImport = 0;
      this.dataJumlahImportAvailable = 0;
      this.downloadFile = ''
      this.isLoadingImport = false
      this.dialogImport = false
    },
    updateSort(data) {
      this.sortBy = data
			this.kumpulSort = this.sortBy.map((val) => {
        return `${val.key}-${val.order === 'asc' ? 'ASC' : 'DESC'}`
      }).join(',')
		  this.getKeanggotaan({page: this.page, limit: this.limit, keyword: this.searchData, filter: `${this.filterby}-${this.filterforby}`, sorting: this.kumpulSort});
		},
    clickrow(event, data) {
      const index = this.$data.expanded.find(i => i === data?.item?.raw?.idBiodata);
      if(typeof index === 'undefined') return this.$data.expanded = [];
      this.$data.expanded.splice(0, 1)
      this.$data.expanded.push(data?.item?.raw?.idBiodata);
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
.listData {
	width: 280px !important;
}
.listDataHapus {
	width: 180px !important;
}
.table-header {
  font-weight: bold;
  color: white;
  font-size: 9pt;
  text-align: center;
}
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
.avatar {
  border: solid 2px #000;
  border-radius: 20px;
  background: #efeeec;
  align-items: flex-end;
  display: flex;
  justify-content: center;
  line-height: normal;
  position: relative;
  text-align: center;
  vertical-align: middle;
  overflow: hidden;
  width: 250px;
  height: 170px;
  cursor: pointer;
}
.avatar:hover {
  border: solid 2px #000;
  opacity: 0.5;
}

.avatar:hover img {
  position: absolute;
  z-index: 1;
}
.wadahtulisan {
  position: absolute;
  visibility: hidden;
}
.avatar:hover .wadahtulisan {
  border-radius: 5px;
  align-items: center;
  display: flex;
  justify-content: center;
  align-content: flex-end;
  justify-content: space-between;
  position: absolute;
  background: #000000;
  visibility: visible;
  z-index: 100;
  width: 250px;
  height: 40px;
}
.tulisan {
  z-index: 101;
  color: #FFF;
  font-size: 7.5pt;
  font-weight: bold;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 0px 18.5px;
}
.avatarFotoProfil {
  border: solid 2px #000;
  border-radius: 20px;
  background: #efeeec;
  align-items: flex-end;
  display: flex;
  justify-content: center;
  line-height: normal;
  position: relative;
  text-align: center;
  vertical-align: middle;
  overflow: hidden;
  width: 420px;
  height: 340px;
}
.cropper {
  border: double 3px transparent;
  border-radius: 5px;
  background-image: linear-gradient(white, white),
    radial-gradient(circle at top left, #4bc5e8, #9f6274);
  background-origin: border-box;
  background-clip: content-box, border-box;
  min-height: 450px;
  width: auto;
}
.ukuran{
  width: 150px;
}
.textnotif {
  font-size: 9pt !important;
  font-weight: 500 !important;
  color: #272727 !important;
  letter-spacing: normal !important;
  text-align: center !important;
}
</style>