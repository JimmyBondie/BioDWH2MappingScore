<script setup lang="ts">
import GlobalAnalysis from '@/components/GlobalAnalysis.vue'
import store from '@/store'
import { mapMutations } from 'vuex'
</script>

<template>
  <main>
    <v-container>
      <v-file-input accept=".json" :label="$t('SelectFile')" v-model="selectedFiles"></v-file-input>

      <v-overlay v-model="inProgress" persistent class="align-center justify-center"
        ><v-progress-circular indeterminate size="64" color="primary"></v-progress-circular
      ></v-overlay>

      <v-row>
        <v-col
          class="flex-fill"
          v-for="[label, tree] in store.state.nodesPerLabel"
          :key="label"
          :value="label"
          cols="auto"
        >
          <router-link :to="'/' + label" custom v-slot="{ navigate }">
            <v-card
              @click="navigate"
              :title="label"
              :subtitle="$t('Trees') + ': ' + tree.length.toString()"
            >
            </v-card>
          </router-link>
        </v-col>
      </v-row>

      <GlobalAnalysis
        :key="analysisKey"
        class="mt-10"
        v-if="store.state.nodesPerLabel.size > 0"
      ></GlobalAnalysis>
    </v-container>
  </main>
</template>

<script lang="ts">
export default {
  data() {
    return {
      inProgress: false,
      selectedFiles: store.state.selectedFiles,
      analysisKey: 0
    }
  },
  methods: {
    ...mapMutations(['loadNodes', 'setSelectedFiles', 'clearNodes'])
  },
  watch: {
    async selectedFiles([file]: File[]) {
      this.setSelectedFiles(this.selectedFiles)
      if (!file) {
        this.clearNodes()
        return
      }

      this.inProgress = true
      try {
        const text: string = await file.text()
        this.loadNodes(text)
        this.analysisKey++
      } finally {
        this.inProgress = false
      }
    }
  }
}
</script>

<style lang="scss"></style>
