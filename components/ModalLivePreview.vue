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
            <v-chip small v-for="(sensor, key) in environment.sensors" :color="getColor(sensor)" style="color: black"
              class="mx-1">

              <v-icon small>{{ $getIconBySensor(sensor.key) }}</v-icon>
              <span v-if="key === 'presence'">
                {{ sensor?.current_value ? 'Dectado' : 'Não detectado' }}
              </span>
              <span v-else>
                {{ $formatNumber(sensor?.current_value) }} {{ sensor.unit }}
              </span>
            </v-chip>

          </v-row>
        </v-tooltip>
      </template>
      <v-row no-gutters class="flex-wrap">
        <v-col cols="" class="" v-for="(sensor, key) in environment.sensors">
          <v-card class="ma-1" rounded="lg" :loading="is_loading">
            <v-card-title>
              {{ sensor.name }}
              <v-spacer></v-spacer>
              <v-icon large color="black">{{ $getIconBySensor(sensor.key) }}</v-icon>
            </v-card-title>
            <v-card-text class="my-4 d-flex align-center justify-center text-h4" style="color: black;">
              <span v-if="key === 'presence'" class="text-h4">
                {{ sensor?.current_value ? 'Dectado' : 'Não detec..' }}
              </span>
              <span v-else>
                {{ $formatNumber(sensor?.current_value) }} {{ sensor.unit }}
              </span>
            </v-card-text>
            <v-card-actions class="text-caption m-0 p-0">
              Ultima atualização: {{ $formatDate(sensor?.updatedAt) }}
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card class="p-0 " rounded="lg" style="height: 100%;" :loading="is_loading">
            <v-card-title>
              Histórico
              <v-spacer></v-spacer>
              <v-icon large color="black">mdi-history</v-icon>
            </v-card-title>
            <v-card-text class="d-flex align-center justify-center text-h4" style="color: black;">
              <v-virtual-scroll :items="histories" :item-height="50" height="300">
                <template v-slot:default="{ item }">
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-avatar size="56" class="white--text">
                        <v-icon>{{ $getIconBySensor(item.key) }}</v-icon>
                      </v-avatar>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.value }} {{ $getUnitBySensor(item.key) }}
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
    this.environment = this.environment_tmp;

    this.socket = io('http://localhost:8001');
    this.socket.emit('joinEnvironment', this.environment.key);
    this.getHistory();

    this.socket.on('environmentUpdated', (data) => {
      this.is_loading = true;
      if (data) {
        this.environment = data;
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
        return 'success'
      }

      return 'error'
    },
    getHistory() {
      this.$axios
        .get(`/environments/${this.environment.id}/histories`)
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
