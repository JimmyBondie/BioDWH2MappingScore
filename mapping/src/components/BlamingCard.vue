<script setup lang="ts">
import store from '@/store'
import { mapGetters } from 'vuex'
import { MappingNodeList } from '@/lib/classes'
</script>

<template>
  <v-card>
    <v-toolbar color="primary">
      <v-toolbar-title>{{ $t('CriticalDataSources') }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon="mdi-information-variant-circle-outline" @click="showInformation = true"></v-btn>

      <v-snackbar v-model="showInformation">
        {{ $t('BlamingHelp') }}
        <template v-slot:actions>
          <v-btn icon="mdi-close" color="red" @click="showInformation = false"></v-btn>
        </template>
      </v-snackbar>
    </v-toolbar>

    <div class="d-flex flex-row">
      <v-tabs v-model="selectedSource" direction="vertical">
        <v-tab
          v-for="source in store.state.blamingSources.keys()"
          :key="source"
          :value="source"
          :text="source"
        >
        </v-tab>
      </v-tabs>

      <v-divider vertical></v-divider>

      <v-window class="w-100" v-model="selectedSource">
        <v-window-item
          v-for="[source, prefixList] of store.state.blamingSources"
          :key="source"
          :value="source"
        >
          <div class="d-flex flex-row">
            <v-tabs v-model="selectedPrefix" direction="vertical">
              <v-tab v-for="prefix in prefixList.keys()" :key="prefix" :value="prefix">
                {{ prefix }}
                <v-chip size="x-small">
                  {{ prefixList.get(prefix)?.length }}
                </v-chip>
              </v-tab>
            </v-tabs>

            <v-divider vertical></v-divider>

            <v-window class="w-100" v-model="selectedPrefix">
              <v-window-item v-for="[prefix, nodes] of prefixList" :key="prefix" :value="prefix">
                <v-toolbar>
                  <v-toolbar-title>
                    {{ getCriticalNodesAllOccurrencesText(nodes) }}
                  </v-toolbar-title>
                </v-toolbar>

                <v-list class="pa-0 w-100" lines="one">
                  <router-link
                    v-for="node of nodes"
                    :key="node.id"
                    :to="{ path: '/' + node.label.value, query: { node: node.id } }"
                    custom
                    v-slot="{ navigate }"
                  >
                    <span @click="navigate">
                      <v-list-item
                        :title="node.label.name + ' (' + node.id + ')'"
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
      selectedSource: '',
      selectedPrefix: '',
      showInformation: false
    }
  },
  computed: {
    ...mapGetters(['countRootOccurrences'])
  },
  methods: {
    getCriticalNodesAllOccurrencesText(nodeList: MappingNodeList): string {
      let criticalOccurrences: number = 0
      for (const node of nodeList) {
        criticalOccurrences += node.getRootOccurrences(this.selectedSource, this.selectedPrefix)
      }

      let result: string = this.$t('CriticalNodesRootOccurrences')
      result = result.replace('%0', criticalOccurrences.toString())
      result = result.replace(
        '%1',
        this.countRootOccurrences(this.selectedSource, this.selectedPrefix) || 0
      )
      return result
    }
  }
}
</script>

<style lang="scss"></style>
