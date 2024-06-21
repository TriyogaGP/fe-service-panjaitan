<template>
  <div>
    <organization-chart
      :datasource="data"
      @node-click="selectNode"
    ></organization-chart>
      <!-- zoom
      zoomin-limit="0"
      zoomout-limit="1" -->
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
import { mapActions, mapState, mapGetters } from "vuex";
import { useMeta } from 'vue-meta'
import OrganizationChart from 'vue3-organization-chart'
import 'vue3-organization-chart/dist/orgchart.css'
import PopUpNotifikasi from "../../Layout/PopUpNotifikasi.vue";
export default {
  name: 'DataPengurus',
  components: {
    PopUpNotifikasi,
    OrganizationChart
  },
  data: () => ({
    roleID: '',
    BASE_URL: '',

    data: {
      'id': '1',
      'name': 'St. Trimedya Panjaitan, SH, MH/br.Marpaung',
      'title': 'Ketua Umum',
      'children': [
        { 'id': '2', 'name': 'Ir. Gustav Panjaitan/br.Hutauruk', 'title': 'Penasehat Tetap',
          'children': [
            { 'id': '2', 'name': 'Drs. M. Johnson Panjaitan/br.Siahaan (+)', 'title': 'Penasehat Tetap',
              'children': [
                { 'id': '2', 'name': 'Drs. Djujung Panjaitan (+)/br.Sirait (+)', 'title': 'Penasehat Tetap',
                  'children': [
                    { 'id': '2', 'name': 'Kiraman Panjaitan/br.Sinaga', 'title': 'Penasehat Tetap',
                      'children': [
                        { 'id': '2', 'name': 'Farel Panjaitan/br.Pardede', 'title': 'Penasehat Tetap',
                          'children': [
                            { 'id': '2', 'name': 'Drs. Karim Panjaitan, MM/br.Hutauruk', 'title': 'Penasehat Tetap' },
                          ]
                        },
                      ]
                    },
                  ]
                },
              ]
            },
          ]
        },
        { 'id': '2', 'name': 'Drs. Emil R. Panjaitan, MM/br.Pangaribuan', 'title': 'Ketua Penasehat Periodik',
          'children': [
            { 'id': '2', 'name': 'Bahder Napitupulu, SE, MBA/br.Panjaitan', 'title': 'Sekretaris Penasehat Periodik' },
          ]
        },
        { 'id': '2', 'name': 'St.Wilson Panjaitan.SE/br.Purba', 'title': 'Sekretaris Umum',
          'children': [
            { 'id': '2', 'name': 'Herbert Panjaitan/br.Marpaung', 'title': 'Wakil Sekretaris Umum' },
          ]
        },
        { 'id': '2', 'name': 'Ir.Pestamen Situmorang, MA/br.Panjaitan', 'title': 'Bendahara Umum',
          'children': [
            { 'id': '2', 'name': 'David Panjaitan/br.Simanjuntak', 'title': 'Wakil Bendahara Umum' },
          ]
        },
        { 'id': '2', 'name': 'Drs.Bangkit Tua Panjaitan/br.Napitupulu', 'title': 'Wakil Ketua Umum I Bidang Adat, Penelitian & Pengembangan, Hubungan antar Lembaga',
          'children': [
            { 'id': '10', 'name': 'Kol. Laut (Purn) Nelson Panjaitan/br.Siregar', 'title': 'Ketua Bidang Adat',
              'children': [
                { 'id': '2', 'name': 'St. Manarsar Panjaitan/br.Simanjuntak', 'title': 'Wakil Ketua Bidang Adat' },
                { 'id': '2', 'name': 'St. Taripar Panjaitan, SE, MSi/br.Silitonga', 'title': 'Sekretaris Bidang Adat' },
              ]
            },
            { 'id': '10', 'name': 'St.Dr.James Panjaitan/br.Saing', 'title': 'Ketua Bidang Penelitian Dan Pengembangan',
              'children': [
                { 'id': '2', 'name': 'St.Ir.Junifer Panjaitan, MM/br.Hutagalung', 'title': 'Wakil Ketua Bidang Penelitian Dan Pengembangan' },
                { 'id': '2', 'name': 'Bently Tobing, ST, MBA/br.Panjaitan', 'title': 'Sekretaris Bidang Penelitian Dan Pengembangan' },
              ]
            },
            { 'id': '10', 'name': 'Gokma R. Panjaitan, SE, MSi/br.Tampubolon', 'title': 'Ketua Bidang Hubungan Antar Lembaga',
              'children': [
                { 'id': '2', 'name': 'Drs Junus Panjaitan/br.Rajagukguk', 'title': 'Wakil Ketua Bidang Hubungan Antar Lembaga' },
                { 'id': '2', 'name': 'Brigjen Pol Drs. Toga.H.Panjaitan/br.Sipayung', 'title': 'Sekretaris Bidang Hubungan Antar Lembaga' },
              ]
            },
          ]
        },
        { 'id': '2', 'name': 'St.Drs.Martua Panjaitan/br.Purba', 'title': 'Wakil Ketua Umum II Bidang Sosial & Pembangunan, Usaha, Advokasi & Hukum',
          'children': [
            { 'id': '10', 'name': 'Dr. Horas Panjaitan, SE, MM/br.Tambunan', 'title': 'Ketua Bidang Bidang Sosial & Pembangunan',
              'children': [
                { 'id': '2', 'name': 'Pandapotan Sinaga, SE, MM/br.Panjaitan', 'title': 'Wakil Ketua Bidang Bidang Sosial & Pembangunan' },
                { 'id': '2', 'name': 'Domincian Panjaitan, SH, MM/br.Siahaan', 'title': 'Sekretaris Bidang Bidang Sosial & Pembangunan' },
              ]
            },
            { 'id': '10', 'name': 'Henry Panjaitan, SE/br.Siahaan', 'title': 'Ketua Bidang Usaha',
              'children': [
                { 'id': '2', 'name': 'Edison Panjaitan, SH/br.Hutauruk', 'title': 'Wakil Ketua Bidang Usaha' },
                { 'id': '2', 'name': 'Hatorangan Panjaitan, SE, MSi/br.Siahaan', 'title': 'Sekretaris Bidang Usaha' },
              ]
            },
            { 'id': '10', 'name': 'Pance Daniel Panjaitan, A.Md, IP, SH, MM/br.Tambunan', 'title': 'Ketua Bidang Advokasi & Hukum',
              'children': [
                { 'id': '2', 'name': 'Budi Panjaitan, SH, MH/br.Napitupulu', 'title': 'Wakil Ketua Bidang Advokasi & Hukum' },
                { 'id': '2', 'name': 'Rudy W. Panjaitan, SH, MH/br.Siahaan', 'title': 'Sekretaris Bidang Advokasi & Hukum' },
              ]
            },
          ]
        },
        { 'id': '2', 'name': 'Toga Tua Raja Panjaitan.SE/br.Sinaga', 'title': 'Wakil Ketua Umum III Bidang Pendidikan, Hubungan Masyarakat, Seni Budaya & Kerohanian, PNB Marpadotbe & Olahraga',
          'children': [
            { 'id': '10', 'name': 'Dr. Hulman Panjaitan, SH, MH/br.Siagian', 'title': 'Ketua Bidang Bidang Pendidikan',
              'children': [
                { 'id': '2', 'name': 'Dr.Ir.Mangasi Panjaitan ,ME/br.Siahaan', 'title': 'Wakil Ketua Bidang Bidang Pendidikan' },
                { 'id': '2', 'name': 'Letkol. Laut. Hisar Panjaitan, SSt, MM/br.Marpaung (+)', 'title': 'Sekretaris Bidang Bidang Pendidikan' },
              ]
            },
            { 'id': '10', 'name': 'Jasudin Panjaitan/br.Manurung', 'title': 'Ketua Bidang Hubungan Masyarakat',
              'children': [
                { 'id': '2', 'name': 'Mangara Panjaitan/br.Sinaga', 'title': 'Wakil Ketua Bidang Hubungan Masyarakat' },
                { 'id': '2', 'name': 'Andri Panjaitan, SE, MM/br.Pardede', 'title': 'Sekretaris Bidang Hubungan Masyarakat' },
              ]
            },
            { 'id': '10', 'name': 'Ir.Mukhtar Panjaitan/br.Simanjuntak', 'title': 'Ketua Bidang Seni Budaya & Kerohanian',
              'children': [
                { 'id': '2', 'name': 'Charles Panjaitan, SH/br.Siagian', 'title': 'Wakil Ketua Bidang Seni Budaya & Kerohanian' },
                { 'id': '2', 'name': 'Ev.Alex Monang Panjaitan/br.Sinaga', 'title': 'Sekretaris Bidang Seni Budaya & Kerohanian' },
              ]
            },
            { 'id': '10', 'name': 'Ir.Tarianus Panjaitan/br.Sibarani', 'title': 'Ketua Bidang PNB Marpadotbe & Olahraga',
              'children': [
                { 'id': '2', 'name': 'Petrus J.Muda Panjaitan, ST, MSc/br.Saragih', 'title': 'Wakil Ketua Bidang PNB Marpadotbe & Olahraga' },
                { 'id': '2', 'name': 'Ir. Jimmy Panjaitan/br.Tobing', 'title': 'Sekretaris Bidang PNB Marpadotbe & Olahraga' },
              ]
            },
          ]
        },
      ]
    },
    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Data Pengurus",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
    return { }
  },
  computed: {
		...mapState({
		}),
    ...mapGetters({
    }),
  },
  watch: {
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    this.roleID = localStorage.getItem('roleID')
    this.BASEURL = process.env.VUE_APP_BASE_URL
	},
	methods: {
		...mapActions({
      fetchData: 'fetchData',
    }),
    selectNode(nodeData) {
      alert("node " + nodeData.name + " is selected");
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
.chartOrgchartContainer {
  position: relative !important;
  display: inherit !important;
  border: 3px solid #c12626 !important;
  border-radius: 20px !important;
  overflow: auto !important;
  text-align: center !important;
}
.chartOrgchart {
  box-sizing: border-box !important;
  display: inherit !important;
  padding: 10px !important;
}
.chartNode {
  border: 2px solid #c12626 !important;
  min-width: 200px !important;
  min-height: 100% !important;
}
.chartTitle {
  width: auto !important;
  background: #000 !important;
  padding: 5px !important;
}
.chartContent {
  height: auto !important;      
  padding: 5px !important;
}
.chartContent, .chartTitle {
  white-space: normal !important;
}
.chartDownLine {
  background: #c12626 !important;
}
.chartTopLine {
  border-top-color: #c12626 !important;
}
.chartRightLine {
  border-right-color: #c12626 !important;
}
.chartLeftLine {
  border-left-color: #c12626 !important;
}
</style>