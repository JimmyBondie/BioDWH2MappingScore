<script setup lang="ts">
import { useDisplay, useTheme } from 'vuetify'
import { RouterView } from 'vue-router'
</script>

<template>
  <v-app>
    <v-theme-provider theme="{{ theme }}">
      <v-toolbar>
        <v-img v-if="useDisplay().width.value >= 550" src="./Logo.svg" max-width="170"></v-img>
        <v-toolbar-title>Mapping-Spy</v-toolbar-title>

        <v-tooltip text="Theme" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn
              v-if="useTheme().global.current.value.dark"
              v-bind="props"
              @click="toggleTheme"
              icon="mdi-weather-sunny"
            ></v-btn>
            <v-btn
              v-if="!useTheme().global.current.value.dark"
              v-bind="props"
              @click="toggleTheme"
              icon="mdi-weather-night"
            ></v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="GitHub" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="mdi-github" href="https://github.com/BioDWH2"></v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="Documentation" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-file-document"
              href="https://github.com/BioDWH2/BioDWH2/blob/master/README.md"
            ></v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="Issues" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-bug"
              href="https://github.com/BioDWH2/BioDWH2/issues"
            ></v-btn>
          </template>
        </v-tooltip>
      </v-toolbar>

      <RouterView />

      <v-spacer></v-spacer>
      <v-spacer></v-spacer>

      <v-footer>
        <div class="links">
          &copy; 2023 -
          <a href="https://agbi.techfak.uni-bielefeld.de" target="_blank">
            Bioinformatics/Medical Informatics department
          </a>
          , <a href="https://techfak.de" target="_blank">Faculty of Technology</a>,
          <a href="https://www.uni-bielefeld.de" target="_blank">Bielefeld University</a>
        </div>
      </v-footer>
    </v-theme-provider>
  </v-app>
</template>

<script lang="ts">
export default {
  data() {
    return {
      themeDark: 'dark',
      themeLight: 'light',
      theme: useTheme().global.name
    }
  },
  mounted() {
    if (window.matchMedia('(prefers-color-scheme: dark)')) {
      this.theme = this.themeDark
    } else {
      this.theme = this.themeLight
    }
  },
  methods: {
    toggleTheme() {
      if (this.theme == this.themeDark) {
        this.theme = this.themeLight
      } else {
        this.theme = this.themeDark
      }
    }
  }
}
</script>

<style lang="scss">
html {
  overflow-y: unset !important;
}

.links {
  a {
    &:link,
    &:visited,
    &:hover,
    &:active {
      text-decoration: none;
      color: inherit;
    }
  }
}
</style>
