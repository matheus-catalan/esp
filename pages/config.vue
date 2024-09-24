<template>
  <v-container fluid>
    <NavBar :name="`Configurações`" :show_updated_at="true" />
    <v-row>
      <v-col cols="12" v-if="loading_sensor">
        <v-row>
          <v-col v-for="i in 6" cols="4">
            <v-skeleton-loader :key="i" class="mx-auto" max-width="300" type="card"></v-skeleton-loader>
          </v-col>
        </v-row>
      </v-col>
      <template v-for="(sensor) in sensors" v-else>

        <v-col cols="4" v-if="!sensor.is_internal">
          <CardSensor :sensor_temp="sensor" :is_loading="loadingStatus[sensor.key]" :key="sensor.name" />
        </v-col>
      </template>

      <v-col cols="12" v-if="loading_enviroment">
        <v-row>
          <v-col cols="12">
            <v-skeleton-loader class="mx-10" type="card"></v-skeleton-loader>
          </v-col>
        </v-row>
      </v-col>
      <template v-else>
        <v-col cols="6">
          <v-card class="p-0" rounded="lg" style="height: 100%;">
            <v-card-title class="d-flex align-center justify-center">
              Configurações do dispositivo
            </v-card-title>
            <v-card-text class="my-4 d-flex align-center justify-center text-h5" style="color: black;">
              <v-row>
                <v-col cols="12" class="">
                  <span class="ml-3 text-caption">Nome do dispostivo</span>
                  <v-text-field :value="environment.name" hide-details @change="updateEnvironments({ name: $event })"
                    filled rounded dense></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card class="p-0" rounded="lg" style="height: 100%;">
            <v-card-title class="d-flex align-center justify-center">
              Sistema de notificação do dispositvo

            </v-card-title>
            <v-card-text class="my-4 d-flex align-center justify-center text-h5" style="color: black;">
              <v-row>
                <v-col cols="4" class="d-flex flex-column align-center justify-center text-center text-h6">
                  <v-icon large color="black">mdi-volume-high</v-icon>
                  <span>Sonoro</span>
                  <v-switch :input-value="environment.sound_alert" @change="updateEnvironments({ sound_alert: $event })"
                    hide-details style="margin:0; padding:0"></v-switch>
                </v-col>
                <v-col cols="4" class="d-flex flex-column align-center justify-center text-center text-h6">
                  <v-icon large color="black">mdi-alarm-light</v-icon>
                  <span>Luminoso</span>
                  <v-switch :input-value="environment.light_alert" label=''
                    @change="updateEnvironments({ light_alert: $event })" hide-details
                    style="margin:0; padding:0"></v-switch>
                </v-col>
                <v-col cols="4" class="d-flex flex-column align-center justify-center text-center text-h6">
                  <v-icon large color="black">mdi-bell</v-icon>
                  <span>Notificação</span>
                  <v-switch :input-value="environment.notification_alert" label=''
                    @change="updateEnvironments({ notification_alert: $event })" hide-details
                    style="margin:0; padding:0"></v-switch>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </template>

    </v-row>


  </v-container>
</template>
<script>
import io from 'socket.io-client';

export default {
  name: 'index',
  data() {
    return {
      loading_sensor: true,
      loading_enviroment: true,
      sensors: [],
      environments: [],
      environment: {},
      loadingStatus: {},
      socket: undefined,
    }
  },
  async mounted() {
    this.loading_sensor = true;
    this.loading_enviroment = true;
    await this.getEnvironments();
    await this.setEnvironment();
    this.socket = io(this.$config.sockerUrl);
    this.handlingSocket();
  },
  methods: {
    handlingSocket() {
      if (this.socket == undefined) return
      this.socket.disconnect();
      this.socket.connect();
      this.socket.emit('joinEnvironment', this.environment.key);
      this.socket.on('environmentUpdated', (data) => {
        if (data) {
          this.setSensor(data);
        }
      });
    },
    setSensor(sensor) {
      if (sensor == undefined) return
      this.$set(this.loadingStatus, sensor.key, true);
      let s = this.sensors.find((s) => s.key == sensor.key);
      if (!s) {
        return;
      }

      s.current_value = sensor.current_value;
      s.updatedAt = sensor.updatedAt;
      s.status = sensor.status;
      setTimeout(() => {
        this.$set(this.loadingStatus, sensor.key, false);
      }, 500);
    },
    async getEnvironments() {
      await this.$axios
        .get(`/environments`)
        .then((response) => {
          this.environments = response.data;
          this.setEnvironment()
          this.getSensors();
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

    },
    getSensors() {
      if (this.environment?.id == undefined) return
      this.$axios
        .get(`/environments/${this.environment?.id}`)
        .then((response) => {
          this.loading_sensor = false;
          this.loading_enviroment = false;
          this.sensors = response.data.sensors;
          this.sensors.forEach(sensor => {
            this.$set(this.loadingStatus, sensor.key, true);
            this.$set(this.loadingStatus, sensor.key, false);
          });
        })
        .catch((error) => {
          this.loading_sensor = false;
          console.log(error);
        });
    },
    showForm(key) {
      if (key === 'presence' || key === 'wifi') {
        return false
      }

      return true
    },
    updateEnvironments(payload) {
      this.$axios
        .put(`/environments/${this.environment?.id}`, payload)
        .then((response) => {
          this.$toast.success('Valor alterado com sucesso');
        })
        .catch((error) => {
          this.$toast.error('Erro ao alterar valor');
        });
    },
  },
  computed: {
    env_selected() {
      return this.$store.state.environments.env_current;
    },
  },
  watch: {
    '$store.state.environments.env_current'(newValue, oldValue) {
      this.getEnvironments();
      this.setEnvironment();
      this.handlingSocket();
      this.getSensors();
    }
  },
  beforeDestroy() {
    this.socket.disconnect();
  },
}
</script>
