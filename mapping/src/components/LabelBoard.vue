<script setup lang="ts">
import { MappingNodeList } from '@/lib/classes'
import MappingTree from '@/components/MappingTree.vue'

defineProps<{
  nodeList: MappingNodeList
}>()
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

    <MappingTree v-if="selectedNode != null" :node="selectedNode"></MappingTree>
  </main>
</template>

<script lang="ts">
export default {
  data() {
    return {
      selectedNode: null
    }
  }
}
</script>

<style lang="scss"></style>
