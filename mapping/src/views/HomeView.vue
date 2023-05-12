<script setup lang="ts">
import LabelBoard from '@/components/LabelBoard.vue'
</script>

<template>
  <v-container>
    <v-file-input accept=".json" label="File input" v-model="selectedFile"></v-file-input>

    <v-overlay v-model="inProgress" persistent class="align-center justify-center"
      ><v-progress-circular indeterminate size="64" color="primary"></v-progress-circular
    ></v-overlay>

    <v-tabs v-model="labelNodes">
      <v-tab v-for="[label, nodes] of manager.nodesPerLabel" :key="label" :value="nodes">
        {{ label }}
      </v-tab>
    </v-tabs>

    <LabelBoard v-if="labelNodes != null" :nodeList="labelNodes"></LabelBoard>
  </v-container>
</template>

<script lang="ts">
import { MappingManager } from '@/lib/manager'
export default {
  data() {
    return {
      inProgress: false,
      selectedFile: [],
      labelNodes: null,
      manager: new MappingManager()
    }
  },
  watch: {
    async selectedFile([file]: File[]) {
      if (!file) {
        this.manager.clear()
        return
      }

      this.inProgress = true
      try {
        const text: string = await file.text()
        this.manager.load(text)
      } finally {
        this.inProgress = false
      }
    }
  }
}
</script>

<style lang="scss"></style>
