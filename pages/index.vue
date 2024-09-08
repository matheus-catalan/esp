<template>
  <v-container fluid>
    <NavBar :name="`Dashboard`" />

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
                      {{ item.value }} {{ item.sensor.unit }}
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
      <v-col cols="12" class="pr-3">
        <v-card class="p-0 pr-1" rounded="lg">
          <v-card-title>
            Temperatura e humidade
            <v-spacer></v-spacer>
            <v-select v-model="interval_temp" :items="intervals" item-text="name" item-value="value"
              style="width: 50px;" filled rounded dense hide-details></v-select>
          </v-card-title>
          <v-card-text class="my-4 d-flex align-center justify-center" style="color: black; width: 100%;">
            <div style="width: 100%;">
              <client-only placeholder="Loading...">
                <line-chart :chart-data="temperatureDataset" :height="50" :width="null" chart-id="lineChart" />
              </client-only>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- <v-col cols="6" class="pl-3">
        <v-card class="p-0 pl-1" rounded="lg">
          <v-card-text class="my-4 d-flex align-center justify-center" style="color: black; width: 100%;">
            <div style="width: 100%;">
              <client-only placeholder="Loading...">
                <line-chart :chart-data="dataset_2" :options="options" :height="100" :width="null"
                  chart-id="lineChart" />
              </client-only>
            </div>
          </v-card-text>
        </v-card>
      </v-col> -->
    </v-row>
    <v-row>
      <v-col cols="8">
        <v-row>
          <template v-for="(sensor, key) in sensors">
            <v-col cols="3" v-if="sensor.is_internal" :key="key">
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
          <v-card-title class="d-flex align-center justify-center">
            Sistema de notificação
          </v-card-title>
          <v-card-text class="my-4 d-flex align-center justify-center text-h5" style="color: black;">
            <v-row>
              <v-col cols="4" class="d-flex flex-column align-center justify-center text-center text-h6">
                <v-icon large color="black">mdi-volume-high</v-icon>
                <span>Sonoro</span>
                <span style="color: green;">Ativo</span>
              </v-col>
              <v-col cols="4" class="d-flex flex-column align-center justify-center text-center text-h6">
                <v-icon large color="black">mdi-alarm-light</v-icon>
                <span>Luminoso</span>
                <span style="color: green;">Ativo</span>
              </v-col>
              <v-col cols="4" class="d-flex flex-column align-center justify-center text-center text-h6">
                <v-icon large color="black">mdi-bell</v-icon>
                <span>Notificação</span>
                <span style="color: green;">Ativo</span>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- <v-row>
      <v-col cols="12">
        <v-data-table :headers="headers" :items="histories" item-value="sensor.updatedAt" class="elevation-1">
          <template v-slot:item.icon="{ item }">
            <v-avatar size="56" class="white--text">
              <v-icon>{{ item.sensor.icon }}</v-icon>
            </v-avatar>
          </template>

          <template v-slot:item.value="{ item }">
            {{ item.value }} {{ item.sensor.unit }}
          </template>

          <template v-slot:item.updatedAt="{ item }">
            {{ $formatDate(item.sensor.updatedAt) }}
          </template>

          <template v-slot:no-data>
            <v-alert :value="true" type="info" color="blue-grey">
              Nenhum dado disponível
            </v-alert>
          </template>
        </v-data-table>
      </v-col>
    </v-row> -->

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
      histories_full: [],
      wifi: {},
      datasets: [],
      interval_temp: 'second',
      intervals: [{ name: 'por segundo', value: 'second' }, { name: 'por minuto', value: 'minute' }, { name: 'por hora', value: 'hourly' }, { name: 'por dia', value: 'day' }],
    }
  },
  async mounted() {
    this.loading_sensor = true;
    this.loading_enviroment = true;
    await this.getEnvironments();
    await this.setEnvironment();
    this.socket = io('http://localhost:8001');
    this.socket.emit('joinEnvironment', this.environment.key);
    this.getHistory();

    this.socket.on('environmentUpdated', (data) => {
      if (data) {
        this.setSensor(data.sensor);
        this.getHistory();
      }
    });
  },
  methods: {
    setSensor(sensor) {
      if (sensor == undefined) return
      let s = this.sensors.find((s) => s.key == sensor.key);
      if (!s) {
        return;
      }

      s.current_value = sensor.current_value;
      s.updatedAt = sensor.updatedAt;
      s.status = sensor.status;

    },
    getWifiSensor() {
      let a = this.sensors.find((sensor) => sensor.key == 'wifi');
      if (a) return a
      return {}
    },
    getHistory() {
      this.$axios
        .get(`/environments/${this.environment.id}/histories`)
        .then((response) => {
          this.histories = response.data.histories;
          this.datasets = response.data.datasets;
          console.log("this.datasets", this.datasets)
        })
        .catch((error) => {
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
          this.wifi = this.getWifiSensor();
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
        return this.datasets.temperature[this.interval_temp]
      }

      return dataset
    }
  },
  beforeDestroy() {
    if (this.messageRef) {
      this.messageRef.off('value', this.handleHistoryChange);
    }
  },
  watch: {
    interval_temp(oldValue, newValue) {
      console.log(this.interval_temp)
      //this.getHistory();
    }
  }
}
</script>

<style scoped>
.text-center {
  text-align: center;
}
</style>
