<script setup lang="ts"></script>

<template>
  <USeparator class="h-px" />

  <UFooter :ui="{ top: 'border-b border-default' }">
    <template #left>
      <p class="text-sm text-muted">
        Inkuba • © {{ new Date().getFullYear() }}
      </p>
    </template>
  </UFooter>
</template>
