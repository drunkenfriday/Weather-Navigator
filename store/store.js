export const state = () => ({
    forecasts: [],
    options: {
        city: '',
        date: ''
    },
    loading: false,
    waiting: true,
    request: []
})

export const mutations = {
    changeForecasts(state, arr) {
        state.forecasts = arr
    },
    changeRequest(state, arr) {
        state.request = arr
    },
    changeCity(state, str) {
        state.options.city = str
    },
    changeDate(state, str) {
        state.options.date = str
    },
    changeLoading(state, value) {
        state.loading = value
    },
    changeWaiting(state, value) {
        state.waiting = value
    }
}

export const actions = {
    async loadForecasts({ commit, state }) {
            try {
                commit('changeWaiting', false)
                commit('changeLoading', true)
                await this.$axios.$post('http://localhost:5000/', state.options)
            }
            catch (e) {
                console.log(e)
            }
            try {
                let forecasts = await Promise.all (
                    state.request.map(async el => {
                        return await this.$axios.$get(`http://localhost:5000/?${el}`)
                    })
                )
                commit('changeLoading', false)

                forecasts.sort((a, b) => {
                    if (a.name>b.name) {
                        return 1
                    }
                    else {
                        return -1
                    }
                })

                commit ('changeForecasts', forecasts)
            }
            catch(e) {
                console.log(e)
            }
    },
    setOptions({ commit }, obj) {
        commit('changeCity', obj.city)
        commit('changeDate', obj.date)
    },
    setRequest({ commit }, arr) {
        commit('changeRequest', arr)
    },
    setWaiting({ commit }, value) {
        commit('changeWaiting', value)
    }
}

export const getters = {
    getForecasts(state) {
        return state.forecasts
    },
    isLoading(state) {
        return state.loading
    },
    isWaiting(state) {
        return state.waiting
    },
    getOptions(state) {
        return state.options
    },
    getResoursesAmount(state) {
        return state.request.length
    },
    getRequest (state) {
        return state.request
    }
}

