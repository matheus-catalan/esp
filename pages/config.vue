<template>
  <v-container fluid>
    <NavBar :name="`Configurações`" />
    <v-row>
      <v-col cols="12" v-if="loading_sensor">
        <v-row>
          <v-col v-for="i in 6" cols="4">
            <v-skeleton-loader class="mx-auto" max-width="300" type="card"></v-skeleton-loader>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="4" v-for="(sensor, key) in sensors" :key="key" v-else>
        <CardSensor :sensor_temp="sensor" />
      </v-col>

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
import CardSensor from '../components/CardSensor.vue';

export default {
  name: 'index',
  data() {
    return {
      loading_sensor: true,
      loading_enviroment: true,
      sensors: [],
      environments: [],
      environment: {}

    }
  },
  async mounted() {
    this.loading_sensor = true;
    this.loading_enviroment = true;
    await this.getEnvironments();
    await this.setEnvironment();
    this.socket = io('http://localhost:8001');
    this.socket.emit('joinEnvironment', this.environment.key);
    this.socket.on('environmentUpdated', (data) => {
      this.is_loading = true;
      if (data) {
        this.sensors = data.sensors;
        // this.getSensors();
      }

      this.is_loading = false;
    });
  },
  methods: {
    async getEnvironments() {
      await this.$axios
        .get(`/environments`)
        .then((response) => {
          this.environments = response.data;
          console.log(this.environments)
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
    getIconSesnsor(key) {
      return {
        'temperature': 'mdi-thermometer',
        'humidity': 'mdi-water',
        'pressure': 'mdi-gauge',
        'ldr': 'mdi-brightness-6',
        'presence': 'mdi-run-fast',
        'mq2': 'mdi-gas-burner',
        'noise': 'mdi-volume-high',
        'wifi': 'mdi-wifi',
      }[key] || ''
    },
    getUnitBySensor(name) {
      return {
        'temperature': '°C',
        'humidity': '%',
        'lumi': 'lux',
        'mq2': 'ppm',
        'ldr': 'lux',
        'presence': '',
        'noise': 'dB',
      }[name] || '';
    },
    getRangeBySensor(key) {
      return {
        'temperature': [-50, 90],
        'humidity': [0, 100],
        'pressure': [0, 100],
        'ldr': [0, 100],
        'presence': [0, 1],
        'mq2': [0, 100],
        'noise': [0, 100],
        'wifi': [0, 100],
      }[key] || [0, 100]
    },
    getIcon(item) {
      if (item.status === undefined) {

        return ''
      }

      return item.status ? { icon: 'mdi-check-circle', color: 'green' } : { icon: 'mdi-alert-circle', color: 'red' };
    },
    FormatDate(date) {
      let d = new Date(date).toLocaleString();
      if (d !== 'Invalid Date') {
        return d;
      }

      return '-'
    }
  },
  computed: {
    env_selected() {
      return this.$store.state.environments.env_current;
    },
  },
  watch: {
    '$store.state.environments.env_current'(newValue, oldValue) {
      //   this.loading_enviroment = true;
      //   this.loading_sensor = true;
      if (newValue != oldValue) {

        this.setEnvironment()
        this.getSensors()
      }
      //   this.loading_enviroment = false;
      //   this.loading_sensor = false;
    }
  },
  beforeDestroy() {
    this.socket.disconnect();
  },
}
</script>
