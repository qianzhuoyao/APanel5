<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
const { t, locale } = useI18n();
defineProps<{ id: string }>();

const common =
  "relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-md border border-border bg-gradient-to-br from-card to-muted/40";
</script>

<template>
  <div v-if="id === 'bar'" :class="common">
    <div class="absolute inset-0 grid grid-cols-5 items-end gap-1 px-2 pb-2 pt-1.5">
      <div class="h-2 rounded-sm bg-primary/55" />
      <div class="h-4 rounded-sm bg-primary/65" />
      <div class="h-7 rounded-sm bg-primary/80" />
      <div class="h-5 rounded-sm bg-primary/70" />
      <div class="h-3 rounded-sm bg-primary/60" />
    </div>
  </div>
  <div v-else-if="id === 'line' || id === 'area'" :class="common">
    <svg viewBox="0 0 80 60" class="h-full w-full">
      <polygon
        v-if="id === 'area'"
        points="6,42 18,28 34,34 50,20 66,24 74,18 74,56 6,56"
        class="fill-primary/30"
      />
      <polyline
        points="6,42 18,28 34,34 50,20 66,24 74,18"
        fill="none"
        stroke="hsl(var(--primary))"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
  <div v-else-if="id === 'pie'" :class="common">
    <svg viewBox="0 0 80 60" class="h-full w-full">
      <circle cx="40" cy="30" r="16" class="fill-primary/20" />
      <path d="M40 30 L40 14 A16 16 0 0 1 55 39 Z" class="fill-primary/75" />
      <path d="M40 30 L55 39 A16 16 0 0 1 27 43 Z" class="fill-primary/45" />
    </svg>
  </div>
  <div v-else-if="id === 'scatter'" :class="common">
    <svg viewBox="0 0 80 60" class="h-full w-full">
      <circle cx="14" cy="42" r="2.5" class="fill-primary/80" />
      <circle cx="24" cy="34" r="2.5" class="fill-primary/70" />
      <circle cx="36" cy="28" r="2.5" class="fill-primary/75" />
      <circle cx="48" cy="20" r="2.5" class="fill-primary/65" />
      <circle cx="62" cy="14" r="2.5" class="fill-primary/85" />
    </svg>
  </div>
  <div v-else-if="id === 'radar'" :class="common">
    <svg viewBox="0 0 80 60" class="h-full w-full">
      <polygon points="40,10 58,20 54,40 26,40 22,20" class="fill-primary/20 stroke-primary/60" />
      <polygon points="40,16 52,23 49,36 31,36 28,24" class="fill-primary/45 stroke-primary/80" />
    </svg>
  </div>
  <div v-else-if="id === 'gauge'" :class="common">
    <svg viewBox="0 0 80 60" class="h-full w-full">
      <path d="M12 44a28 28 0 0 1 56 0" class="fill-none stroke-primary/35" stroke-width="6" />
      <path d="M12 44a28 28 0 0 1 40-24" class="fill-none stroke-primary/80" stroke-width="6" />
      <line x1="40" y1="44" x2="54" y2="28" class="stroke-primary" stroke-width="2" />
    </svg>
  </div>
  <div v-else-if="id === 'funnel'" :class="common">
    <svg viewBox="0 0 80 60" class="h-full w-full">
      <polygon points="10,10 70,10 58,22 22,22" class="fill-primary/80" />
      <polygon points="22,24 58,24 50,34 30,34" class="fill-primary/65" />
      <polygon points="30,36 50,36 44,44 36,44" class="fill-primary/50" />
    </svg>
  </div>
  <div v-else-if="id === 'text'" :class="common">
    <div class="space-y-1.5 px-2 py-2">
      <div class="h-2 w-10 rounded bg-primary/70" />
      <div class="h-1.5 w-full rounded bg-muted-foreground/45" />
      <div class="h-1.5 w-11/12 rounded bg-muted-foreground/45" />
      <div class="h-1.5 w-8/12 rounded bg-muted-foreground/45" />
    </div>
  </div>
  <div v-else-if="id === 'table'" :class="common">
    <div class="absolute inset-0 flex flex-col gap-1 p-2">
      <div class="grid h-3 flex-none grid-cols-3 gap-1">
        <div class="rounded-sm bg-primary/75" />
        <div class="rounded-sm bg-primary/65" />
        <div class="rounded-sm bg-primary/70" />
      </div>
      <div class="grid min-h-0 flex-1 grid-cols-3 gap-1">
        <div
          v-for="idx in 6"
          :key="idx"
          class="rounded-sm border border-primary/25 bg-primary/10"
        />
      </div>
    </div>
  </div>
  <div v-else-if="id === 'rect'" :class="common">
    <div class="absolute inset-2 rounded-md border-2 border-primary/80 bg-primary/15" />
  </div>
  <div v-else-if="id === 'geometry'" :class="common">
    <svg viewBox="0 0 80 60" class="h-full w-full">
      <circle cx="22" cy="18" r="8" class="fill-primary/75" />
      <rect x="36" y="10" width="16" height="16" rx="3" class="fill-primary/55" />
      <polygon points="62,10 70,26 54,26" class="fill-primary/65" />
      <polygon points="24,36 34,42 24,48 14,42" class="fill-primary/50" />
      <polygon points="50,36 54,42 50,48 42,48 38,42 42,36" class="fill-primary/70" />
    </svg>
  </div>
  <div v-else-if="id === 'scene3d'" :class="common">
    <svg viewBox="0 0 80 60" class="h-full w-full">
      <polygon points="40,8 62,22 62,44 40,56 18,44 18,22" class="fill-primary/20 stroke-primary/80" stroke-width="1.5" />
      <polygon points="40,8 62,22 40,32 18,22" class="fill-primary/45" />
      <polygon points="40,32 62,22 62,44 40,56" class="fill-primary/30" />
      <polygon points="40,32 18,22 18,44 40,56" class="fill-primary/55" />
    </svg>
  </div>
  <div v-else-if="id === 'reference'" :class="common">
    <div class="absolute inset-2 rounded-md border border-dashed border-primary/70 bg-primary/10" />
    <div class="absolute inset-0 flex items-center justify-center text-[10px] text-primary/80">
      {{ t("panel.material.reference") }}
    </div>
  </div>
  <div v-else-if="id === 'image'" :class="common">
    <div class="absolute inset-0 bg-gradient-to-br from-primary/25 via-muted/60 to-card" />
    <svg viewBox="0 0 80 60" class="absolute inset-0 h-full w-full">
      <circle cx="16" cy="14" r="5" class="fill-primary/70" />
      <polygon points="0,60 24,34 38,50 52,30 80,60" class="fill-primary/35" />
      <polygon points="0,60 18,42 30,54 44,36 62,60" class="fill-primary/55" />
    </svg>
  </div>
  <div v-else-if="id === 'video'" :class="common">
    <div class="absolute inset-0 bg-primary/12" />
    <div class="absolute left-2 right-2 top-2 h-1.5 rounded bg-primary/35" />
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="rounded-full bg-background/80 p-1">
        <div
          class="h-0 w-0 border-b-[7px] border-l-[11px] border-t-[7px] border-b-transparent border-l-primary/85 border-t-transparent"
        />
      </div>
    </div>
  </div>
  <div v-else-if="id === 'audio'" :class="common">
    <div class="absolute inset-0 flex items-center justify-center gap-1">
      <div class="h-3 w-1.5 rounded bg-primary/50" />
      <div class="h-6 w-1.5 rounded bg-primary/75" />
      <div class="h-8 w-1.5 rounded bg-primary/90" />
      <div class="h-5 w-1.5 rounded bg-primary/70" />
      <div class="h-4 w-1.5 rounded bg-primary/55" />
    </div>
  </div>
  <div v-else-if="id === 'grid'" :class="common">
    <div class="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-1.5 p-2">
      <div
        v-for="idx in 6"
        :key="idx"
        class="rounded-sm border border-dashed border-primary/55 bg-primary/10"
      />
    </div>
  </div>
  <div v-else :class="common" />
</template>
