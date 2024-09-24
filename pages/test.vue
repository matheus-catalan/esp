<template>
  <NavBar name="Comunicação" />

  <!-- <div>
    <h2>Mensagens do MQTT</h2>
    <ul>
      <li v-for="(msg, index) in messages" :key="index">{{ msg }}</li>
    </ul>
  </div> -->
</template>

<script>
import io from 'socket.io-client';
export default {
  data() {
    return {
      socket: undefined,
      messages: [],
      environment: {},
    };
  },
  async mounted() {
    await this.getEnvironments();
    await this.setEnvironment();
    this.socket = io(this.$config.sockerUrl);
    this.handlingSocket();

  },
  methods: {
    handlingSocket() {
      if (this.socket == undefined) return
      this.socket.emit('joinEnvironmentMqtt', this.environment.key);
      this.socket.on('updateMqtt', (data) => {
        console.log(data)
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
  },
  beforeDestroy() {
    // Desinscreva ao destruir o componente

  },
};
</script>
