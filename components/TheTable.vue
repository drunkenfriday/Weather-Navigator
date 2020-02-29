<template>
    <table class="table">
        <thead class="thead-light">
            <th>Name</th>
            <th>Max. temp</th>
            <th>Min. temp</th>
            <th>Wind</th>
            <th>Precipitations</th>
            <th>Overcast</th>
        </thead>
        <tbody>
            <Forecast 
            v-for="forecast of forecasts"
            :key="forecast.name"
            :forecast="forecast"/>
        </tbody>
    </table>
</template>

<script>
import Forecast from '../components/Forecast'
export default {
    name: 'TheTable',
    props: {
        forecasts: {
            type: Array,
            default: () => ([])
        }
    },
    components: { Forecast }
}
</script>

<style>
.container {
    margin: 0 !important;
    max-width: max-content;
    padding: 0 !important;
}
.table {
    width: 100vw;
}
</style>