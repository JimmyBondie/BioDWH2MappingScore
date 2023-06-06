<script setup lang="ts">
import { useTheme } from 'vuetify'
import { MappingNode } from '@/lib/classes'
import VChart from 'vue-echarts'

defineProps<{
  node: MappingNode
}>()
</script>

<template>
  <main>
    <v-chart class="chart-full" autoresize :theme="theme" :option="getOptions()"></v-chart>
  </main>
</template>

<script lang="ts">
import { BarSeriesOption, EChartsOption, XAXisOption } from 'echarts/types/dist/shared'

export default {
  data() {
    return {
      theme: useTheme().global.name
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
          name: this.$t('Score')
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

      for (const prefix of this.node.getPrefixes()) {
        xAxis.data?.push(prefix)
        series.data?.push(this.node.getScore(prefix))
      }

      options.xAxis = xAxis
      options.series = series

      return options
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
