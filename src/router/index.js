import { createRouter, createWebHashHistory } from "vue-router";
import Login from "@/views/Login.vue";
import ForgotPass from "@/views/ForgotPass.vue";

const routes = [
  {
    path: "/",
    name: "LogIn",
    component: Login,
  },
  {
    path: "/forgot-pass",
    name: "ForgotPass",
    component: ForgotPass,
  },
  {
    path: '/',
    component: () => import("@/views/Layout/index.vue"),
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue')
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/Profile.vue')
      },
      {
        path: '/settings',
        name: 'Pengaturan',
        component: () => import('@/views/Settings.vue')
      },
      {
        path: '/notifikasi',
        name: 'Notifikasi',
        component: () => import('@/views/Notifikasi.vue')
      },
      {
        path: '/broadcast',
        name: 'Broadcast',
        component: () => import('@/views/Broadcast.vue')
      },
      {
        path: '/percakapan',
        name: 'Percakapan',
        component: () => import('@/views/Percakapan.vue')
      },
      // {
      //   path: '/testing',
      //   name: 'Testing',
      //   component: () => import('@/views/Testing.vue')
      // },

      {
        path: '/data-administrator',
        name: 'DataAdministrator',
        component: () => import('@/views/page-content/Administrator/V_Administrator.vue')
      },
      {
        path: '/formulir-administrator/:kondisi/:uid',
        name: 'FormulirAdministrator',
        props: true,
        component: () => import('@/views/page-content/Administrator/P_FormAdministrator.vue')
      },
      {
        path: '/data-biodata/:kategori',
        name: 'DataKeanggotaan',
        component: () => import('@/views/page-content/Keanggotaan/V_Keanggotaan.vue')
      },
      {
        path: '/formulir-biodata/:kondisi/:uid',
        name: 'FormulirKeanggotaan',
        props: true,
        component: () => import('@/views/page-content/Keanggotaan/P_FormKeanggotaan.vue')
      },
      {
        path: '/data-pengurus',
        name: 'DataPengurus',
        component: () => import('@/views/page-content/Pengurus/V_Pengurus.vue')
      },
      {
        path: '/data-iuran',
        name: 'DataIuran',
        component: () => import('@/views/page-content/Iuran/V_Iuran.vue')
      },
      {
        path: '/data-komisaris/:kode',
        name: 'DataKomisaris',
        props: true,
        component: () => import('@/views/page-content/Iuran/V_Komisaris.vue')
      },
      {
        path: '/data-detail-iuran/:komisaris_wilayah',
        name: 'DataDetailIuran',
        props: true,
        component: () => import('@/views/page-content/Iuran/V_DetailIuran.vue')
      },
      {
        path: '/rekap-menikah',
        name: 'RekapMenikah',
        component: () => import('@/views/page-content/Rekapitulasi/V_RekapMenikah.vue')
      },
      {
        path: '/rekap-meninggal',
        name: 'RekapMeninggal',
        component: () => import('@/views/page-content/Rekapitulasi/V_RekapMeninggal.vue')
      },
      {
        path: '/rekap-penanggung-jawab',
        name: 'RekapPenanggungJawab',
        component: () => import('@/views/page-content/Rekapitulasi/V_RekapPenanggungJawab.vue')
      },
      {
        path: '/rekap-tugas',
        name: 'RekapTugas',
        component: () => import('@/views/page-content/Rekapitulasi/V_RekapTugas.vue')
      },
      
      {
        path: '/:pathMatch(.*)*',
        name: 'UnderConstruction',
        component: () => import('@/views/Layout/UnderConstruction.vue')
      },
    ]
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
