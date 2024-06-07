<template>
  <UCard
    as="section"
    :ui="{
      divide: 'divide-y-0',
      body: {},
    }"
  >
    <template #header>
      <div class="flex justify-between">
        <h1 class="text-2xl font-bold">{{ cardInfo.name }} {{ cardInfo.surname }}</h1>
        <UButton
          icon="i-heroicons-pencil-square"
          size="sm"
          color="primary"
          square
          variant="solid"
          @click="emit('startEdit', cardInfo)"
        />
      </div>
      <p class="py-2.5">{{ cardInfo.description }}</p>
    </template>

    <div class="flex justify-between mb-5">
      <h2 class="text-2xl">Дати консультацій</h2>
      <UButton
          icon="i-heroicons-arrows-up-down"
          size="sm"
          color="primary"
          square
          variant="solid"
          @click="sortByDate"
        />
    </div>

    <UCard
      v-for="consulting in consultings"
      :key="consulting.id"
      :ui="{
        divide: 'divide-y-0',
        background: 'bg-gray-700',
        body: {
          base: 'flex justify-between text-white',
          padding: 'px-2 py-3 sm:p-3',
        },
      }"
      class="mb-2.5"
    >
      <time>{{ formatDate(consulting.date) }}</time>
      <time>{{ formatTime(consulting.starttime) }}</time>
      <time>{{ formatTime(consulting.endtime) }}</time>
      <span class="w-2/5">{{ consulting.type }}</span>
      <span>{{ consulting.price }} грн</span>
    </UCard>
  </UCard>
</template>

<script setup lang="ts">
import { format, compareAsc, compareDesc } from 'date-fns';

const props = defineProps({
  cardInfo: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['startEdit']);

const sorting = ref('');

const consultings = computed(() => {
  let compareFn = sorting.value === 'asc' ? compareAsc : compareDesc;
  return props.cardInfo.consultings.sort((a, b) => compareFn(a.date, b.date));
});

const sortByDate = () => {
  if (sorting.value === '') {
    sorting.value = 'asc';
  } else if (sorting.value === 'asc') {
    sorting.value = 'desc';
  } else {
    sorting.value = 'asc';
  }
};

const formatTime = (time: Date) => {
  return format(time, 'HH:mm');
};

const formatDate = (date: Date) => {
  return format(date, 'dd-MMMM-yyy');
};
</script>
