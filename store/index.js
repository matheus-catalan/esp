export const actions = {
  async nuxtServerInit({ commit, dispatch }, { req, store, $fire }) {
    // try {
    //   let messageRef = $fire.database.ref('environments');

    //   const snapshot = await messageRef.once('value');
    //   let data = snapshot.val();

    //   let environments = Object.keys(data).map(key => ({
    //     name: data[key].name,
    //     node_name: key,
    //     icon: data[key].icon,
    //     last_update: data[key]?.current?.last_update,
    //     current: data[key]?.current,
    //     history: data[key]?.history,
    //   }));

    //   if (Object.keys(store.state.environments.env_current).length === 0) {
    //     commit('environments/setCurrentEnvironment', environments[1]);
    //   }

    //   if (JSON.stringify(store.state.environments.environments) !== JSON.stringify(environments)) {
    //     commit('environments/setEnvironments', environments);
    //   }
    // } catch (error) {
    //   console.error('Erro durante o nuxtServerInit:', error);
    // }
  }
}
