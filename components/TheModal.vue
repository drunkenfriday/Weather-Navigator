<template>
  <div>
    <div @click="onClose" class="bg-fade" tabindex="-1" role="dialog" aria-hidden="true"></div>
    <div>
      <div class="modal-dialog-add" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-center">Get forecasts</h5>
            <button
              v-if="closable"
              type="button"
              class="close"
              @click="onClose()"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="onSubmit()">
              <div class="d-flex flex-row">
                <div class="d-flex flex-column w-50" :class="{ error: inputError}">
                  <p>Choose resources:</p>
                  <div class="resourse" v-for="resourse of resourses" :key="resourse">
                    <input type="checkbox" :value="resourse" v-model="request" />
                    <label for="resourse">{{ resourse }}</label>
                  </div>
                </div>
                <div class="d-flex flex-column w-50">
                  <div class="select-block">
                    <p>Select date:</p>
                    <select class="w-100" v-model="chosenDate" required>
                      <option v-for="date of getDates()" :key="date">{{ date }}</option>
                    </select>
                    <p>
                      <small>You can choose one of 10 next days including today</small>
                    </p>
                  </div>
                  <div class="select-block">
                    <p>Select city:</p>
                    <select v-model="chosenCity" class="w-100" required>
                      <option v-for="city of cities" :key="city">{{ city }}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="d-flex flex-direction-row justify-content-center btn-container">
                <button class="btn btn-dark" type="submit">Get forecasts</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TheModal",
  data: () => ({
    chosenCity: "",
    chosenDate: "",
    request: [],
    today: new Date(),
    inputError: false
  }),
  props: {
    cities: Array,
    resourses: Array,
    closable: Boolean
  },
  methods: {
    onClose() {
      if (this.closable === true) {
        this.$emit("close");
      }
    },
    onSubmit() {
      if (this.request.length === 0) {
        this.inputError = true;
        return;
      }
      if (!this.getDates().includes(this.chosenDate)) {
        return;
      }
      if (!this.cities.includes(this.chosenCity)) {
        return;
      }

      this.inputError = false;

      this.$emit("get", this.chosenCity, this.chosenDate, this.request);
    },
    getDates() {
      let dates = [],
        today = new Date()

      for (let i = 0; i < 10; i++) {
        let currentDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + i
        );
        let day, month;
        if (currentDate.getMonth() < 10) {
          month = `0${currentDate.getMonth() + 1}`;
        } else {
          month = currentDate.getMonth() + 1;
        }

        if (currentDate.getDate() < 10) {
          day = `0${currentDate.getDate()}`;
        } else {
          day = currentDate.getDate();
        }

        let correctDate = `${currentDate.getFullYear()}-${month}-${day}`;
        dates.push(correctDate);
      }

      return dates;
    }
  }
};
</script>

<style>
.error::after {
  content: "You have to choose at least one resourse";
  color: red;
}
.modal-dialog-add {
  z-index: 1001;
  opacity: 100%;
  max-width: 100%;
  position: fixed;
  left: 25%;
  top: 5%;
  width: 50%;
}
.form-group {
  margin: 10px;
}
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

.select-block {
  margin-bottom: 15px;
}

.btn-container {
  margin-top: 20px;
}
</style>
