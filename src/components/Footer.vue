<template>
	<v-footer dark padless app inset class="text-center d-flex flex-column" style="position: fixed;">
		<span class="textNamaSekolah">{{ `©${new Date().getFullYear()} | ${namaWebsite} (${singkatanWebsite})` }}</span>
	</v-footer>
</template>
<script>
export default {
	props: {
    namaWebsite: {
      type: String,
      default: null
    },
    singkatanWebsite: {
      type: String,
      default: null
    },
  },
	data: () => ({
	}),
}
</script>