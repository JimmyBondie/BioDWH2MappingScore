<script setup lang="ts">
import { MappingNode } from '@/lib/classes'
import SimpleMappingNode from '@/components/SimpleMappingNode.vue'

defineProps<{
  node: MappingNode
  selectedNodeIds?: Map<string, boolean>
  selectedNodeNames?: Map<string, boolean>
}>()
</script>

<template>
  <v-table class="bg-transparent">
    <tbody>
      <tr>
        <td v-if="node.children.length > 0">
          <div
            v-for="child in node.children"
            :key="child.id"
            v-bind:class="{
              borderBottom: node.children[node.children.length - 1] != child
            }"
          >
            <MappingTree
              :node="child"
              :selected-node-ids="internalSelectedNodeIds"
              :selected-node-names="internalSelectedNodeNames"
            ></MappingTree>
          </div>
        </td>

        <td
          v-bind:class="{ borderLeft: node.children.length > 0 }"
          class="pa-4 minimumCol align-top"
        >
          <SimpleMappingNode
            :node="node"
            :selected-node-ids="internalSelectedNodeIds"
            :selected-node-names="internalSelectedNodeNames"
          ></SimpleMappingNode>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts">
export default {
  data() {
    return {
      internalSelectedNodeIds: this.selectedNodeIds != undefined ? this.selectedNodeIds : new Map(),
      internalSelectedNodeNames:
        this.selectedNodeNames != undefined ? this.selectedNodeNames : new Map()
    }
  }
}
</script>

<style lang="scss">
.minimumCol {
  min-width: 200px;
}

.borderLeft {
  border-left: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.borderBottom {
  border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.align-top {
  vertical-align: baseline;
}
</style>
