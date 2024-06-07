<template>
  <UContainer as="div">
    <h2 class="text-2xl py-5">Фільтр</h2>
    <div class="flex justify-start items-center">
      <p class="mr-5">Фільтрувати за ціною:</p>
      <div class="w-1/2">
        <div class="flex justify-between pb-2.5">
          <span>{{ pricesRange.min }}</span>
          <span>{{ pricesRange.max }}</span>
        </div>
        <Filter v-model="filter"/>
      </div>
    </div>

    <div class="flex justify-between py-8">
      <h2 class="text-2xl">Список карток</h2>
      <UButton size="lg" @click="isOpen = true">Додати картку</UButton>
    </div>

    <OverviewCard
      v-for="(item, index) in paginatedItems"
      :key="index"
      :cardInfo="item"
      @startEdit="startEdit"
      class="mb-5"
    />

    <UPagination
      v-if="totalPages > 3"
      v-model="currentPage"
      :page-count="3"
      :total="totalPages"
      @update:modelValue="handlePageChange"
    />
  </UContainer>

  <AddEditCard
    v-if="isOpen"
    v-model="isOpen"
    :editedData="editedCard"
    @close="closeAndClenUp"
  />
</template>

<script setup lang="ts">
const router = useRouter();
const route = useRoute();
import { storeToRefs} from 'pinia'
import { useUsersConsulting } from "~/store/usersConsulting";

const store = useUsersConsulting();
const { usersConsulting, pricesRange } = storeToRefs(store);

const currentPage = ref(1);
const filter = ref(0);

const totalPages = computed(() => {
  return Math.ceil(usersConsulting.value.length);
});

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * 3;
  const end = start + 3;
  let items = usersConsulting.value.slice(start, end);

  if (filter.value) {
    items = items
    .map(el => ({
      ...el,
      consultings: el.consultings.filter(consulting => parseFloat(consulting.price) >= filter.value)
    }))
    .filter(el => el.consultings.length > 0);
  }

  return items;
});

const handlePageChange = (page) => {
  currentPage.value = page;
  router.replace({ query: {...route.query, page: `${page}`} });
};

const isOpen = ref(false);
const editedCard = ref({});

const startEdit = (cardInfo) => {
  editedCard.value = cardInfo;
  isOpen.value = true;
};

const closeAndClenUp = () => {
  editedCard.value = {};
  isOpen.value = false;
};
</script>
