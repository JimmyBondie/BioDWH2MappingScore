<script setup lang="ts">
import { MappingNode } from '@/lib/classes'

defineProps<{
  node: MappingNode
}>()
</script>

<template>
  <v-card :title="node.label" :subtitle="node.id.toString()">
    <v-card-item subtitle="Ids">
      <v-chip size="x-small" v-for="id of node.ids" :key="id.asString()">{{
        id.asString()
      }}</v-chip>
    </v-card-item>

    <v-card-item subtitle="Test">
      <v-chip size="x-small" v-for="name of node.names" :key="name">{{ name }}</v-chip>
    </v-card-item>

    <v-card-item subtitle="Prefixes">
      <v-chip size="x-small" v-for="prefix of node.getPrefixes()" :key="prefix">{{
        prefix
      }}</v-chip>
    </v-card-item>
  </v-card>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
