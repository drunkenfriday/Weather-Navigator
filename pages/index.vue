<template>
  <div class="container">
    <TheTable :forecasts="forecasts" />
    <TheModal
      @get="onGetForecasts"
      @close="onClose"
      :cities="cities"
      :resourses="resourses"
      :closable="isModalClosable"
      v-if="isWaiting"
    />
    <TheLoader v-if="isLoading" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import TheTable from "../components/TheTable.vue";
import TheModal from "../components/TheModal.vue";
import TheLoader from "../components/TheLoader.vue";
export default {
  components: {
    TheTable,
    TheModal,
    TheLoader
  },
  computed: {
    ...mapGetters({
      forecasts: "store/getForecasts",
      isLoading: "store/isLoading",
      isWaiting: "store/isWaiting"
    }),
    isModalClosable: ({ forecasts }) => {
      if (forecasts.length === 0) {
        return false;
      } else {
        return true;
      }
    }
  },
  methods: {
    ...mapActions({
      setRequest: "store/setRequest",
      setOptions: "store/setOptions",
      loadForecasts: "store/loadForecasts",
      changeWaiting: "store/setWaiting"
    }),
    onClose() {
      this.changeWaiting(false);
    },
    onGetForecasts(city, date, request) {
      const options = {
        city: city,
        date: date
      };

      this.setOptions(options);
      this.setRequest(request);
      this.loadForecasts();
    }
  },
  async asyncData({ $axios }) {
    const cities = await $axios.$get("/cities");
    const resourses = await $axios.$get("/resourses");
    return { cities, resourses };
  }
};
</script>

<style>
</style>
