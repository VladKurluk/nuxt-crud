<template>
  <div>
    <div class="flex justify-between items-center mb-2.5">
      <p>{{ format(consultingInfo.date, 'dd-MM-yyy')}}</p>
      <UButton
        v-if="showRemoveBtn"
        color="gray"
        icon="i-heroicons-x-mark-20-solid"
        @click="emit('remove', consultingInfo)"
      />
    </div>
          
    <UCard 
      :ui="{
        divide: 'divide-y-0',
        background: 'bg-gray-700',
        body: {
          base: 'flex flex-col justify-between text-white',
          padding: 'px-2 py-3 sm:p-3',
        },
      }"
    >
      <div class="flex items-center gap-x-2.5">
        <div class="flex flex-col mb-2.5">          
          <UPopover :popper="{ placement: 'bottom-start' }">
            <WrapperInput
              :key="consultingInfo.starttime"
              v-model="starttime"
              id="starttime"
              :name="`${consultingInfo.id}-starttime`"
              label="Початок"
              size="sm"
              class="flex flex-col"
            />

            <template #panel="{ close }">
              <DatePicker
                :model-value="consultingInfo.starttime"
                mode="time"
                is24hr
                hide-time-header
                @close="close"
                @update:modelValue="(val) => updateSelectedTime(val, 'starttime')"
              />
            </template>
          </UPopover>
        </div>

        <div class="flex flex-col mb-2.5">
          <UPopover :popper="{ placement: 'bottom-start' }">
            <WrapperInput
              :key="consultingInfo.endtime"
              v-model="endtime"
              id="endtime"
              :name="`${consultingInfo.id}-endtime`"
              label="Кінець"
              size="sm"
              class="flex flex-col"
            />

            <template #panel="{ close }">
              <DatePicker
                :model-value="consultingInfo.endtime"
                mode="time"
                is24hr
                hide-time-header
                @close="close"
                @update:modelValue="(val) => updateSelectedTime(val, 'endtime')"
              />
            </template>
          </UPopover>
        </div>

        <WrapperInput
          id="price"
          :name="`${consultingInfo.id}-price`"
          label="Ціна"
          class="flex flex-col mb-2.5"
          v-model="consultingInfo.price"
        />
      </div>
      <USelect
        v-model="consultingInfo.type"
        :options="CONSULTING_TYPES"
      />
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { format } from 'date-fns';
import { CONSULTING_TYPES } from '~/constants';

const props = defineProps({
  consultingInfo: {
    type: Object,
    required: true
  },
  showRemoveBtn: {
    type: Boolean,
    default: () => {
      return false;
    }
  }
});

const emit = defineEmits([
  'update:time',
  'remove'
]);

const starttime = computed({
  get: () => {
    return format(props.consultingInfo.starttime, 'HH:mm')
  },
});

const endtime = computed({
  get: () => {
    return format(props.consultingInfo.endtime, 'HH:mm')
  },
});

const updateSelectedTime = (val: Date, timeName: string) => {
  emit(`update:time`, {
    item: props.consultingInfo,
    val: val,
    timeName,
  });
};
</script>