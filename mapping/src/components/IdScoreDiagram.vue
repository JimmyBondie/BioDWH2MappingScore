<script setup lang="ts">
import { useTheme } from 'vuetify'
import { MappingNode } from '@/lib/classes'
import VChart from 'vue-echarts'
import TreeAnalysis from '@/components/TreeAnalysis.vue'

defineProps<{
  node: MappingNode
}>()
</script>

<template>
  <main>
    <v-chart
      class="chart-full"
      autoresize
      :theme="theme"
      :option="getOptions()"
      @click="onClickChart"
    ></v-chart>

    <v-overlay v-model="showPrefixAnalysis" class="align-center justify-center">
      <TreeAnalysis :node="node" :prefix="analyzedPrefix"></TreeAnalysis>
    </v-overlay>
  </main>
</template>

<script lang="ts">
import {
  BarSeriesOption,
  ECElementEvent,
  EChartsOption,
  XAXisOption
} from 'echarts/types/dist/shared'
import { compareNatural } from 'mathjs'

export default {
  data() {
    return {
      theme: useTheme().global.name,
      showPrefixAnalysis: false,
      analyzedPrefix: ''
    }
  },
  methods: {
    getOptions(): EChartsOption {
      const options: EChartsOption = {
        title: {
          text: this.node.label.value + ' / ' + this.node.id,
          left: 'center'
        },
        yAxis: {
          type: 'value',
          name: this.$t('Score'),
          triggerEvent: true
        },
        backgroundColor: 'rgb(var(--v-theme-on-surface-variant))',
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}'
        }
      }

      const xAxis: XAXisOption = {
        type: 'category',
        name: this.$t('Prefixes'),
        data: []
      }
      const series: BarSeriesOption = {
        type: 'bar',
        data: []
      }

      const badPrefixes: Array<string> = this.node.getBadPrefixes()
      const prefixes: Array<string> = this.node.getPrefixes()
      prefixes.sort((prefixA, prefixB) =>
        compareNatural(this.node.getScore(prefixA), this.node.getScore(prefixB))
      )

      for (const prefix of prefixes) {
        xAxis.data?.push(prefix)

        if (badPrefixes.includes(prefix)) {
          series.data?.push({
            value: this.node.getScore(prefix),
            itemStyle: {
              color: 'red'
            }
          })
        } else {
          series.data?.push(this.node.getScore(prefix))
        }
      }

      options.xAxis = xAxis
      options.series = series

      return options
    },
    onClickChart(event: ECElementEvent) {
      this.analyzedPrefix = event.name
      this.showPrefixAnalysis = true
    }
  }
}
</script>

<style lang="scss">
.chart-full {
  width: 75vw;
  height: 75vh;
}
</style>
