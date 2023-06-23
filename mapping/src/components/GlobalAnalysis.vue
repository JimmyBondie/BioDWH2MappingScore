<script setup lang="ts">
import { MappingManager } from '@/lib/manager'
</script>

<template>
  <v-card>
    <v-toolbar color="primary" :title="$t('Analysis')"></v-toolbar>

    <div class="d-flex flex-row">
      <v-tabs v-model="selectedLabel" direction="vertical">
        <v-tab
          v-for="label in MappingManager.instance.globalAnalysis.keys()"
          :key="label"
          :value="label"
          :text="label"
        >
        </v-tab>
      </v-tabs>

      <v-divider vertical></v-divider>

      <v-window class="w-100" v-model="selectedLabel">
        <v-window-item
          v-for="[label, prefixList] of MappingManager.instance.globalAnalysis"
          :key="label"
          :value="label"
        >
          <div class="d-flex flex-row">
            <v-tabs v-model="selectedPrefix" direction="vertical">
              <v-tab
                v-for="prefix in prefixList.keys()"
                :key="prefix"
                :value="prefix"
                :text="prefix"
              ></v-tab>
            </v-tabs>

            <v-divider vertical></v-divider>

            <v-window class="w-100" v-model="selectedPrefix">
              <v-window-item v-for="[prefix, nodes] of prefixList" :key="prefix" :value="prefix">
                <v-list class="pa-0 w-100" lines="one">
                  <router-link
                    v-for="node of nodes"
                    :key="node.id"
                    :to="{ path: '/' + label, query: { node: node.id } }"
                    custom
                    v-slot="{ navigate }"
                  >
                    <span @click="navigate">
                      <v-list-item
                        :title="node.id"
                        :subtitle="$t('Score') + ': ' + node.getScore(prefix)"
                        :value="node"
                      ></v-list-item>
                    </span>
                  </router-link>
                </v-list>
              </v-window-item>
            </v-window>
          </div>
        </v-window-item>
      </v-window>
    </div>
  </v-card>
</template>

<script lang="ts">
export default {
  data() {
    return {
      selectedLabel: null,
      selectedPrefix: null
    }
  }
}
</script>

<style lang="scss"></style>
