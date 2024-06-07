<template>
  <div>
    <URange v-model="value" :min="pricesRange.min" :max="pricesRange.max" @change="handleRangeChage" />
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const route = useRoute();
import { storeToRefs} from 'pinia'
import { useUsersConsulting } from "~/store/usersConsulting";

const store = useUsersConsulting();
const { pricesRange } = storeToRefs(store);

const value = ref(0);

const emit = defineEmits(['update:model-value']);

const handleRangeChage = (val: number) => {
  /**
   * Updates the URL query parameter 'filter' with the given numeric value.
   *
   * @param {number} val - The numeric value to update the 'filter' query parameter with.
   * @return {void} This function does not return a value.
   */

  router.replace({ query: {...route.query, filter: `${val}`} });
  emit('update:model-value', val);
}
</script>

<style scoped>

</style>