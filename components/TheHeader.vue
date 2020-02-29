<template>
  <header class="navbar navbar-expand-lg navbar-dark bg-dark justify-content-between">
    <span class="navbar-brand">Weather navigator</span>
    <span class="navbar-text text-white options">{{ options.city}} | {{ options.date }} | {{ resourses }} resourсes</span>
    <button @click="onOptions" class="btn btn-outline-light">Options</button>
  </header>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "TheHeader",
  computed: {
    ...mapGetters({
      options: "store/getOptions",
      resourses: "store/getResoursesAmount"
    })
  },
  methods: {
      ...mapActions ({
        changeWaiting: 'store/setWaiting'
      }),
      onOptions(){
         this.changeWaiting(true)
      }
  }
};
</script>

<style>
.options {
    margin-right: 25px;
}
</style>