<template>
  <div>
    <h1 class="subheading grey--text text-decoration-underline">REKAP PARHOBAS ULAON LAS NI ROHA DOHOT HABOT NI ROHA</h1>
    <v-row no-gutters class="pa-2">
      <v-col cols="12" md="3" class="d-flex align-center">
        <Button 
          color-button="light-blue darken-3"
          icon-prepend-button="mdi mdi-plus-thick"
          nama-button="Manage Data"
          size-button="x-small"
          @proses="openDialogManage()"
        />
      </v-col>
      <v-col cols="12" md="9" />
    </v-row>
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
      <v-tabs
        v-model="kategori"
        fixed-tabs
        bg-color="background-dialog-card"
        density="comfortable"
      >
        <v-tab v-for="item in itemsKategori" :key="item.code" :value="item.code">
          <v-icon :icon="item.icon" />
          {{ item.text }}
        </v-tab>
      </v-tabs>
      <v-window v-model="kategori">
        <v-window-item value="menikah">
          <div class="pt-2">
            <v-data-table
              loading-text="Sedang memuat... Harap tunggu"
              no-data-text="Tidak ada data yang tersedia"
              no-results-text="Tidak ada catatan yang cocok ditemukan"
              :headers="headers"
              :loading="loadingtable"
              :items="dataPenanggungJawab"
              item-key="idRekap"
              :items-per-page="500"
              hide-default-header
              hide-default-footer
              class="elavation-3 rounded"
            >
              <!-- header -->
              <template #headers="{  }">
                <tr>
                  <td rowspan="2" class="tableHeader">RAJA PARHATA (PARSINABUNG)</td>
                  <td :colspan="(Number(jumlahBulanTemp) + 1)" class="tableHeader" style="text-align: center;">ANAK MANGOLI / BORU MULI / SULANG2 PAHOMPU<br>{{ `Bulan Per Tahun ${tahun}` }}</td>
                  <!-- <td rowspan="2" class="tableHeader">TOTAL</td> -->
                  <td rowspan="2" class="tableHeader">Aksi</td>
                </tr>
                <tr>
                  <td v-for="index in (Number(jumlahBulanTemp) + 1)" :key="index" class="tableHeader">
                    {{ bulan[index-1] }}
                  </td>
                </tr>
              </template>
              <template #loader>
                <LoaderDataTables />
              </template>
              <template #item="{ item }">
                <tr v-if="item.raw.idRekap !== ''">
                  <td class="tableHeader pl-6">{{ item.raw.nama }}</td>
                  <td v-for="index in (Number(jumlahBulanTemp) + 1)" :key="index" class="tableHeader" :style="item.raw.penanggungjawab !== null ? item.raw.penanggungjawab[conditionValue[index-1].name] === 0 ? 'text-align: center;' : 'text-align: center; background-color: yellow; color: black;' : 'text-align: center;'">
                    {{ item.raw.penanggungjawab !== null ? item.raw.penanggungjawab[conditionValue[index-1].name] === 0 ? 0 : item.raw.penanggungjawab[conditionValue[index-1].name] : '' }}
                  </td>
                  <td class="tableHeader">
                    <v-icon v-if="tahun === now" color="white" icon="mdi mdi-pencil" style="cursor: pointer;" @click="openDialog(item.raw)"/>
                  </td>
                </tr>
                <tr v-else-if="item.raw.kategori === 'Bidang Adat' || item.raw.kategori === 'Penasehat Tetap / Ketua Bidang / Ketua Wilayah'">
                  <td :colspan="(Number(jumlahBulanTemp) + 3)" class="tableHeader text-h6 font-weight-medium pl-3" style="text-align: center;">{{ item.raw.kategori.toUpperCase() }}</td>
                </tr>
                <tr v-else>
                  <td class="tableHeader" style="text-align: center;">{{ `Total Keseluruhan Tahun ${tahun}` }}</td>
                  <td v-for="index in (Number(jumlahBulanTemp) + 1)" :key="index" class="tableHeader" :style="item.raw.penanggungjawab !== null ? item.raw.penanggungjawab[conditionValue[index-1].name] === 0 ? 'text-align: center;' : 'text-align: center; background-color: yellow; color: black;' : 'text-align: center;'">
                    {{ item.raw.penanggungjawab !== null ? item.raw.penanggungjawab[conditionValue[index-1].name] === 0 ? 0 : item.raw.penanggungjawab[conditionValue[index-1].name] : '' }}
                  </td>
                  <td class="tableHeader"></td>
                </tr>
              </template>
              <template #top>
                <v-row no-gutters class="pa-2">
                  <v-col cols="12" md="8" style="font-size: 10pt;" class="text-left d-flex align-center font-weight-bold">
                    {{ `Total Keseluruhan Tahun ${tahun} : ${totalKeseluruhanPenanggungJawabPerTahun === 0 ? 0 : totalKeseluruhanPenanggungJawabPerTahun}` }}<br>
                    {{ `Total Keseluruhan : ${totalKeseluruhanPenanggungJawab === 0 ? 0 : totalKeseluruhanPenanggungJawab}` }}
                  </v-col>
                  <v-col cols="12" md="4" class="text-right">
                    <v-row no-gutters class="pa-2">
                      <v-col cols="12" md="8" class="text-right pr-2">
                        <TextField
                          v-model="searchData"
                          icon-prepend-tf="mdi mdi-magnify"
                          label-tf="Pencarian..."
                          :clearable-tf="true"
                          @click:clear="() => {
                            getRekapPenanggungJawab({ kategori: kategori, tahun: tahun, keyword: '' })
                          }"
                          @keyup.enter="() => {
                            getRekapPenanggungJawab({ kategori: kategori, tahun: tahun, keyword: searchData })
                          }"
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
          </div>
        </v-window-item>
        <v-window-item value="meninggal">
          <div class="pt-2">
            <v-data-table
              loading-text="Sedang memuat... Harap tunggu"
              no-data-text="Tidak ada data yang tersedia"
              no-results-text="Tidak ada catatan yang cocok ditemukan"
              :headers="headers"
              :loading="loadingtable"
              :items="dataPenanggungJawab"
              item-key="idRekap"
              :items-per-page="500"
              hide-default-header
              hide-default-footer
              class="elavation-3 rounded"
            >
              <!-- header -->
              <template #headers="{  }">
                <tr>
                  <td rowspan="2" class="tableHeader">RAJA PARHATA (PARSINABUNG)</td>
                  <td :colspan="(Number(jumlahBulanTemp) + 1)" class="tableHeader" style="text-align: center;">HABOT NI ROHA<br>{{ `Bulan Per Tahun ${tahun}` }}</td>
                  <!-- <td rowspan="2" class="tableHeader">TOTAL</td> -->
                  <td rowspan="2" class="tableHeader">Aksi</td>
                </tr>
                <tr>
                  <td v-for="index in (Number(jumlahBulanTemp) + 1)" :key="index" class="tableHeader">
                    {{ bulan[index-1] }}
                  </td>
                </tr>
              </template>
              <template #loader>
                <LoaderDataTables />
              </template>
              <template #item="{ item }">
                <tr v-if="item.raw.idRekap !== ''">
                  <td class="tableHeader pl-6">{{ item.raw.nama }}</td>
                  <td v-for="index in (Number(jumlahBulanTemp) + 1)" :key="index" class="tableHeader" :style="item.raw.penanggungjawab !== null ? item.raw.penanggungjawab[conditionValue[index-1].name] === 0 ? 'text-align: center;' : 'text-align: center; background-color: yellow; color: black;' : 'text-align: center;'">
                    {{ item.raw.penanggungjawab !== null ? item.raw.penanggungjawab[conditionValue[index-1].name] === 0 ? 0 : item.raw.penanggungjawab[conditionValue[index-1].name] : '' }}
                  </td>
                  <td class="tableHeader">
                    <v-icon v-if="tahun === now" color="white" icon="mdi mdi-pencil" style="cursor: pointer;" @click="openDialog(item.raw)"/>
                  </td>
                </tr>
                <tr v-else-if="item.raw.kategori === 'Bidang Adat' || item.raw.kategori === 'Penasehat Tetap / Ketua Bidang / Ketua Wilayah'">
                  <td :colspan="(Number(jumlahBulanTemp) + 3)" class="tableHeader text-h6 font-weight-medium pl-3" style="text-align: center;">{{ item.raw.kategori.toUpperCase() }}</td>
                </tr>
                <tr v-else>
                  <td class="tableHeader" style="text-align: center;">{{ `Total Keseluruhan Tahun ${tahun}` }}</td>
                  <td v-for="index in (Number(jumlahBulanTemp) + 1)" :key="index" class="tableHeader" :style="item.raw.penanggungjawab !== null ? item.raw.penanggungjawab[conditionValue[index-1].name] === 0 ? 'text-align: center;' : 'text-align: center; background-color: yellow; color: black;' : 'text-align: center;'">
                    {{ item.raw.penanggungjawab !== null ? item.raw.penanggungjawab[conditionValue[index-1].name] === 0 ? 0 : item.raw.penanggungjawab[conditionValue[index-1].name] : '' }}
                  </td>
                  <td class="tableHeader"></td>
                </tr>
              </template>
              <template #top>
                <v-row no-gutters class="pa-2">
                  <v-col cols="12" md="8" style="font-size: 10pt;" class="text-left d-flex align-center font-weight-bold">
                    {{ `Total Keseluruhan Tahun ${tahun} : ${totalKeseluruhanPenanggungJawabPerTahun === 0 ? 0 : totalKeseluruhanPenanggungJawabPerTahun}` }}<br>
                    {{ `Total Keseluruhan : ${totalKeseluruhanPenanggungJawab === 0 ? 0 : totalKeseluruhanPenanggungJawab}` }}
                  </v-col>
                  <v-col cols="12" md="4" class="text-right">
                    <v-row no-gutters class="pa-2">
                      <v-col cols="12" md="8" class="text-right pr-2">
                        <TextField
                          v-model="searchData"
                          icon-prepend-tf="mdi mdi-magnify"
                          label-tf="Pencarian..."
                          :clearable-tf="true"
                          @click:clear="() => {
                            getRekapPenanggungJawab({ kategori: kategori, tahun: tahun, keyword: '' })
                          }"
                          @keyup.enter="() => {
                            getRekapPenanggungJawab({ kategori: kategori, tahun: tahun, keyword: searchData })
                          }"
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
          </div>
        </v-window-item>
      </v-window>
    </v-card>
    <v-dialog
      v-model="DialogPenanggungJawab"
			scrollable
			persistent
			transition="dialog-bottom-transition"
			width="auto"
    >
			<v-card color="background-dialog-card">
				<v-toolbar color="surface">
					<v-toolbar-title>Ubah Data Penanggung Jawab {{ uppercaseLetterFirst(kategori) }}</v-toolbar-title>
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
								v-model="detailPenanggungJawab.nama"
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
								v-model="detailPenanggungJawab.penanggungjawab.januari"
								label-tf="Januari"
                @keypress="onlyNumber($event, 2, detailPenanggungJawab.penanggungjawab.januari)"
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
								v-model="detailPenanggungJawab.penanggungjawab.februari"
								label-tf="Februari"
                @keypress="onlyNumber($event, 2, detailPenanggungJawab.penanggungjawab.februari)"
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
								v-model="detailPenanggungJawab.penanggungjawab.maret"
								label-tf="Maret"
                @keypress="onlyNumber($event, 2, detailPenanggungJawab.penanggungjawab.maret)"
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
								v-model="detailPenanggungJawab.penanggungjawab.april"
								label-tf="April"
                @keypress="onlyNumber($event, 2, detailPenanggungJawab.penanggungjawab.april)"
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
								v-model="detailPenanggungJawab.penanggungjawab.mei"
								label-tf="Mei"
                @keypress="onlyNumber($event, 2, detailPenanggungJawab.penanggungjawab.mei)"
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
								v-model="detailPenanggungJawab.penanggungjawab.juni"
								label-tf="Juni"
                @keypress="onlyNumber($event, 2, detailPenanggungJawab.penanggungjawab.juni)"
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
								v-model="detailPenanggungJawab.penanggungjawab.juli"
								label-tf="Juli"
                @keypress="onlyNumber($event, 2, detailPenanggungJawab.penanggungjawab.juli)"
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
								v-model="detailPenanggungJawab.penanggungjawab.agustus"
								label-tf="Agustus"
                @keypress="onlyNumber($event, 2, detailPenanggungJawab.penanggungjawab.agustus)"
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
								v-model="detailPenanggungJawab.penanggungjawab.september"
								label-tf="September"
                @keypress="onlyNumber($event, 2, detailPenanggungJawab.penanggungjawab.september)"
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
								v-model="detailPenanggungJawab.penanggungjawab.oktober"
								label-tf="Oktober"
                @keypress="onlyNumber($event, 2, detailPenanggungJawab.penanggungjawab.oktober)"
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
								v-model="detailPenanggungJawab.penanggungjawab.november"
								label-tf="November"
                @keypress="onlyNumber($event, 2, detailPenanggungJawab.penanggungjawab.november)"
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
								v-model="detailPenanggungJawab.penanggungjawab.desember"
								label-tf="Desember"
                @keypress="onlyNumber($event, 2, detailPenanggungJawab.penanggungjawab.desember)"
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
							class="text-start d-flex align-center font-weight-bold"
							cols="12"
              md="6"
            >
              {{ `TOTAL : ${detailPenanggungJawab.penanggungjawab.total === 0 ? 0 : detailPenanggungJawab.penanggungjawab.total}` }}
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
      v-model="DialogUbahData"
			scrollable
			persistent
			transition="dialog-bottom-transition"
			width="auto"
    >
			<v-card color="background-dialog-card">
				<v-toolbar color="surface">
					<v-toolbar-title>Manage Data Penanggung Jawab</v-toolbar-title>
					<v-spacer />
					<v-toolbar-items>
						<Button
							variant="plain"
							color-button="#ffffff"
							icon-button="mdi mdi-close"
							model-button="comfortable"
							size-button="large"
							@proses="() => { DialogUbahData = false; page = 1; limit = 20; searchData2 = '' }"
						/>
					</v-toolbar-items>
				</v-toolbar>
				<v-card-text class="pt-4 v-dialog--custom">
          <v-data-table
            loading-text="Sedang memuat... Harap tunggu"
            no-data-text="Tidak ada data yang tersedia"
            no-results-text="Tidak ada catatan yang cocok ditemukan"
            :headers="headersManage"
            :loading="loadingtable"
            :items="DataManage"
            expand-on-click
            item-value="idRekap"
            density="comfortable"
            hide-default-footer
            hide-default-header
            class="elavation-3 rounded"
            :items-per-page="itemsPerPage"
            @page-count="pageCount = $event"
            @click:row="clickrow"
            v-model:expanded="expanded"
          >
            <!-- header -->
            <template #headers="{ columns }">
              <tr>
                <td v-for="header in columns" :key="header.title" class="tableHeader">{{ header.title.toUpperCase() }}</td>
              </tr>
            </template>
            <template #loader>
              <LoaderDataTables />
            </template>
            <template #[`item.number`]="{ item }">
              {{ page > 1 ? ((page - 1)*limit) + item.index + 1 : item.index + 1 }}
            </template>
            <template #expanded-row="{ columns, item }">
              <tr>
                <td :colspan="columns.length">
                  <Button 
                    color-button="#0bd369"
                    icon-prepend-button="mdi mdi-pencil"
                    nama-button="Ubah"
                    size-button="x-small"
                    @proses="openDialogData(item.raw, 1)"
                  />
                  <Button 
                    color-button="#bd3a07"
                    icon-prepend-button="mdi mdi-delete"
                    nama-button="Hapus"
                    size-button="x-small"
                    @proses="postRecord2(item.raw, 'DELETE')"
                  />
                </td>
              </tr>
            </template>
            <template #bottom />
            <template #top>
              <v-row no-gutters class="pa-2">
                <v-col cols="12" md="6" class="d-flex align-center">
                  <Button 
                    color-button="light-blue darken-3"
                    icon-prepend-button="mdi mdi-plus-thick"
                    nama-button="Tambah"
                    size-button="x-small"
                    @proses="openDialogData(null, 0)"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-row no-gutters>
                    <v-col cols="12" md="9" class="pr-2">
                      <TextField
                        v-model="searchData2"
                        icon-prepend-tf="mdi mdi-magnify"
                        label-tf="Pencarian..."
                        :clearable-tf="true"
                        @click:clear="() => {
                          page = 1
                          getManagePenanggungJawab({page: 1, limit: limit, keyword: ''})
                        }"
                        @keyup.enter="() => {
                          page = 1
                          getManagePenanggungJawab({page: 1, limit: limit, keyword: searchData2})
                        }"
                      />
                    </v-col>
                    <v-col cols="12" md="3" class="d-flex justify-end align-center">
                      <Autocomplete
                        v-model="page"
                        :data-a="pageOptions"
                        label-a="Page"
                        :disabled-a="DataManage.length ? false : true"
                      />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-divider :thickness="2" class="border-opacity-100" color="white" />
            </template>
          </v-data-table>
        </v-card-text>
        <v-divider />
				<v-card-actions>
          <v-row no-gutters>
            <v-col cols="12" lg="9" class="pa-2 d-flex justify-start align-center">
              <span>Halaman <strong>{{ pageSummary.page ? pageSummary.page : 0 }}</strong> dari Total Halaman <strong>{{ pageSummary.totalPages ? pageSummary.totalPages : 0 }}</strong> (Records {{ pageSummary.total ? pageSummary.total : 0 }})</span>
            </v-col>
            <v-col cols="12" lg="3" class="pa-2 text-right">
              <div class="d-flex justify-start align-center">
                <Autocomplete
                  v-model="limit"
                  pilihan-a="select"
                  :data-a="limitPage"
                  label-a="Limit"
                  :disabled-a="DataManage.length ? false : true"
                />
                <Button
                  variant="plain"
                  size-button="large"
                  model-button="comfortable"
                  color-button="#000000"
                  icon-button="mdi mdi-arrow-left-circle-outline"
                  :disabled-button="DataManage.length ? pageSummary.page != 1 ? false : true : true"
                  @proses="() => { page = pageSummary.page - 1 }"
                />
                <Button
                  variant="plain"
                  size-button="large"
                  model-button="comfortable"
                  color-button="#000000"
                  icon-button="mdi mdi-arrow-right-circle-outline"
                  :disabled-button="DataManage.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
                  @proses="() => { page = pageSummary.page + 1 }"
                />
              </div>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="DialogManage"
			scrollable
			persistent
			transition="dialog-bottom-transition"
			width="auto"
    >
			<v-card color="background-dialog-card">
				<v-toolbar color="surface">
					<v-toolbar-title>{{editedIndex == 0 ? 'Tambah' : editedIndex == 1 ? 'Ubah' : 'View'}} Data Manage Penanggung Jawab</v-toolbar-title>
					<v-spacer />
					<v-toolbar-items>
						<Button
							variant="plain"
							color-button="#ffffff"
							icon-button="mdi mdi-close"
							model-button="comfortable"
							size-button="large"
							@proses="tutupDialog()"
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
							Kategori
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
              <Autocomplete
                v-model="inputManage.kategori"
                :data-a="itemsKategoriManage"
                item-title="text"
                item-value="code"
                label-a="Kategori"
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
							Nama Penanggung Jawab
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<TextField
								v-model="inputManage.nama"
								label-tf="Nama Penanggung Jawab"
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
								v-if="editedIndex == 0"
								color-button="black"
								nama-button="Simpan Data"
								:disabled-button="kondisiTombol"
								@proses="postRecord2(null, 'ADD')"
							/>
							<Button 
								v-if="editedIndex == 1"
								color-button="black"
								nama-button="Ubah Data"
								:disabled-button="kondisiTombol"
								@proses="postRecord2(null, 'EDIT')"
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
  name: 'DataPenanggungJawab',
  components: {
    PopUpNotifikasi,
  },
  data: () => ({
    dataPenanggungJawab: [],
    jumlahBulanTemp: 12,
    now: new Date().getFullYear(),
    tahun: new Date().getFullYear(),
    // bulan: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
    bulan: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des', 'Total'],
    conditionValue: [],
		searchData: '',
		kategori: 'menikah',
    detailPenanggungJawab: {
      idRekap: '',
      nama: '',
      penanggungjawab: {
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
        desember: 0,
        total: 0
      },
      totalPenanggungJawab: 0,
    },
    totalKeseluruhanPenanggungJawab: 0,
    totalKeseluruhanPenanggungJawabPerTahun: 0,
    DialogPenanggungJawab: false,
    DialogUbahData: false,
    headers: [
      { title: "RAJA PARHATA (PARSINABUNG)", key: "nama", sortable: false, width: "20%" },
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
    itemsKategori: [
			{code: 'menikah', text: 'Menikah', icon: 'mdi mdi-view-list'},
			{code: 'meninggal', text: 'Meninggal', icon: 'mdi mdi-view-list'},
		],
    itemsKategoriManage: [
			{code: 'Bidang Adat', text: 'Bidang Adat'},
			{code: 'Penasehat Tetap / Ketua Bidang / Ketua Wilayah', text: 'Penasehat Tetap / Ketua Bidang / Ketua Wilayah'},
		],
		expanded: [],
		DataManage: [],
    searchData2: '',
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
		headersManage: [
      { title: "NO", key: "number", sortable: false, width: "5%" },
      { title: "#", key: "data-table-expand", sortable: false, width: "5%" },
      { title: "KATEGORI", key: "kategori", sortable: false },
      { title: "NAMA", key: "nama", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    DialogManage: false,
		kondisiTombol: true,
		editedIndex: 0,
		inputManage: {
			idRekap: '',
			kategori: null,
			nama: '',
		},

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Detail Penanggung Jawab",
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
      rekappenanggungjawabAll: 'user/rekappenanggungjawabAll', 
      managepenanggungjawabAll: 'user/managepenanggungjawabAll', 
    }),
    tahunOptions(){
      let tahun = []
      for (let index = 2024; index <= Number(this.now); index++) {
        tahun.push(index)
      }
      return tahun
    },
  },
  watch: {
    rekappenanggungjawabAll: {
			deep: true,
			async handler(value) {
        if(value === null) {
          this.dataPenanggungJawab = []
          this.totalKeseluruhanPenanggungJawab = 0
          this.totalKeseluruhanPenanggungJawabPerTahun = 0
          this.notifikasi("warning", "Data Tidak Ditemukan", "1")
        }
        this.conditional();
        this.dataPenanggungJawab = value.result
        this.totalKeseluruhanPenanggungJawab = value.totalKeseluruhanPenanggungJawab
        this.totalKeseluruhanPenanggungJawabPerTahun = value.totalKeseluruhanPenanggungJawabPerTahun
      }
    },
    managepenanggungjawabAll: {
			deep: true,
			handler(value) {
        this.pageOptions = []
        this.DataManage = value.records
				this.pageSummary = {
					page: this.DataManage.length ? value.pageSummary.page : 0,
					limit: this.DataManage.length ? value.pageSummary.limit : 0,
					total: this.DataManage.length ? value.pageSummary.total : 0,
					totalPages: this.DataManage.length ? value.pageSummary.totalPages : 0
				}
        for (let index = 1; index <= this.pageSummary.totalPages; index++) {
          this.pageOptions.push(index)
        }
      }
		},
    inputManage: {
      deep: true,
      handler(value){
				if(value.nama == null){ this.inputManage.nama = '' }
        
        if(value.kategori != null && value.nama != ''){
          this.kondisiTombol = false
        }else{
          this.kondisiTombol = true
        }
      }
    },
    detailPenanggungJawab: {
			deep: true,
			async handler(value) {
        this.detailPenanggungJawab.penanggungjawab.total = Number(value.penanggungjawab.januari) + Number(value.penanggungjawab.februari) + Number(value.penanggungjawab.maret)
        + Number(value.penanggungjawab.april) + Number(value.penanggungjawab.mei) + Number(value.penanggungjawab.juni) + Number(value.penanggungjawab.juli) + Number(value.penanggungjawab.agustus)
        + Number(value.penanggungjawab.september) + Number(value.penanggungjawab.oktober) + Number(value.penanggungjawab.november) + Number(value.penanggungjawab.desember);
      }
    },
    tahun: {
			deep: true,
			async handler(value) {
        this.getRekapPenanggungJawab({ kategori: this.kategori, tahun: value, keyword: this.searchData })
      }
    },
    kategori:{
      deep: true,
			handler(value){
        this.searchData = ''
        this.getRekapPenanggungJawab({ kategori: value, tahun: this.tahun, keyword: this.searchData })
			}
		},
    page: {
			deep: true,
			handler(value) {
        if(value){
          this.getManagePenanggungJawab({page: value, limit: this.limit, keyword: this.searchData2})
        }
			}
		},
    limit: {
			deep: true,
			handler(value) {
        this.page = 1
				this.getManagePenanggungJawab({page: 1, limit: value, keyword: this.searchData2})
			}
		},
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    this.getRekapPenanggungJawab({ kategori: this.kategori, tahun: this.tahun, keyword: this.searchData })
	},
	methods: {
    ...mapActions({
      fetchData: 'fetchData',
      getRekapPenanggungJawab: "user/getRekapPenanggungJawab", 
      getManagePenanggungJawab: "user/getManagePenanggungJawab", 
    }),
    conditional(){
      this.conditionValue = []
      let bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember', 'Total']
      for (let index = 0; index < (Number(this.jumlahBulanTemp) + 1); index++) {
        this.conditionValue.push({
          name: bulan[index].toLowerCase(),
        })
      }
    },
    openDialog(item){
      this.detailPenanggungJawab = {
        idRekap: item.idRekap,
        nama: item.nama,
        penanggungjawab: {
          januari: item.penanggungjawab.januari,
          februari: item.penanggungjawab.februari,
          maret: item.penanggungjawab.maret,
          april: item.penanggungjawab.april,
          mei: item.penanggungjawab.mei,
          juni: item.penanggungjawab.juni,
          juli: item.penanggungjawab.juli,
          agustus: item.penanggungjawab.agustus,
          september: item.penanggungjawab.september,
          oktober: item.penanggungjawab.oktober,
          november: item.penanggungjawab.november,
          desember: item.penanggungjawab.desember,
          total: item.penanggungjawab.januari + item.penanggungjawab.februari + item.penanggungjawab.maret + item.penanggungjawab.april + item.penanggungjawab.mei + item.penanggungjawab.juni + item.penanggungjawab.juli + item.penanggungjawab.agustus
          + item.penanggungjawab.september + item.penanggungjawab.oktober + item.penanggungjawab.november + item.penanggungjawab.desember,
        },
        totalPenanggungJawab: item.totalPenanggungJawab,
      }
      this.DialogPenanggungJawab = true
    },
    postRecord(){
      let bodyData = {
        idRekap: this.detailPenanggungJawab.idRekap,
        tahun: String(this.tahun),
        kategori: this.kategori,
        jenis: 'ubahnilai',
        penanggungjawab: {
          tahun: String(this.tahun),
          penanggungjawab: {
            januari: Number(this.detailPenanggungJawab.penanggungjawab.januari),
            februari: Number(this.detailPenanggungJawab.penanggungjawab.februari),
            maret: Number(this.detailPenanggungJawab.penanggungjawab.maret),
            april: Number(this.detailPenanggungJawab.penanggungjawab.april),
            mei: Number(this.detailPenanggungJawab.penanggungjawab.mei),
            juni: Number(this.detailPenanggungJawab.penanggungjawab.juni),
            juli: Number(this.detailPenanggungJawab.penanggungjawab.juli),
            agustus: Number(this.detailPenanggungJawab.penanggungjawab.agustus),
            september: Number(this.detailPenanggungJawab.penanggungjawab.september),
            oktober: Number(this.detailPenanggungJawab.penanggungjawab.oktober),
            november: Number(this.detailPenanggungJawab.penanggungjawab.november),
            desember: Number(this.detailPenanggungJawab.penanggungjawab.desember),
            total: Number(this.detailPenanggungJawab.penanggungjawab.total),
          }
        }
      }
      // return console.log(bodyData);
      this.$store.dispatch('user/postRekapPenanggungJawab', bodyData)
      .then((res) => {
        this.closeDialog()
        this.getRekapPenanggungJawab({ kategori: this.kategori, tahun: this.tahun, keyword: this.searchData })
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    openDialogManage(){
      this.getManagePenanggungJawab({page: this.page, limit: this.limit, keyword: this.searchData2})
      this.DialogUbahData = true
    },
    openDialogData(item, index){
      this.editedIndex = index
      if(index == 0){
        this.inputManage = {
          idRekap: '',
          kategori: null,
          nama: '',
        }
      }else{
        this.inputManage = {
          idRekap: item.idRekap,
          kategori: item.kategori,
          nama: item.nama,
        }
      }
      this.DialogManage = true
    },
    tutupDialog(){
			this.inputManage = {
        idRekap: '',
        kategori: null,
        nama: '',
      }
			this.DialogManage = false
		},
    postRecord2(item = null, jenis){
      let bodyData = {
				ADDEDIT: {
          type: jenis,
          jenis: 'ubahdata',
          idRekap: jenis === 'ADD' ? '' : this.inputManage.idRekap,
          kategori: this.inputManage.kategori,
          nama: this.inputManage.nama,
        },
				DELETE: {
          jenis: 'ubahdata',
					type: jenis,
					idRekap: item?.idRekap,
				}
      }
      // return console.log(bodyData);
      this.$store.dispatch('user/postRekapPenanggungJawab', jenis === 'ADD' || jenis === 'EDIT' ? bodyData.ADDEDIT : bodyData.DELETE)
      .then((res) => {
        this.tutupDialog()
        this.closeDialog()
        this.getManagePenanggungJawab({page: this.page, limit: this.limit, keyword: this.searchData2})
        this.getRekapPenanggungJawab({ kategori: this.kategori, tahun: this.tahun, keyword: this.searchData })
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    closeDialog(){
      this.detailPenanggungJawab = {
        idRekap: '',
        nama: '',
        penanggungjawab: {
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
          desember: 0,
          total: 0,
        },
        totalPenanggungJawab: 0,
      }
      this.totalKeseluruhanPenanggungJawab = 0
      this.totalKeseluruhanPenanggungJawabPerTahun = 0
      this.DialogPenanggungJawab = false
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
.tableHeader {
  font-weight: bold;
  color: white;
  font-size: 7.5pt;
  border-bottom: 2px solid white;
}
</style>