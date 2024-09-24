<template>
  <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="400" offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-badge bordered color="error" icon="mdi-lock" overlap
        :content="notificationsUnreads.length >= 99 ? '99+' : notificationsUnreads.length"
        :value="notificationsUnreads.length">
        <v-btn fab small color="#D9D9D9" :elevation="notificationsUnreads.length > 0 ? 2 : 0" v-bind="attrs" v-on="on">
          <v-icon color="black" :class="{ 'pulse-effect': notificationsUnreads.length > 0 }">mdi-bell</v-icon>
        </v-btn>
      </v-badge>
    </template>
    <v-card>
      <v-card-title>
        {{ notificatioCount }} Notificações {{ tab === 0 ? 'não lidas' :
          'lidas' }}
        <v-spacer></v-spacer>
        <v-btn icon @click="readNotification(null, true)">
          <v-icon>mdi-table-eye-off</v-icon>
        </v-btn>
        <v-btn icon @click="deleteNotification()">
          <v-icon>mdi-close-circle-multiple</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-title>
        <v-tabs v-model="tab" background-color="#D9D9D9" centered>
          <v-tab>
            <v-badge color="green" bordered
              :content="notificationsUnreads.length >= 99 ? '99+' : notificationsUnreads.length"
              :value="notificationsUnreads.length >= 99 ? '99+' : notificationsUnreads.length" v-if="tab === 1">
              Não lidas
            </v-badge>
            <span v-else>
              Não lidas
            </span>
          </v-tab>
          <v-tab>
            <v-badge color="green" bordered
              :content="notificationsReads.length >= 99 ? '99+' : notificationsReads.length"
              :value="notificationsReads.length >= 99 ? '99+' : notificationsReads.length" v-if="tab === 0">
              Lidas
            </v-badge>
            <span v-else>
              Lidas
            </span>
          </v-tab>
        </v-tabs>
      </v-card-title>
      <v-card-text class="my-4 d-flex align-center justify-center text-h4" style="color: black;">
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-virtual-scroll :items="notificationsUnreads" :item-height="100" height="400" width="500">
              <template v-slot:default="{ item }">
                <v-list-item>
                  <v-list-item-avatar color="#D9D9D9">
                    <v-avatar size="56" class="white--text">
                      <v-icon>{{ item.sensor.icon }}</v-icon>
                    </v-avatar>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>
                      O sensor <span class="font-weight-black">{{ item.sensor?.name }}</span> atingiu o valor
                      {{ item.maxReached ? 'máximo' : 'mínimo' }}
                    </v-list-item-title>
                    <v-list-item-subtitle>

                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      <v-chip x-small>
                        <v-icon left small>
                          mdi-clock-time-four-outline
                        </v-icon>
                        {{ $formatDate(item.createdAt) }}
                      </v-chip>
                      <v-chip x-small color="error">
                        <v-icon left small>
                          {{ item.maxReached ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                        </v-icon>
                        {{ item.value }} {{ item.sensor?.unit }}
                      </v-chip>
                      <v-chip x-small color="error">
                        <v-icon left small>
                          mdi-map-marker
                        </v-icon>
                        {{ item.environment?.name }}
                      </v-chip>
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action class="text-caption">
                    <v-row>
                      <v-btn icon @click="readNotification(item.id, true)">
                        <v-icon small>mdi-eye-off-outline</v-icon>
                      </v-btn>
                      <v-btn icon @click="deleteNotification(item.id)">
                        <v-icon small>mdi-close-circle-outline</v-icon>
                      </v-btn>
                    </v-row>
                  </v-list-item-action>
                </v-list-item>
                <v-divider></v-divider>
              </template>
            </v-virtual-scroll>
          </v-tab-item>
          <v-tab-item>
            <v-virtual-scroll :items="notificationsReads" :item-height="100" height="400" width="500">
              <template v-slot:default="{ item }">
                <v-list-item>
                  <v-list-item-avatar color="#D9D9D9">
                    <v-avatar size="56" class="white--text">
                      <v-icon>{{ item.sensor.icon }}</v-icon>
                    </v-avatar>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>
                      O sensor <span class="font-weight-black">{{ item.sensor?.name }}</span> atingiu o valor
                      {{ item.maxReached ? 'máximo' : 'mínimo' }}
                    </v-list-item-title>
                    <v-list-item-subtitle>

                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      <v-chip x-small>
                        <v-icon left small>
                          mdi-clock-time-four-outline
                        </v-icon>
                        {{ $formatDate(item.createdAt) }}
                      </v-chip>
                      <v-chip x-small color="error">
                        <v-icon left small>
                          {{ item.maxReached ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                        </v-icon>
                        {{ item.value }} {{ item.sensor?.unit }}
                      </v-chip>
                      <v-chip x-small color="error">
                        <v-icon left small>
                          mdi-map-marker
                        </v-icon>
                        {{ item.environment?.name }}
                      </v-chip>
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action class="text-caption">
                    <v-row>
                      <v-btn icon @click="readNotification(item.id, false)">
                        <v-icon small>mdi-eye-outline</v-icon>
                      </v-btn>
                      <v-btn icon @click="deleteNotification(item.id)">
                        <v-icon small>mdi-close-circle-outline</v-icon>
                      </v-btn>
                    </v-row>
                  </v-list-item-action>
                </v-list-item>
                <v-divider></v-divider>
              </template>
            </v-virtual-scroll>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
  </v-menu>
</template>
<script>
export default {
  data() {
    return {
      menu: false,
      notifications: [],
      tab: 'Não lidas',
    }
  },
  async mounted() {
    this.getNotifications();
  },
  methods: {
    deleteNotification(id) {
      let url = '/notifications';
      if (id) {
        url += `/${id}`;
      }
      this.$axios
        .delete(url)
        .then((response) => {
          this.getNotifications();
        })
        .catch((error) => {
        });
    },
    async readNotification(id, isRead) {
      let url = '/notifications';
      if (id !== null) {
        url += `/${id}`;
      }
      this.$axios
        .put(url, { isRead })
        .then((response) => {
          this.getNotifications();
        })
        .catch((error) => {
        });
    },
    async notifyNotification(id) {
      let url = '/notifications';
      if (id !== null) {
        url += `/${id}`;
      }
      this.$axios
        .put(url, { isNotified: true })
        .then((response) => {
        })
        .catch((error) => {
        });
    },
    async getNotifications() {
      let url = '/notifications';
      if (this.notification_env_selected_id) {
        url += `/${this.notification_env_selected_id?.id}`;
      }
      await this.$axios
        .get(url)
        .then((response) => {
          this.notifications = response.data;
          this.notify(response.data[0]);
        })
        .catch((error) => {
        });
    },
    notify(notification) {
      if (notification.isNotified === false) {
        this.$toast.error(
          `O sensor ${notification.sensor.name} atingiu o valor ${notification.maxReached ? 'máximo' : 'mínimo'}`,
          {
            showCloseButtonOnHover: true,
          }
        );
        this.notifyNotification(notification.id);
      }
    }
  },
  computed: {
    notificationsReads() {
      return this.notifications?.filter(notification => notification?.isRead);
    },
    notificationsUnreads() {
      return this.notifications?.filter(notification => !notification?.isRead);
    },
    notificatioCount() {
      if (this.tab === 0) {
        return this.notificationsUnreads.length;
      } else {
        return this.notificationsReads.length;
      }
    }
  }
}
</script>
<style>
@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

.pulse-effect {
  animation: pulse 1.5s infinite;
}
</style>