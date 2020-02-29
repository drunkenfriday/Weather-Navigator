<template>
    <tr class="tr">
        <td class="name table-bordered">
            {{ forecast.name }}
        </td>
        <td>
            {{ forecast.maxTemperature }}
        </td>
        <td>
            {{ forecast.minTemperature }}
        </td>
        <td>
            {{ forecast.wind }}
        </td>
        <td>
            {{ forecast.precips }}
        </td>
        <td>
            {{ forecast.overcast }}
        </td>
    </tr>
</template>

<script>
export default {
    name: 'Forecast',
    props: {
        forecast: {
            type: Object,
            required: true
        }
    }
}
</script>

<style>
.name {
    background-color: #fcfafa
}
</style>