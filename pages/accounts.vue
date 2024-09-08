<template>
  <v-container fluid>
    <v-row class="mb-5">
      <v-col cols="11" class="d-flex align-center justify-center">
        <h1>Contas</h1>
      </v-col>
      <v-col cols="1">
        <v-spacer></v-spacer>
        <v-btn-toggle v-model="toggle_exclusive">
          <v-btn>
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn>
            <v-icon>mdi-minus</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row class="fill-height">
      <v-col cols="12" class="d-flex flex-column">
        <v-card class="px-2 py-2 d-flex flex-column flex-grow-1" rounded="lg" style="height: 650px">
          <div v-for="account in accounts" :key="name" class="d-flex flex-column mb-2" style="max-width: 250px;">
            <v-card class="py-2" style="background: #D9D9D9;" elevation-0>
              <v-row no-gutters align="center" class="fill-height">
                <v-icon class="mx-2" color="black">{{ account.icon }}</v-icon>
                {{ account.name }}
              </v-row>
            </v-card>
          </div>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>
<script>
export default {
  name: 'index',
  data() {
    return {
      toggle_exclusive: null,
      accounts: [
        {
          name: 'Administrador',
          icon: 'mdi-account-cog'
        },
        {
          name: 'Comum',
          icon: 'mdi-account'
        },

      ]
    }
  }
}
</script>
