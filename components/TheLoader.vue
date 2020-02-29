<template>
  <div>
    <div class="bg-fade" tabindex="-1" role="dialog" aria-hidden="true"></div>
    <div class="spinner-container d-flex justify-content-center flex-column">
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status"></div>
      </div>
      <div class="d-flex justify-content-center">
        <span>Loading...</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TheLoader"
};
</script>

<style>
.bg-fade {
  position: fixed;
  top: 0;
  left: 0;
  background-color: black;
  opacity: 50%;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
}
.spinner-container {
  background-color: white;
  opacity: 75%;
  position: fixed;
  top: 47%;
  padding: 5px;
  left: 47%;
  z-index: 1001;
  border-radius: 5px;
}
</style>