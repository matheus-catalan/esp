<template>
  <div id="app">
    <v-app id="inspire" background-color="#F2F2F2">
      <v-main style="background-color: #D9D9D9;" :style="{ padding: show ? '0px 0px 0px 56px' : '0px' }">
        <v-navigation-drawer permanent color="#262626" mini-variant-width="56" app v-model="drawer"
          :mini-variant.sync="mini" dark v-show="show">
          <v-layout fill-height column justify-space-between>

            <v-list dense nav class="mt-5">
              <v-list-item @click.stop="toggleMini" class="d-flex align-center justify-center">
                <v-icon>mdi-menu</v-icon>
              </v-list-item>

              <v-list-item v-for="item in items" :key="item.title" link :to="item.url" @click.stop>
                <v-icon class="my-2 mr-2">{{ item.icon }}</v-icon>

                <v-list-item-content v-if="!mini">
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-spacer></v-spacer>
            </v-list>
          </v-layout>
        </v-navigation-drawer>

        <v-btn icon dark x-small :small="!show" absolute :style="{
          top: show ? '5px' : '35px',
          left: show ? (mini ? '-10px' : '190px') : '10px',
          zIndex: 99999,
          backgroundColor: show ? '#f2f2f2' : '#262626',
          position: 'absolute'
        }" @click.stop="show = !show">
          <v-icon :color="show ? 'black' : '#f2f2f2'" small>
            {{ show ? 'mdi-chevron-left' : 'mdi-menu' }}
          </v-icon>
        </v-btn>


        <v-container fluid class="px-8">
          <Nuxt />
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      title: '',
      items: [
        { title: 'Home', url: '/', icon: 'mdi-home' },
        { title: 'Config', url: '/config', icon: 'mdi-cog' },
        { title: 'Planta Baixa', url: '/floor-plan', icon: 'mdi-floor-plan' },
        { title: 'Relatório', url: '/reports', icon: 'mdi-chart-line' },
      ],
      notifications: 0,
      environments: [],
      mini: true,
      drawer: null,
      loading: false,
      show: true
    };
  },
  async created() {
    this.getEnvironments();
  },
  methods: {
    getEnvironments() {
      this.$axios
        .get('/environments')
        .then((response) => {
          this.environments = response.data;
          this.restoreSelectedEnvironment();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    toggleMini() {
      this.mini = !this.mini;
    },
    restoreSelectedEnvironment() {
      if (process.client) {
        const id = localStorage.getItem('env_selected');
        if (id) {
          this.$store.commit(
            'environments/setCurrentEnvironment', id
          );
        } else {
          this.selectEnvironment(this.environments[0]);
        }
      }
    },
    status(date) {
      return new Date() - new Date(date) < 60000;
    },
    selectEnvironment(item) {
      localStorage.setItem('env_selected', JSON.stringify(item.id));
      this.$store.commit('environments/setCurrentEnvironment', item.id);
    },

  },
  watch: {
    $route() {
      // setTimeout(() => {
      //   this.mini = !this.mini;
      // }, 1000);
    },
  },
};
</script>
