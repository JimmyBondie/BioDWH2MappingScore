<script setup lang="ts">
import { MappingNodeList } from '@/lib/classes'
import MappingTree from '@/components/MappingTree.vue'

defineProps<{
  nodeList: MappingNodeList
}>()
</script>

<template>
  <v-container>
    <v-btn-toggle v-model="nodeListVisible">
      <v-btn
        v-if="nodeListVisible"
        :value="false"
        prepend-icon="mdi-arrow-collapse-left"
        variant="text"
        >Collapse</v-btn
      >
      <v-btn
        v-if="!nodeListVisible"
        :value="true"
        append-icon="mdi-arrow-collapse-right"
        variant="text"
        >Expand</v-btn
      ></v-btn-toggle
    >
    <v-row>
      <v-col class="v-col-3" v-if="nodeListVisible">
        <v-list v-model:selected="selectedNodes">
          <v-list-item
            v-for="node in nodeList"
            :key="node.id"
            :value="node"
            :title="node.id"
            :subtitle="node.ids.length + ' Ids'"
          ></v-list-item>
        </v-list>
      </v-col>

      <v-divider vertical v-if="nodeListVisible"></v-divider>

      <v-col
        ><MappingTree v-if="selectedNodes.length == 1" :node="selectedNodes[0]"></MappingTree>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
export default {
  data() {
    return {
      selectedNodes: [],
      nodeListVisible: true
    }
  }
}
</script>

<style lang="scss"></style>
