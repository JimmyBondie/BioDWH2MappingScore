<script setup lang="ts"></script>

<template>
  <v-container>
    <v-file-input accept=".json" label="File input" v-model="selectedFile"></v-file-input>

    <v-overlay v-model="inProgress" persistent class="align-center justify-center"
      ><v-progress-circular indeterminate size="64" color="primary"></v-progress-circular
    ></v-overlay>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      inProgress: false,
      selectedFile: []
    }
  },
  watch: {
    async selectedFile([file]) {
      if (!file) {
        return
      }

      this.inProgress = true
      try {
        const lines = (await file.text()).split('\n')
        for (var line in lines) {
          JSON.parse(line)
        }
      } finally {
        this.inProgress = false
      }
    }
  }
}
</script>

<style lang="scss"></style>
