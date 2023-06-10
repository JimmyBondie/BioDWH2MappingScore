<script setup lang="ts">
import { useTheme } from 'vuetify'
import { MappingNode } from '@/lib/classes'
import VChart from 'vue-echarts'

defineProps<{
  node: MappingNode
  prefix: string
}>()
</script>

<template>
  <main>
    <v-chart class="chart-full" autoresize :theme="theme" :option="getOptions()"></v-chart>
  </main>
</template>

<script lang="ts">
import { TreeSeriesOption, EChartsOption, ZRColor } from 'echarts/types/dist/shared'

interface TreeSeriesNodeItemOption {
  itemStyle?: {
    borderColor?: ZRColor
  }
  children?: TreeSeriesNodeItemOption[]
  value?: string | number
  name?: string
}

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
          text: this.prefix,
          left: 'center'
        },
        backgroundColor: 'rgb(var(--v-theme-on-surface-variant))',
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}'
        },
        label: {
          position: 'left',
          verticalAlign: 'middle',
          align: 'right',
          color: 'rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity))'
        }
      }

      const series: TreeSeriesOption = {
        type: 'tree',
        orient: 'RL',
        data: []
      }
      series.data?.push(this.buildSeries(this.node))
      options.series = series

      return options
    },
    buildSeries(node: MappingNode): TreeSeriesNodeItemOption {
      const item: TreeSeriesNodeItemOption = {
        name: node.getScore(this.prefix).toString(),
        value: node.label.value + ' / ' + node.id
      }

      if (node.children.length > 0) {
        item.children = []
        for (const child of node.children) {
          if (child.hasPrefix(this.prefix)) {
            item.children.push(this.buildSeries(child))
          }
        }
      }
      return item
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
