<template>
  <div id="app">
    <v-app id="inspire" background-color="#F2F2F2">
      <v-main style="background-color: #D9D9D9;">
        <v-navigation-drawer permanent color="#262626" mini-variant-width="56" app v-model="drawer"
          :mini-variant.sync="mini" dark>
          <v-list dense nav>
            <v-list-item @click.stop="toggleMini">
              <v-list-item-action>
                <v-icon>mdi-menu</v-icon>
              </v-list-item-action>
            </v-list-item>

            <v-list-item v-for="item in items" :key="item.title" link :to="item.url">
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>

              <v-list-item-content v-if="!mini">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>

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
        { title: 'Floor Plan', url: '/floor-plan', icon: 'mdi-floor-plan' },
      ],
      environments: [],
      mini: true,
      drawer: null,
      loading: false,
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
  computed: {
  }
};
</script>
