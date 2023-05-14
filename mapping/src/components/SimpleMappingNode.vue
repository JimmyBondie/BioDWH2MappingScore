<script setup lang="ts">
import { MappingNode } from '@/lib/classes'

defineProps<{
  node: MappingNode
  selectedNodeIds?: Map<string, boolean>
  selectedNodeNames?: Map<string, boolean>
}>()
</script>

<template>
  <v-card density="compact" :title="node.label.value" :subtitle="node.id.toString()">
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

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn @click="toggleExpanded">{{ expanded ? $t('Collapse') : $t('Expand') }}</v-btn>

      <v-spacer></v-spacer>

      <v-btn
        :icon="expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        @click="toggleExpanded"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
export default {
  data() {
    return {
      expanded: false
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
    }
  }
}
</script>

<style lang="scss">
.userSelectNone {
  user-select: none;
}
</style>
