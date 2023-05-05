<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <v-app>
    <v-toolbar>
      <v-img v-if="$windowWidth >= 500" src="./Logo.svg" max-width="170"></v-img>
      <v-toolbar-title>Mapping-Spy</v-toolbar-title>

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

    <v-footer app>
      <div class="links">
        &copy; 2023 -
        <a
          class="text-decoration-none"
          href="https://agbi.techfak.uni-bielefeld.de"
          target="_blank"
        >
          Bioinformatics/Medical Informatics department </a
        >,
        <a class="text-decoration-none" href="https://techfak.de" target="_blank"
          >Faculty of Technology</a
        >,
        <a class="text-decoration-none" href="https://www.uni-bielefeld.de" target="_blank"
          >Bielefeld University</a
        >
      </div>
    </v-footer>
  </v-app>
</template>

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
      text-decoration: #000000 !important;
      color: black;
    }
  }
}
</style>
