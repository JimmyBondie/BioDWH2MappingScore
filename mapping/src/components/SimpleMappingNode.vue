<script setup lang="ts">
import { MappingNode } from '@/lib/classes'
import IdScoreDiagram from '@/components/IdScoreDiagram.vue'

defineProps<{
  node: MappingNode
  selectedNodeIds?: Map<string, boolean>
  selectedNodeNames?: Map<string, boolean>
}>()
</script>

<template>
  <v-card density="compact">
    <v-row class="flex-nowrap">
      <v-col>
        <v-card-title>{{ node.label.value }}</v-card-title>
        <v-card-subtitle>{{ node.id.toString() }}</v-card-subtitle>
      </v-col>
      <v-col class="d-flex justify-end align-center pa-6">
        <v-tooltip :text="$t('Analyze')" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              @click="onClickAnalyzeIdScores"
              density="compact"
              variant="text"
              icon="mdi-magnify"
            >
            </v-btn>
            <v-overlay v-model="showScoreDiagram" class="align-center justify-center">
              <IdScoreDiagram :node="node"></IdScoreDiagram>
            </v-overlay>
          </template>
        </v-tooltip>

        <v-tooltip :text="expanded ? $t('Collapse') : $t('Expand')" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              density="compact"
              variant="text"
              :icon="expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              @click="toggleExpanded"
            ></v-btn>
          </template>
        </v-tooltip>
      </v-col>
    </v-row>

    <v-card-item :subtitle="$t('Ids')">
      <v-chip-group>
        <v-chip
          class="userSelectNone"
          size="small"
          :ripple="false"
          v-for="id of node.ids"
          :key="id.value"
          :variant="selectedNodeIds?.get(id.value) ? 'outlined' : undefined"
          @click="onClickIdChip(id.value)"
          >{{ id.value }}
        </v-chip>
      </v-chip-group>
    </v-card-item>

    <v-expand-transition>
      <div v-show="expanded">
        <v-card-item :subtitle="$t('Names')">
          <v-chip-group>
            <v-chip
              class="userSelectNone"
              size="small"
              :ripple="false"
              v-for="name of node.names"
              :key="name"
              :variant="selectedNodeNames?.get(name) ? 'outlined' : undefined"
              @click="onClickNameChip(name)"
              >{{ name }}
            </v-chip>
          </v-chip-group>
        </v-card-item>

        <v-card-item :subtitle="$t('Prefixes')">
          <v-chip-group>
            <v-chip
              class="userSelectNone"
              size="small"
              :ripple="false"
              v-for="prefix of node.getPrefixes()"
              :key="prefix"
              :text="prefix"
            >
              <template v-slot:append>
                <v-chip class="ma-0 ml-2 text-green" :ripple="false" size="x-small" color="red">
                  {{ node.getScore(prefix) }}
                </v-chip>
              </template>
            </v-chip>
          </v-chip-group>
        </v-card-item>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script lang="ts">
export default {
  data() {
    return {
      expanded: false,
      showScoreDiagram: false
    }
  },
  methods: {
    toggleExpanded(): void {
      this.expanded = !this.expanded
    },
    onClickIdChip(id: string): void {
      this.selectedNodeIds?.set(id, !this.selectedNodeIds?.get(id))
    },
    onClickNameChip(name: string): void {
      this.selectedNodeNames?.set(name, !this.selectedNodeNames?.get(name))
    },
    onClickAnalyzeIdScores(): void {
      this.showScoreDiagram = true
    }
  }
}
</script>

<style lang="scss">
.userSelectNone {
  user-select: none;
}
</style>
