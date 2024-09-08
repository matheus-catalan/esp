export const state = () => ({
  env_current: {},
  environments: [],
  history: [],
  loading: true
})

export const mutations = {
  SET_ENV_CURRENT(state, env) {
    state.env_current = env
  },
  SET_ENVIRONMENTS(state, environments) {
    state.environments = environments
  },
  setCurrentEnvironment(state, env) {
    state.env_current = env
  },
  SET_HISTORY(state, history) {
    state.history = history
  },
  UPDATE_SENSOR_config(state, sensor) {
    state.env_current.sensors.forEach(s => {
      // if(s.id == sensor.id){
      //   s.config = sensor.config
      // }
    })
  },
  SET_LOADING(state, status) {
    state.loading = status
  }
}

export const actions = {
  setCurrentEnvironment({ commit }, env) {
    commit('SET_ENV_CURRENT', env)
  },
  setEnvironmentList({ commit }, environments) {
    commit('SET_ENVIRONMENTS', environments)
  },
  setHistoryList({ commit }, history) {
    commit('SET_HISTORY', history)
  },
  updateSensorConfig({ commit }, sensor) {
    commit('UPDATE_SENSOR_config', sensor)
  },
  setLoading({ commit }, status) {
    commit('SET_LOADING', status)
  }
}
