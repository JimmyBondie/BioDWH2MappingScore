<script setup lang="ts">
import { mergeProps } from 'vue'
import { RouterView } from 'vue-router'
import { useDisplay, useLocale, useTheme } from 'vuetify'
</script>

<template>
  <v-app>
    <v-locale-provider :locale="language">
      <v-theme-provider :theme="theme">
        <v-toolbar>
          <router-link to="/" custom v-slot="{ navigate }">
            <v-img
              class="cursor-pointer"
              @click="navigate"
              v-if="useDisplay().width.value >= 550"
              src="./Logo.svg"
              max-width="170"
            ></v-img>
            <v-toolbar-title class="cursor-pointer" @click="navigate">Mapping-Spy</v-toolbar-title>
          </router-link>

          <v-menu>
            <template v-slot:activator="{ props: menu }">
              <v-tooltip text="Language" location="bottom">
                <template v-slot:activator="{ props: tooltip }">
                  <v-btn v-bind="mergeProps(menu, tooltip)" icon="mdi-translate"> </v-btn>
                </template>
              </v-tooltip>
            </template>

            <v-btn-toggle v-model="language">
              <v-btn value="de">Deutsch</v-btn>
              <v-btn value="en">English</v-btn>
            </v-btn-toggle>
          </v-menu>

          <v-tooltip :text="$t('Theme')" location="bottom">
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

          <v-tooltip :text="$t('Documentation')" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-file-document"
                href="https://github.com/BioDWH2/BioDWH2/blob/master/README.md"
              ></v-btn>
            </template>
          </v-tooltip>

          <v-tooltip :text="$t('ReportError')" location="bottom">
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
            <a href="https://agbi.techfak.uni-bielefeld.de" target="_blank"
              >{{ $t('BioinformaticsDepartment') }} </a
            >, <a href="https://techfak.de" target="_blank">{{ $t('FacultyOfTechnology') }}</a
            >,
            <a href="https://www.uni-bielefeld.de" target="_blank">{{
              $t('BielefeldUniversity')
            }}</a>
          </div>
        </v-footer>
      </v-theme-provider>
    </v-locale-provider>
  </v-app>
</template>

<script lang="ts">
export default {
  data() {
    return {
      themeDark: 'dark',
      themeLight: 'light',
      theme: useTheme().global.name,
      language: useLocale().current.value
    }
  },
  mounted() {
    if (window.matchMedia('(prefers-color-scheme: dark)')) {
      this.theme = this.themeDark
    } else {
      this.theme = this.themeLight
    }
  },
  watch: {
    language() {
      this.$i18n.locale = this.language
    }
  },
  methods: {
    toggleTheme(): void {
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

.cursor-pointer {
  cursor: pointer;
}
</style>
