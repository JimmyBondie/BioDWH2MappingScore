<script setup lang="ts">
import { MappingNode, MappingNodeList } from '@/lib/classes'
import MappingTree from '@/components/MappingTree.vue'
import { LocationQueryValue } from 'vue-router'
</script>

<template>
  <main>
    <v-container class="d-flex align-center">
      <h1 class="mr-4">{{ getLabel() }}</h1>

      <v-select :label="$t('SelectNode')" :items="nodeList" v-model="selectedNode" hide-details>
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
import { mapGetters } from 'vuex'
import store from '@/store'

export default {
  data(): {
    nodeList: MappingNodeList | undefined
    selectedNode: MappingNode | undefined
  } {
    return {
      nodeList: store.getters.getNodesByLabel(this.getLabel()),
      selectedNode: undefined
    }
  },
  computed: {
    ...mapGetters(['getNode'])
  },
  methods: {
    getLabel(): string {
      return this.$route.params['label'] as string
    }
  },
  created() {
    const id: LocationQueryValue = this.$route.query['node'] as LocationQueryValue
    if (id) {
      const node: MappingNode | undefined = this.getNode(Number.parseInt(id))
      if (node) {
        this.selectedNode = node
      }
    }
  }
}
</script>

<style lang="scss"></style>
