<template>
  <v-card class="p-0 " rounded="lg" style="height: 100%;" :color="sensor.status ? 'white' : 'error'">
    <v-card-title>
      {{ sensor.name }}

      <v-spacer></v-spacer>
      <v-icon large color="black">{{ $getIconBySensor(sensor.key) }}</v-icon>
    </v-card-title>
    <v-card-subtitle class="pb-0">

    </v-card-subtitle>
    <v-card-subtitle class="mt-0 pt-0 pb-0">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-chip x-small v-bind="attrs" v-on="on">
            <v-icon left small>
              mdi-update
            </v-icon>
            {{ $formatNumber(sensor.current_value) }} {{ sensor.unit }}
          </v-chip>
        </template>
        <span>Ultima atualização </span>
      </v-tooltip>
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
    <v-divider class="my-1"></v-divider>
    <v-card-text class="my-4 ">
      <v-row class="d-flex align-center justify-center" fill-height>
        <v-col cols="4" class="d-flex align-center justify-center flex-column"
          style="margin-top:0; padding-top:0;margin-bottom:0; padding-bottom:0;">
          <v-icon color="black">{{ (sensor.sound_alert || false) ? 'mdi-volume-high' :
            'mdi-volume-off' }}</v-icon>
          <v-subheader class="m-0 p-0 text-caption">Sonoro</v-subheader>
          <v-switch v-model="sensor.alert_sound" label='' @change="updateSensor(sensor)" hide-details
            style="margin:0; padding:0"></v-switch>
        </v-col>
        <v-col cols="4" class="d-flex align-center justify-center flex-column"
          style="margin-top:0; padding-top:0;margin-bottom:0; padding-bottom:0;">
          <v-icon color="black">{{ (sensor.light_alert || false) ?
            'mdi-alarm-light' : 'mdi-alarm-light-off' }}</v-icon>
          <v-subheader class="m-0 p-0 text-caption">Luminoso</v-subheader>
          <v-switch v-model="sensor.alert_light" label='' @change="updateSensor(sensor)" hide-details
            style="margin:0; padding:0"></v-switch>
        </v-col>
        <v-col cols="4" class="d-flex align-center justify-center flex-column"
          style="margin-top:0; padding-top:0;margin-bottom:0; padding-bottom:0;">
          <v-icon color="black">{{ (sensor.alert_notification || false) ?
            'mdi-bell' : 'mdi-bell-off' }}</v-icon>
          <v-subheader class="m-0 p-0 text-caption">Notificação</v-subheader>
          <v-switch v-model="sensor.alert_notification" label='' @change="updateSensor(sensor)" hide-details
            style="margin:0; padding:0"></v-switch>
        </v-col>
        <v-col cols="6" v-if="$showForm(sensor.key)">
          <v-text-field v-model="sensor.min_value" hide-details prepend-inner-icon="mdi-wave-arrow-down"
            @change="updateSensor(sensor)" filled rounded dense label="valor minimo"></v-text-field>
        </v-col>
        <v-col cols="6" v-if="$showForm(sensor.key)">
          <v-text-field v-model="sensor.max_value" hide-details prepend-inner-icon="mdi-wave-arrow-up"
            @change="updateSensor(sensor)" filled rounded dense label="Valor maximo"></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
import io from 'socket.io-client';

export default {
  props: ['sensor_temp'],
  data() {
    return {
      loading: false,
      socket: null,
      sensor: {}
    };
  },
  mounted() {
    this.sensor = this.sensor_temp;
    this.socket = io('http://localhost:8001');
    this.socket.emit('joinSensor', this.sensor.id);
    this.socket.on('sensorUpdated', (data) => {
      this.is_loading = true;
      if (data) {
        console.log(data);
        this.sensor = data;
      }

      this.is_loading = false;
    });
  },
  methods: {
    updateSensor(sensor) {
      this.$axios
        .put(`/sensors/${sensor.id}`, sensor)
        .then((response) => {
          this.$toast.success('Valor alterado com sucesso');
        })
        .catch((error) => {
          this.$toast.error('Erro ao alterar valor');
        });
    },
  },
  watch: {
    sensor_temp: function (newVal, oldVal) {
      this.sensor = newVal;
    }
  },
  beforeDestroy() {
    this.socket.disconnect();
  },

}
</script>