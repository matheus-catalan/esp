<template>
  <v-container fluid>
    <v-row class="px-6">
      <v-select v-model="environment_selecteds" :items="environments" @change="handleEnvironments()" chips
        label="Selecione um ou mais ambientes" multiple item-value="id" :loading="loading_environment"
        :disabled="loading_environment">
        <template v-slot:prepend-item>
          <v-list-item ripple @mousedown.prevent @click="select_all">
            <v-list-item-action>
              <v-icon :color="environment_selecteds?.length === environments.length ? 'indigo darken-4' : ''">
                {{ environment_selecteds?.length === environments.length ? "mdi-close-box" :
                  "mdi-checkbox-blank-outline" }}
              </v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ environment_selecteds?.length === environments.length ? 'Deselecionar todos' : 'Selecionar todos' }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider class="mt-2"></v-divider>
        </template>
        <template v-slot:item="{ active, item, attrs, on }">
          <v-list-item v-on="on" v-bind="attrs" #default="{ active }">
            <v-list-item-action>
              <v-checkbox :input-value="active"></v-checkbox>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                <v-row no-gutters align="center">
                  <v-avatar :color="item.color" size="30" class="mr-2">
                    <v-icon small color="black">{{ item.icon }}</v-icon>
                  </v-avatar>
                  <span>{{ item.name }}</span>
                  <v-spacer></v-spacer>
                </v-row>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <template v-slot:selection="{ item, index, parent }">
          <v-chip v-if="index < 8" color="secondary">
            <v-avatar :color="item.color" size="30" class="mr-2">
              <v-icon small color="black">{{ item.icon }}</v-icon>
            </v-avatar>
            {{ item?.name }}
            <v-icon small @click.stop="parent.selectItem(item)" class="ml-2">
              $delete
            </v-icon>
          </v-chip>

          <span v-if="index === 7 && environment_selecteds.length > 8" class="grey--text text-caption">
            (+{{ environment_selecteds.length - 8 }} outros)
          </span>
        </template>
      </v-select>
    </v-row>
    <v-row>
      <v-col :cols="granularity_selected.temperature.col" class="pr-3">
        <v-card class="p-0 pr-1" rounded="lg" fill-height v-if="!loading_environment">
          <v-card-title style="margin-bottom: 0px; padding-bottom: 0px;">
            Temperatura
            <v-spacer></v-spacer>
            <v-select :items="granularities" v-model="granularity_selected.temperature.name"
              @change="changeGranularity('temperature')" style="max-width: 130px"></v-select>
            <v-btn dense icon class="ml-5"
              @click="granularity_selected.temperature.col = granularity_selected.temperature.col == 6 ? 12 : 6">
              <v-icon>{{ granularity_selected.temperature.col == 6 ? 'mdi-fullscreen' : 'mdi-fullscreen-exit' }}
              </v-icon>
            </v-btn>
            <v-btn dense icon @click="getDataset('temperature')">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="d-flex align-center justify-center" style="color: black; width: 100%;">
            <div style="width: 100%;">
              <client-only placeholder="Carregando dados...">
                <line-chart :chart-data="datasets.temperature" :height="200" :options="optionsChart" :width="null"
                  chart-id="lineChart" />
              </client-only>
            </div>
          </v-card-text>
        </v-card>
        <v-skeleton-loader class="mx-auto" type="card" v-else></v-skeleton-loader>
      </v-col>
      <v-col :cols="granularity_selected.humidity.col" class="pr-3">
        <v-card class="p-0 pr-1" rounded="lg" fill-height v-if="!loading_environment">
          <v-card-title style="margin-bottom: 0px; padding-bottom: 0px;">
            Humidade
            <v-spacer></v-spacer>
            <v-select :items="granularities" v-model="granularity_selected.humidity.name"
              @change="changeGranularity('humidity')" style="max-width: 130px"></v-select>
            <v-btn dense icon class="ml-5"
              @click="granularity_selected.humidity.col = granularity_selected.humidity.col == 6 ? 12 : 6">
              <v-icon>{{ granularity_selected.humidity.col == 6 ? 'mdi-fullscreen' : 'mdi-fullscreen-exit' }}
              </v-icon>
            </v-btn>
            <v-btn dense icon @click="getDataset('humidity')">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="d-flex align-center justify-center" style="color: black; width: 100%;">
            <div style="width: 100%;">
              <client-only placeholder="Carregando dados...">
                <line-chart :chart-data="datasets.humidity" :height="200" :options="optionsChart" :width="null"
                  chart-id="lineChart" />
              </client-only>
            </div>
          </v-card-text>
        </v-card>
        <v-skeleton-loader class="mx-auto" type="card" v-else></v-skeleton-loader>
      </v-col>
      <v-col :cols="granularity_selected.mq2.col" class="pr-3">
        <v-card class="p-0 pr-1" rounded="lg" fill-height v-if="!loading_environment">
          <v-card-title style="margin-bottom: 0px; padding-bottom: 0px;">
            Gases
            <v-spacer></v-spacer>
            <v-select :items="granularities" v-model="granularity_selected.mq2.name" @change="changeGranularity('mq2')"
              style="max-width: 130px"></v-select>
            <v-btn dense icon class="ml-5"
              @click="granularity_selected.mq2.col = granularity_selected.mq2.col == 6 ? 12 : 6">
              <v-icon>{{ granularity_selected.mq2.col == 6 ? 'mdi-fullscreen' : 'mdi-fullscreen-exit' }}
              </v-icon>
            </v-btn>
            <v-btn dense icon @click="getDataset('mq2')">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="d-flex align-center justify-center" style="color: black; width: 100%;">
            <div style="width: 100%;">
              <client-only placeholder="Carregando dados...">
                <line-chart :chart-data="datasets.mq2" :height="200" :options="optionsChart" :width="null"
                  chart-id="lineChart" />
              </client-only>
            </div>
          </v-card-text>
        </v-card>
        <v-skeleton-loader class="mx-auto" type="card" v-else></v-skeleton-loader>
      </v-col>
      <v-col :cols="granularity_selected.noise.col" class="pr-3">
        <v-card class="p-0 pr-1" rounded="lg" fill-height v-if="!loading_environment">
          <v-card-title style="margin-bottom: 0px; padding-bottom: 0px;">
            Ruído
            <v-spacer></v-spacer>
            <v-select :items="granularities" v-model="granularity_selected.noise.name"
              @change="changeGranularity('noise')" style="max-width: 130px"></v-select>
            <v-btn dense icon class="ml-5"
              @click="granularity_selected.noise.col = granularity_selected.noise.col == 6 ? 12 : 6">
              <v-icon>{{ granularity_selected.noise.col == 6 ? 'mdi-fullscreen' : 'mdi-fullscreen-exit' }}
              </v-icon>
            </v-btn>
            <v-btn dense icon @click="getDataset('noise')">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="d-flex align-center justify-center" style="color: black; width: 100%;">
            <div style="width: 100%;">
              <client-only placeholder="Carregando dados...">
                <line-chart :chart-data="datasets.noise" :height="200" :options="optionsChart" :width="null"
                  chart-id="lineChart" />
              </client-only>
            </div>
          </v-card-text>
        </v-card>
        <v-skeleton-loader class="mx-auto" type="card" v-else></v-skeleton-loader>
      </v-col>
      <v-col :cols="granularity_selected.ldr.col" class="pr-3">
        <v-card class="p-0 pr-1" rounded="lg" fill-height v-if="!loading_environment">
          <v-card-title style="margin-bottom: 0px; padding-bottom: 0px;">
            Luminosidade
            <v-spacer></v-spacer>
            <v-select :items="granularities" v-model="granularity_selected.ldr.name" @change="changeGranularity('ldr')"
              style="max-width: 130px"></v-select>
            <v-btn dense icon class="ml-5"
              @click="granularity_selected.ldr.col = granularity_selected.ldr.col == 6 ? 12 : 6">
              <v-icon>{{ granularity_selected.ldr.col == 6 ? 'mdi-fullscreen' : 'mdi-fullscreen-exit' }}
              </v-icon>
            </v-btn>
            <v-btn dense icon @click="getDataset('ldr')">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="d-flex align-center justify-center" style="color: black; width: 100%;">
            <div style="width: 100%;">
              <client-only placeholder="Carregando dados...">
                <line-chart :chart-data="datasets.ldr" :height="200" :options="optionsChart" :width="null"
                  chart-id="lineChart" />
              </client-only>
            </div>
          </v-card-text>
        </v-card>
        <v-skeleton-loader class="mx-auto" type="card" v-else></v-skeleton-loader>
      </v-col>
      <v-col :cols="granularity_selected.presence.col" class="pr-3">
        <v-card class="p-0 pr-1" rounded="lg" fill-height v-if="!loading_environment">
          <v-card-title style="margin-bottom: 0px; padding-bottom: 0px;">
            Presença
            <v-spacer></v-spacer>
            <v-select :items="granularities" v-model="granularity_selected.presence.name"
              @change="changeGranularity('presence')" style="max-width: 130px"></v-select>
            <v-btn dense icon class="ml-5"
              @click="granularity_selected.presence.col = granularity_selected.presence.col == 6 ? 12 : 6">
              <v-icon>{{ granularity_selected.presence.col == 6 ? 'mdi-fullscreen' : 'mdi-fullscreen-exit' }}
              </v-icon>
            </v-btn>
            <v-btn dense icon @click="getDataset('presence')">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="d-flex align-center justify-center" style="color: black; width: 100%;">
            <div style="width: 100%;">
              <client-only placeholder="Carregando dados...">
                <line-chart :chart-data="datasets.presence" :height="200" :options="optionsChart" :width="null"
                  chart-id="lineChart" />
              </client-only>
            </div>
          </v-card-text>
        </v-card>
        <v-skeleton-loader class="mx-auto" type="card" v-else></v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      sensors: [],
      environment: {},
      environments: [],
      environment_selecteds: [],
      loading_environment: true,
      granularity_selected: {
        temperature: { name: 'day', loading: true, col: 6 },
        humidity: { name: 'day', loading: true, col: 6 },
        mq2: { name: 'day', loading: true, col: 6 },
        ldr: { name: 'day', loading: true, col: 6 },
        noise: { name: 'day', loading: true, col: 6 },
        presence: { name: 'day', loading: true, col: 6 },
      },
      granularities: [
        { value: 'second', text: 'Por segundo' },
        { value: 'minute', text: 'Por minuto' },
        { value: 'hour', text: 'Por hora' },
        { value: 'day', text: 'Por dia' },
        { value: 'week', text: 'Por semana' },
        { value: 'month', text: 'Por mese' },
        { value: 'year', text: 'Por ano' },
      ],
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
      sensors_key: [
        'temperature',
        'humidity',
        'mq2',
        'ldr',
        'noise',
        'presence',
      ]
    }
  },
  async mounted() {
    this.loading_sensor = true;
    this.loading_enviroment = true;
    await this.getEnvironments();
    this.loading_environment = true
    for (let i = 0; i < 5; i++) {
      this.environment_selecteds.push(this.environments[i]);

      await new Promise(resolve => setTimeout(resolve, 100));
    }
    this.handleEnvironments()
    this.loading_environment = false
  },
  methods: {
    async select_all() {
      this.loading_environment = true
      if (this.environment_selecteds.length == this.environments.length) {
        this.environment_selecteds = []
      } else {
        this.environment_selecteds = []
        for (let i = 0; i < this.environments.length; i++) {
          this.environment_selecteds.push(this.environments[i]);

          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      this.handleEnvironments()

      this.loading_environment = false
    },
    changeGranularity(key) {
      this.getDataset(key)
    },
    removeDataset(key) {
      this.datasets[key] = { labels: [], datasets: [] }
    },
    handleEnvironments() {
      this.loading_environment = true
      this.sensors_key.forEach(async (sensor_key) => {
        this.environment_selecteds.forEach(async (env) => {
          this.datasets[sensor_key] = { labels: [], datasets: [] }
          await this.$axios
            .get(`/histories/environments/${env?.id || env}/${sensor_key}/${this.granularity_selected[sensor_key].name}`)
            .then((response) => {
              console.log(response)
              this.datasets[sensor_key].labels = response.data.labels
              this.datasets[sensor_key].datasets.push({ ...response.data.dataset })
            })
            .catch((error) => {
              console.log(error)
            });
        })
      })
      this.loading_environment = false
    },
    async getDataset(sensor_key) {
      this.datasets[sensor_key] = { labels: [], datasets: [] }
      this.environment_selecteds.forEach(async (env) => {

        await this.$axios
          .get(`/histories/environments/${env?.id || env}/${sensor_key}/${this.granularity_selected[sensor_key].name}`)
          .then((response) => {
            this.datasets[sensor_key].labels = response.data.labels
            this.datasets[sensor_key].datasets.push({ ...response.data.dataset })
            console.log(this.datasets[sensor_key])
          })
          .catch((error) => {
          });
      })
    },
    async getEnvironments() {
      await this.$axios
        .get(`/environments`)
        .then((response) => {
          this.environments = response.data
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
    // async getDatasetTemperature() {
    //   await this.$axios
    //     .get(`/histories/environments/${this.environment.id}/temperature/${this.granularity_temperature}`)
    //     .then((response) => {
    //       this.datasets.temperature = response.data
    //     })
    //     .catch((error) => {
    //     });
    // },
  }
}
</script>