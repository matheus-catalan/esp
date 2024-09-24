<template>
  <v-container fluid>
    <NavBar :name="`Dashboard`" :show_updated_at="true" />

    <v-row>
      <v-col cols="8" fill-height class="d-flex justify-center">
        <v-row>
          <template v-for="(sensor, key) in sensors">
            <v-col cols="4" v-if="!sensor.is_internal" :key="sensor.key">
              <v-card class="p-0 " rounded="lg" style="height: 100%;">
                <v-card-title style="margin-bottom: 0px; padding-bottom: 0px;">
                  {{ sensor.name }}
                  <v-spacer></v-spacer>
                  <v-icon color="black">{{ $getIconBySensor(sensor.key) }}</v-icon>
                </v-card-title>
                <v-card-subtitle class="mt-0 pt-0 pb-0">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-chip x-small v-bind="attrs" v-on="on">
                        <v-icon left small>
                          mdi-clock-time-four-outline
                        </v-icon>
                        {{ $formatDate(sensor.updatedAt) }}
                      </v-chip>
                    </template>
                    <span>Ultima atualização </span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-chip x-small :color="sensor.status ? 'success' : 'warning'" v-bind="attrs" v-on="on">
                        <v-icon small>
                          {{ sensor.status ? 'mdi-check' : 'mdi-alert-circle' }}
                        </v-icon>
                      </v-chip>
                    </template>
                    <span>Sensor {{ sensor.status ? ' ok' : ' com erro' }}</span>
                  </v-tooltip>
                </v-card-subtitle>
                <v-card-text class="mt-5 d-flex align-center justify-center text-h4" style="color: black;">
                  {{ $formatNumber(sensor.current_value, sensor.key) }} {{ sensor.unit }}
                </v-card-text>
                <v-card-actions style="max-height: 40px;">
                  <v-sparkline :value="datasets[sensor.key]?.second?.values" height="20"
                    :gradient="['#000', '#000', '#000']" :padding="0" line-width="2" stroke-linecap=""
                    gradient-direction="left" :fill="false" type="trend" :auto-line-width="true" auto-draw>
                  </v-sparkline>
                </v-card-actions>
              </v-card>
            </v-col>
          </template>
        </v-row>
      </v-col>
      <v-col cols="4">
        <v-card class="p-0 " rounded="lg" style="height: 100%;">
          <v-card-title>
            Histórico
            <v-spacer></v-spacer>
            <v-icon large color="black">mdi-history</v-icon>
          </v-card-title>
          <v-card-text class="my-4 d-flex align-center justify-center text-h4" style="color: black;">
            <v-virtual-scroll :items="histories" :item-height="50" height="300">
              <template v-slot:default="{ item }">
                <v-list-item>
                  <v-list-item-avatar>
                    <v-avatar size="56" class="white--text">
                      <v-icon>{{ item.sensor.icon }}</v-icon>
                    </v-avatar>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>
                      {{ $formatNumber(item.value, item.sensor.key) }} {{ item.sensor.unit }}
                    </v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-action class="text-caption">
                    {{ $formatDate(item.sensor.updatedAt) }}
                  </v-list-item-action>
                </v-list-item>
                <v-divider></v-divider>
              </template>
            </v-virtual-scroll>
          </v-card-text>
          <v-card-actions class="text-caption m-0 p-0">
            Ultima atualização: {{ $formatDate(histories[0]?.sensor.updatedAt) }}
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" class="pr-3">
        <v-card class="p-0 pr-1" rounded="lg">
          <v-card-title style="margin-bottom: 0px; padding-bottom: 0px;">
            Temperatura
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text class="d-flex align-center justify-center" style="color: black; width: 100%;">
            <div style="width: 100%;">
              <client-only placeholder="Loading...">
                <line-chart :chart-data="datasets.temperature" :height="150" :options="optionsChart" :width="null"
                  chart-id="lineChart" />
              </client-only>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" class="pr-3">
        <v-card class="p-0 pr-1" rounded="lg">
          <v-card-title style="margin-bottom: 0px; padding-bottom: 0px;">
            Humidade
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text class="d-flex align-center justify-center" style="color: black; width: 100%;">
            <div style="width: 100%;">
              <client-only placeholder="Loading...">
                <line-chart :chart-data="datasets.humidity" :height="150" :options="optionsChart" :width="null"
                  chart-id="lineChart" />
              </client-only>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" class="pr-3">
        <v-card class="p-0 pr-1" rounded="lg">
          <v-card-title style="margin-bottom: 0px; padding-bottom: 0px;">
            Gases
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text class="d-flex align-center justify-center" style="color: black; width: 100%;">
            <div style="width: 100%;">
              <client-only placeholder="Loading...">
                <line-chart :chart-data="datasets.mq2" :height="150" :options="optionsChart" :width="null"
                  chart-id="lineChart" />
              </client-only>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" class="pr-3">
        <v-card class="p-0 pr-1" rounded="lg">
          <v-card-title style="margin-bottom: 0px; padding-bottom: 0px;">
            <span>
              Luminosidade
              <span class="text-caption">ultimos 30 registros</span>
            </span>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text class="d-flex align-center justify-center" style="color: black; width: 100%;">
            <div style="width: 100%;">
              <client-only placeholder="Loading...">
                <line-chart :chart-data="datasets.ldr" :height="150" :options="optionsChart" :width="null"
                  chart-id="lineChart" />
              </client-only>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" class="pr-3">
        <v-card class="p-0 pr-1" rounded="lg">
          <v-card-title style="margin-bottom: 0px; padding-bottom: 0px;">
            Ruído
            <v-spacer></v-spacer>
            <span class="text-caption">ultimos 30 registros</span>
          </v-card-title>
          <v-card-text class="d-flex align-center justify-center" style="color: black; width: 100%;">
            <div style="width: 100%;">
              <client-only placeholder="Loading...">
                <line-chart :chart-data="datasets.noise" :height="150" :options="optionsChart" :width="null"
                  chart-id="lineChart" />
              </client-only>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" class="pr-3">
        <v-card class="p-0 pr-1" rounded="lg">
          <v-card-title style="margin-bottom: 0px; padding-bottom: 0px;">

            Presença
            <v-spacer></v-spacer>
            <span class="text-caption">ultimos 30 registros</span>
          </v-card-title>
          <v-card-text class="d-flex align-center justify-center" style="color: black; width: 100%;">
            <div style="width: 100%;">
              <client-only placeholder="Loading...">
                <line-chart :chart-data="datasets.presence" :height="150" :options="optionsChart" :width="null"
                  chart-id="lineChart" />
              </client-only>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8">
        <v-row>
          <template v-for="(sensor, key) in sensors">
            <v-col cols="4" v-if="sensor.is_internal" :key="key">
              <v-card class="" rounded="lg" style="height: 100%;">
                <v-list subheader two-line style="padding-bottom: 0px;">
                  <v-list-item style="padding-left: 10px; padding-right: 10px;">
                    <v-list-item-avatar size="30">
                      <v-icon small class="grey lighten-1">{{ $getIconBySensor(sensor.key) }}</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{ sensor.name }}</v-list-item-title>
                      <v-list-item-subtitle v-if="sensor.key != 'ip'">
                        {{ $formatNumber(sensor.current_value, sensor.key) }} {{ sensor.unit }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle v-else>
                        <a :href="`http://${sensor.current_value}`" target="_blank">{{ sensor.current_value }}</a>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon color="grey lighten-1" v-bind="attrs" v-on="on">mdi-information</v-icon>
                        </template>
                        <span>Ultima atualização: {{ $formatDate(sensor.updatedAt) }}</span>
                      </v-tooltip>
                    </v-list-item-action>
                  </v-list-item>

                </v-list>
              </v-card>
            </v-col>
          </template>
        </v-row>
      </v-col>


      <v-col cols="4">
        <v-card class="p-0" rounded="lg" style="height: 100%;">
          <v-card-title class="d-flex align-center justify-center" style="margin-bottom: 0px; padding-bottom: 0px">
            Sistema de notificação
          </v-card-title>
          <v-card-text class="mt-3 d-flex align-center justify-center text-h5" style="color: black;">
            <v-row>
              <v-col cols="4" class="d-flex flex-column align-center justify-center text-center text-subtitle-1">
                <v-icon color="black">mdi-volume-high</v-icon>
                <span>Sonoro</span>
                <span style="color: green;">{{ environment.sound_alert ? 'Ligado' : 'desligado' }}</span>
              </v-col>
              <v-col cols="4" class="d-flex flex-column align-center justify-center text-center text-subtitle-1">
                <v-icon color="black">mdi-alarm-light</v-icon>
                <span>Luminoso</span>
                <span style="color: green;">{{ environment.light_alert ? 'Ligado' : 'desligado' }}</span>
              </v-col>
              <v-col cols="4" class="d-flex flex-column align-center justify-center text-center text-subtitle-1">
                <v-icon color="black">mdi-bell</v-icon>
                <span>Notificação</span>
                <span style="color: green;">{{ environment.notification_alert ? 'Ligado' : 'desligado' }}</span>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import io from 'socket.io-client';

export default {
  name: 'dashboard',
  data() {
    return {
      sensors: [],
      environment: {},
      histories: [],
      socket: undefined,
      optionsChart: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: false
        },
      },
      datasets: {
        temperature: { labels: [], datasets: [{ data: [] }] },
        humidity: { labels: [], datasets: [{ data: [] }] },
        mq2: { labels: [], datasets: [{ data: [] }] },
        ldr: { labels: [], datasets: [{ data: [] }] },
        noise: { labels: [], datasets: [{ data: [] }] },
        presence: { labels: [], datasets: [{ data: [] }] }
      },
    }
  },
  async mounted() {
    this.loading_sensor = true;
    this.loading_enviroment = true;
    await this.getEnvironments();
    await this.setEnvironment();
    this.socket = io(this.$config.sockerUrl);
    this.handlingSocket();
    this.getAllHistories();
  },
  methods: {
    handlingSocket() {
      if (this.socket == undefined) return
      this.socket.emit('joinEnvironment', this.environment.key);
      this.socket.on('environmentUpdated', (data) => {
        if (data) {
          this.setSensor(data);
          this.getAllHistories();
        }
      });
    },
    async getAllHistories() {
      await this.$axios
        .get(`environments/${this.environment.id}/histories`)
        .then((response) => {
          this.histories = response.data;
        })
        .catch((error) => {
          this.$toast.error('Erro ao buscar histórico');
        });
    },
    async setSensor(sensor) {
      if (sensor == undefined) return
      let s = this.sensors.find((s) => s.key == sensor.key);
      if (!s) {
        return;
      }

      s.current_value = sensor.current_value;
      s.updatedAt = sensor.updatedAt;
      s.status = sensor.status;
      await this.getHistory(sensor);
    },
    getHistory(sensor) {
      this.$axios
        .get(`/sensors/${sensor.id}/histories`)
        .then((response) => {
          this.datasets[sensor.key] = response.data.datasets;
        })
        .catch((error) => {
          console.log(error)
        });
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
      if (this.environments == undefined) return

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
          if (this.sensors == response.data.sensors) return

          this.sensors = response.data.sensors;
          this.sensors.forEach((sensor) => {
            this.getHistory(sensor);
          });
        })
        .catch((error) => {
          this.loading_sensor = false;
        });
    },
  },
  computed: {
    env_selected() {
      return this.$store.state.environments.env_current;
    },
    temperatureDataset() {
      const dataset = { labels: [], datasets: [{ data: [] }] }

      if (this.datasets.temperature) {
        return this.datasets.temperature
      }

      return dataset
    }
  },
  beforeDestroy() {
    this.socket.disconnect();
  },
  watch: {
    '$store.state.environments.env_current'(newValue, oldValue) {
      this.getEnvironments();
      this.setEnvironment();
      this.handlingSocket();
      this.getSensors();
    }
  }
}
</script>

<style scoped>
.text-center {
  text-align: center;
}
</style>
