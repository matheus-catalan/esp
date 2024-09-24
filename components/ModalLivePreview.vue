<template>
  <div>
    <v-dialog transition="scroll-x-transition">
      <template v-slot:activator="{ on: menu, attrs }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on: tooltip }">

            <v-chip class="ma-2" :color="get_color()" v-bind="attrs" v-on="{ ...tooltip, ...menu }" loading>
              <v-avatar left>
                <v-icon>{{ environment.icon }}</v-icon>
              </v-avatar>
              {{ environment.name }}
              <v-progress-linear indeterminate color="blue" size="10px" :query="true" absolute bottom
                v-if="is_loading"></v-progress-linear>
            </v-chip>
          </template>
          <v-row>
            <template v-for="(sensor, key) in sensors">
              <v-chip small :color="getColor(sensor)" style="color: black" class="mx-1">

                <v-icon small>{{ $getIconBySensor(sensor.key) }}</v-icon>
                <span>
                  {{ $formatNumber(sensor?.current_value, sensor.key) }} {{ sensor.unit }}
                </span>
              </v-chip>
            </template>

          </v-row>
        </v-tooltip>
      </template>
      <v-row no-gutters class="flex-wrap">
        <template v-for="(sensor, key) in sensors">
          <v-col cols="2" class="" v-if="!sensor.is_internal">
            <v-card class="ma-1" rounded="lg" :loading="is_loading">
              <v-card-title>
                {{ sensor.name }}
                <v-spacer></v-spacer>
                <v-icon large color="black">{{ $getIconBySensor(sensor.key) }}</v-icon>
              </v-card-title>
              <v-card-text class="my-4 d-flex align-center justify-center text-h5" style="color: black;">
                <span>
                  {{ $formatNumber(sensor.current_value, sensor.key) }} {{ sensor.unit }}
                </span>
              </v-card-text>
              <v-card-actions class="text-caption m-0 p-0">
                Ultima atualização: {{ $formatDate(sensor?.updatedAt) }}
              </v-card-actions>
            </v-card>
          </v-col>
        </template>
      </v-row>
      <v-row>
        <v-col cols="4">
          <template v-for="(sensor, key) in sensors">
            <v-col cols="12" v-if="sensor.is_internal" :key="key">
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
        </v-col>
        <v-col cols="8">
          <v-card class="p-0 " rounded="lg" style="height: 100%;" :loading="is_loading">
            <v-card-title>
              Histórico
              <v-spacer></v-spacer>
              <v-icon large color="black">mdi-history</v-icon>
            </v-card-title>
            <v-card-text class="d-flex align-center justify-center text-h4" style="color: black;">
              <v-virtual-scroll :items="histories" :item-height="50" height="500">
                <template v-slot:default="{ item }">
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-avatar size="56" class="white--text">
                        <v-icon>{{ $getIconBySensor(item.sensor.key) }}</v-icon>
                      </v-avatar>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>
                        {{ $formatNumber(item.value, item.sensor.key) }} {{ $getUnitBySensor(item.sensor.key) }}
                      </v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-action class="text-caption">
                      {{ item.date }}
                    </v-list-item-action>
                  </v-list-item>
                  <v-divider></v-divider>
                </template>
              </v-virtual-scroll>
            </v-card-text>
            <v-card-actions class="text-caption m-0 p-0">
              Ultima atualização: {{ $formatDate(environment.updatedAt) }}
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row>

      </v-row>

    </v-dialog>
    <!-- <v-chip class="ma-2" outlined :color="get_color()" v-else>
      <v-avatar left>
        <v-icon>{{ icon }}</v-icon>
      </v-avatar>
      {{ name }}
    </v-chip> -->
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  props: ['environment_tmp'],
  mounted() {
    this.loading = true;
    console.log(this.environment_tmp);
    this.environment = this.environment_tmp;

    this.sensors = this.environment.sensors;
    this.socket = io(this.$config.sockerUrl);
    this.socket.emit('joinEnvironment', this.environment.key);
    this.getHistory();

    this.socket.on('environmentUpdated', (data) => {
      this.is_loading = true;
      if (data) {
        if (data.environmentId) {
          this.environment = data.environment;
        } else {
          this.environment = data;
          this.setSensor(data);
        }
        this.getHistory();
      }

      this.is_loading = false;
    });


    this.loading = false;
  },
  data() {
    return {
      loading: false,
      is_loading: false,
      socket: null,
      sensors: [],
      histories: [],
      environment: {}
    }
  },
  methods: {
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
    status(date) {
      let now = new Date()
      let last_update = new Date(date)
      let diff = now - last_update
      if (diff < 60000) {
        return true
      } else {
        return false
      }
    },
    getColor(sensor) {
      if (sensor?.status === false) {
        return 'error'
      }

      return 'success'
    },
    get_color() {
      if (this.status(this.environment?.updatedAt)) {
        return 'blue'
      }

      return 'error'
    },
    async getHistory() {
      if (!this.environment?.id) {
        this.histories = [];
        console.log('environment not found', this.environment);
        return;
      }
      await this.$axios
        .get(`environments/${this.environment.id}/histories`)
        .then((response) => {
          this.histories = response.data;
        })
        .catch((error) => {
        });
    }
  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
</script>
