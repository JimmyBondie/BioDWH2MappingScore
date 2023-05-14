<script setup lang="ts">
import { MappingNode } from '@/lib/classes'

defineProps<{
  node: MappingNode
  selectedNodeIds?: Map<string, boolean>
  selectedNodeNames?: Map<string, boolean>
}>()
</script>

<template>
  <v-card :title="node.label" :subtitle="node.id.toString()">
    <v-card-item :subtitle="$t('Ids')">
      <v-chip-group>
        <v-chip
          class="userSelectNone"
          size="x-small"
          :ripple="false"
          v-for="id of node.ids"
          :key="id.value"
          :variant="selectedNodeIds?.get(id.value) ? 'outlined' : undefined"
          @click="onClickIdChip(id.value)"
          >{{ id.value }}</v-chip
        ></v-chip-group
      >
    </v-card-item>

    <v-card-item :subtitle="$t('Names')">
      <v-chip-group>
        <v-chip
          class="userSelectNone"
          size="x-small"
          :ripple="false"
          v-for="name of node.names"
          :key="name"
          :variant="selectedNodeNames?.get(name) ? 'outlined' : undefined"
          @click="onClickNameChip(name)"
          >{{ name }}</v-chip
        ></v-chip-group
      >
    </v-card-item>

    <v-card-item :subtitle="$t('Prefixes')">
      <v-chip-group>
        <v-chip
          class="userSelectNone"
          size="x-small"
          :ripple="false"
          v-for="prefix of node.getPrefixes()"
          :key="prefix"
          >{{ prefix }}</v-chip
        ></v-chip-group
      >
    </v-card-item>
  </v-card>
</template>

<script lang="ts">
export default {
  data() {
    return {}
  },
  methods: {
    onClickIdChip(id: string) {
      this.selectedNodeIds?.set(id, !this.selectedNodeIds?.get(id))
    },
    onClickNameChip(name: string) {
      this.selectedNodeNames?.set(name, !this.selectedNodeNames?.get(name))
    }
  }
}
</script>

<style lang="scss">
.userSelectNone {
  user-select: none;
}
</style>
