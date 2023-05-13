<script setup lang="ts">
import { MappingNode } from '@/lib/classes'
import SimpleMappingNode from '@/components/SimpleMappingNode.vue'

defineProps<{
  node: MappingNode
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
            <MappingTree :node="child"></MappingTree>
          </div>
        </td>

        <td v-bind:class="{ borderLeft: node.children.length > 0 }" class="pa-4 minimumCol">
          <SimpleMappingNode :node="node"></SimpleMappingNode>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts"></script>

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
</style>
