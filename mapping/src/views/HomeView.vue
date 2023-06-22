<script setup lang="ts">
import { MappingManager } from '@/lib/manager'
import GlobalAnalysis from '@/components/GlobalAnalysis.vue'
</script>

<template>
  <main>
    <v-container>
      <v-file-input accept=".json" :label="$t('SelectFile')" v-model="selectedFile"></v-file-input>

      <v-overlay v-model="inProgress" persistent class="align-center justify-center"
        ><v-progress-circular indeterminate size="64" color="primary"></v-progress-circular
      ></v-overlay>

      <v-row>
        <v-col
          class="flex-fill"
          v-for="[label, tree] in MappingManager.instance.nodesPerLabel"
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
        class="mt-10"
        v-if="MappingManager.instance.nodesPerLabel.size > 0"
      ></GlobalAnalysis>
    </v-container>
  </main>
</template>

<script lang="ts">
export default {
  data() {
    return {
      inProgress: false,
      selectedFile: MappingManager.instance.selectedFiles
    }
  },
  watch: {
    async selectedFile([file]: File[]) {
      MappingManager.instance.selectedFiles = this.selectedFile
      if (!file) {
        MappingManager.instance.clear()
        MappingManager.instance.nodesPerLabel.clear()
        return
      }
      this.inProgress = true
      try {
        const text: string = await file.text()
        MappingManager.instance.load(text)
      } finally {
        this.inProgress = false
      }
    }
  }
}
</script>

<style lang="scss"></style>
