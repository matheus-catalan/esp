<template>
  <v-row no-gutters align="center" style="display: flex; align-items: center; justify-content: space-between;">
    <div cols="1">
      <v-card class="px-2 py-1 d-flex align-center justify-center" rounded="lg" v-if="loading">
        <v-progress-circular indeterminate></v-progress-circular>
      </v-card>
      <v-menu v-model="menu" :close-on-content-click="true" :nudge-width="200" offset-y rounded="lg" :loading="loading"
        v-else>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="white" v-bind="attrs" v-on="on" rouded-xl>
            <v-avatar color="#D9D9D9" size="30" class="mr-2">
              <v-icon small>{{ environment.icon }}</v-icon>
            </v-avatar>
            {{ environment?.name || 'Selecione um local' }}
          </v-btn>
        </template>

        <v-card>
          <v-list style="max-height: 300px; overflow-y: auto;">
            <template v-for="item in environments">
              <v-list-item @click="selectEnvironment(item)">
                <v-list-item-avatar color="#D9D9D9">
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                  <v-list-item-subtitle>Última atualização: {{ $formatDate(item.updatedAt) }}</v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-row no-gutters align="center" style="height: 100%;">
                    <v-col cols="4" style="display: flex; align-items: center; justify-content: center;">
                      <v-btn icon>
                        <v-icon dark :color="item.status ? 'blue' : 'red'">mdi-database</v-icon>
                      </v-btn>
                    </v-col>

                    <v-col cols="4" style="display: flex; align-items: center; justify-content: center;">
                      <v-btn icon>
                        <v-icon dark :color="item.status ? 'blue' : 'red'">mdi-border-none</v-icon>

                      </v-btn>
                    </v-col>

                    <v-col cols="4" style="display: flex; align-items: center; justify-content: center;">
                      <v-btn icon>
                        <v-icon dark :color="item.status ? 'blue' : 'red'">mdi-database</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-list-item-action>
              </v-list-item>
              <v-divider></v-divider>
            </template>
          </v-list>
        </v-card>
      </v-menu>
    </div>

    <div cols="8" class="text-center">
      <h2>{{ this.name }}</h2>
    </div>

    <div cols="3" v-if="show_updated_at" class="d-flex flex-row align-center justify-center">
      <Notification ref="notification" />
      <v-card class="ml-5 px-2 py-2 text-center text-subtitle-1" :rounded="show_updated ? 'lg' : 'circle'"
        :color="environment.status ? 'success' : 'blue'" @click="show_updated = !show_updated">
        <v-icon :class="{
          'rotate-animation': loading_update
        }" class="px-1">
          {{ loading_update ? 'mdi-refresh' : 'mdi-update' }}
        </v-icon>
        <span v-if="show_updated"> {{ $formatDate(environment.updatedAt) }}</span>
      </v-card>
    </div>
  </v-row>
</template>
<script>
import io from 'socket.io-client';
export default {

  props: {
    name: String,
    show_updated_at: Boolean
  },
  name: 'NavBar',
  data() {
    return {
      show_updated: false,
      menu: false,
      loading: false,
      socket: null,
      environments: [],
      environment: {},
      socket: null,
      loading_update: false
    }
  },
  async mounted() {
    await this.getEnvironments();
    this.socket = io(this.$config.sockerUrl);
    this.handlingSocket();
  },
  methods: {
    handlingSocket() {
      if (this.socket == undefined) return
      this.environments.forEach((env) => {
        this.socket.emit('joinEnvironment', env.key);
      });
      this.socket.emit('joinEnvironment', this.environment.key);
      this.socket.on('environmentUpdated', (data) => {
        if (data) {
          if (this.environment?.id == data.environment?.id) {
            this.loadingUpdate(data)
          }
          this.$refs.notification?.getNotifications();
          this.getEnvironments();
        }
      });
    },
    async getEnvironments() {
      await this.$axios
        .get(`/environments`)
        .then((response) => {
          this.environments = response.data;
          this.setEnvironment();
        })
        .catch((error) => {
        });
    },
    setEnvironment() {
      this.environment = this.environments.find((env) => {
        if (env.id == this.$store.state.environments.env_current) {
          return env
        }
      })

      if (!this.environment) {
        this.environment = this.environments[0]
        this.$store.commit('environments/setCurrentEnvironment', this.environment.id)
      }

    },
    status(date) {
      let now = new Date()
      let updatedAt = new Date(date)
      let diff = now - updatedAt
      if (diff < 60000) {
        return true
      } else {
        return false
      }
    },
    selectEnvironment(item) {
      localStorage.setItem("env_selected", JSON.stringify(item.id))
      this.$store.commit('environments/setCurrentEnvironment', item.id)
      this.environment = item
    },
    loadingUpdate() {
      this.loading_update = true;
      setTimeout(() => {
        this.loading_update = false;
      }, 500);
    }
  },

}
</script>
<style>
.rotate-animation {
  animation: spin 0.5s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
