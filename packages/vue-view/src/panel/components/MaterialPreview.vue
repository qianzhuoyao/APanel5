<script setup lang="ts">
import { useI18n } from "@arronqzy/i18n/vue";
const { t } = useI18n();
defineProps<{ id: string }>();

const common =
  "rv-material-preview relative mx-auto aspect-[4/3] w-full shrink-0 overflow-hidden rounded-md border border-border/60 bg-gradient-to-br from-card to-muted/35";
</script>

<template>
  <div v-if="id === 'bar'" :class="common">
    <svg viewBox="0 0 80 60" class="h-full w-full" aria-hidden="true">
      <rect x="8" y="40" width="8" height="12" rx="1.5" class="fill-primary/55" />
      <rect x="22" y="30" width="8" height="22" rx="1.5" class="fill-primary/65" />
      <rect x="36" y="16" width="8" height="36" rx="1.5" class="fill-primary/80" />
      <rect x="50" y="24" width="8" height="28" rx="1.5" class="fill-primary/70" />
      <rect x="64" y="34" width="8" height="18" rx="1.5" class="fill-primary/60" />
    </svg>
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
    <svg viewBox="0 0 80 60" class="h-full w-full" aria-hidden="true">
      <rect x="12" y="14" width="28" height="5" rx="1.5" class="fill-primary/75" />
      <rect x="12" y="26" width="56" height="3.5" rx="1" class="fill-muted-foreground/45" />
      <rect x="12" y="34" width="50" height="3.5" rx="1" class="fill-muted-foreground/45" />
      <rect x="12" y="42" width="40" height="3.5" rx="1" class="fill-muted-foreground/45" />
    </svg>
  </div>
  <div v-else-if="id === 'table'" :class="common">
    <svg viewBox="0 0 80 60" class="h-full w-full" aria-hidden="true">
      <rect x="10" y="10" width="18" height="8" rx="1.5" class="fill-primary/75" />
      <rect x="31" y="10" width="18" height="8" rx="1.5" class="fill-primary/65" />
      <rect x="52" y="10" width="18" height="8" rx="1.5" class="fill-primary/70" />
      <template v-for="row in 2" :key="`r${row}`">
        <rect
          v-for="col in 3"
          :key="`c${col}`"
          :x="10 + (col - 1) * 21"
          :y="24 + (row - 1) * 14"
          width="18"
          height="10"
          rx="1.5"
          class="fill-primary/10 stroke-primary/30"
          stroke-width="1"
        />
      </template>
    </svg>
  </div>
  <div v-else-if="id === 'rect'" :class="common">
    <svg viewBox="0 0 80 60" class="h-full w-full" aria-hidden="true">
      <rect
        x="14"
        y="12"
        width="52"
        height="36"
        rx="4"
        class="fill-primary/15 stroke-primary/80"
        stroke-width="2.5"
      />
    </svg>
  </div>
  <div v-else-if="id === 'geometry'" :class="common">
    <svg viewBox="0 0 80 60" class="h-full w-full" aria-hidden="true">
      <circle cx="22" cy="18" r="8" class="fill-primary/75" />
      <rect x="36" y="10" width="16" height="16" rx="3" class="fill-primary/55" />
      <polygon points="62,10 70,26 54,26" class="fill-primary/65" />
      <polygon points="24,36 34,42 24,48 14,42" class="fill-primary/50" />
      <polygon points="50,36 54,42 50,48 42,48 38,42 42,36" class="fill-primary/70" />
    </svg>
  </div>
  <div v-else-if="id === 'scene3d'" :class="common">
    <svg viewBox="0 0 80 60" class="h-full w-full" aria-hidden="true">
      <polygon
        points="40,8 62,22 62,44 40,56 18,44 18,22"
        class="fill-primary/20 stroke-primary/80"
        stroke-width="1.5"
      />
      <polygon points="40,8 62,22 40,32 18,22" class="fill-primary/45" />
      <polygon points="40,32 62,22 62,44 40,56" class="fill-primary/30" />
      <polygon points="40,32 18,22 18,44 40,56" class="fill-primary/55" />
    </svg>
  </div>
  <div v-else-if="id === 'reference'" :class="common">
    <svg viewBox="0 0 80 60" class="h-full w-full" aria-hidden="true">
      <rect
        x="14"
        y="12"
        width="52"
        height="36"
        rx="4"
        fill="none"
        class="stroke-primary/70"
        stroke-width="1.8"
        stroke-dasharray="4 3"
      />
      <rect x="18" y="16" width="44" height="28" rx="2" class="fill-primary/10" />
      <text
        x="40"
        y="34"
        text-anchor="middle"
        class="fill-primary/80"
        style="font-size: 9px; font-weight: 600"
      >
        {{ t("panel.material.reference") }}
      </text>
    </svg>
  </div>
  <div v-else-if="id === 'image'" :class="common">
    <svg viewBox="0 0 80 60" class="h-full w-full" aria-hidden="true">
      <rect x="0" y="0" width="80" height="60" class="fill-muted/40" />
      <circle cx="22" cy="18" r="6" class="fill-primary/70" />
      <polygon points="0,60 28,32 42,48 56,28 80,60" class="fill-primary/35" />
      <polygon points="0,60 20,40 34,52 48,36 70,60" class="fill-primary/55" />
    </svg>
  </div>
  <div v-else-if="id === 'video'" :class="common">
    <svg viewBox="0 0 80 60" class="h-full w-full" aria-hidden="true">
      <rect x="0" y="0" width="80" height="60" class="fill-primary/12" />
      <rect x="10" y="8" width="60" height="4" rx="2" class="fill-primary/35" />
      <circle cx="40" cy="34" r="12" class="fill-background/90 stroke-primary/40" stroke-width="1" />
      <polygon points="36,27 36,41 48,34" class="fill-primary/85" />
    </svg>
  </div>
  <div v-else-if="id === 'audio'" :class="common">
    <svg viewBox="0 0 80 60" class="h-full w-full" aria-hidden="true">
      <rect x="22" y="30" width="5" height="12" rx="1.5" class="fill-primary/50" />
      <rect x="31" y="22" width="5" height="20" rx="1.5" class="fill-primary/75" />
      <rect x="40" y="14" width="5" height="28" rx="1.5" class="fill-primary/90" />
      <rect x="49" y="24" width="5" height="18" rx="1.5" class="fill-primary/70" />
      <rect x="58" y="28" width="5" height="14" rx="1.5" class="fill-primary/55" />
    </svg>
  </div>
  <div v-else-if="id === 'grid'" :class="common">
    <svg viewBox="0 0 80 60" class="h-full w-full" aria-hidden="true">
      <template v-for="row in 2" :key="`gr${row}`">
        <rect
          v-for="col in 3"
          :key="`gc${col}`"
          :x="10 + (col - 1) * 22"
          :y="10 + (row - 1) * 22"
          width="18"
          height="16"
          rx="2"
          fill="none"
          class="stroke-primary/55 fill-primary/10"
          stroke-width="1.2"
          stroke-dasharray="3 2"
        />
      </template>
    </svg>
  </div>
  <div v-else-if="id === 'viewport'" :class="common">
    <svg viewBox="0 0 80 60" class="h-full w-full" aria-hidden="true">
      <rect
        x="8"
        y="8"
        width="64"
        height="44"
        rx="3"
        class="fill-primary/10 stroke-primary/70"
        stroke-width="1.5"
      />
      <rect x="14" y="14" width="22" height="16" rx="2" class="fill-primary/45" />
      <rect x="28" y="24" width="28" height="18" rx="2" class="fill-primary/30" />
      <rect x="54" y="40" width="18" height="5" rx="1" class="fill-primary/55" />
      <rect x="66" y="16" width="5" height="28" rx="1" class="fill-primary/40" />
    </svg>
  </div>
  <div v-else :class="common" />
</template>
