<script setup lang="ts">
import { MappingNode, MappingNodeList } from '@/lib/classes'
import MappingTree from '@/components/MappingTree.vue'
import { MappingManager } from '@/lib/manager'
import { LocationQueryValue } from 'vue-router'
</script>

<template>
  <main>
    <v-container>
      <v-select :label="$t('SelectNode')" :items="nodeList" v-model="selectedNode">
        <template v-slot:selection="{ item }">
          {{ item.value.id + ' (' + item.value.ids.length + ' ' + $t('Ids') + ')' }}
        </template>

        <template #item="{ item, props }">
          <v-list-item
            v-bind="props"
            :title="item.value.id"
            :subtitle="item.value.ids.length + ' ' + $t('Ids')"
          ></v-list-item>
        </template>
      </v-select>
    </v-container>

    <MappingTree v-if="selectedNode" :node="(selectedNode as MappingNode)"></MappingTree>
  </main>
</template>

<script lang="ts">
export default {
  data(): {
    nodeList: MappingNodeList | undefined
    selectedNode: MappingNode | undefined
  } {
    return {
      nodeList: MappingManager.instance.nodesPerLabel.get(this.$route.params['label'] as string),
      selectedNode: undefined
    }
  },
  created() {
    const id: LocationQueryValue = this.$route.query['node'] as LocationQueryValue
    if (id) {
      const node: MappingNode | undefined = MappingManager.instance.get(Number.parseInt(id))
      if (node) {
        this.selectedNode = node
      }
    }
  }
}
</script>

<style lang="scss"></style>
