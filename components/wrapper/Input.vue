<template>
  <div>
    <label v-if="label" :for="id" class="mb-2">{{ label }}</label>
    <UTextarea
      v-if="isTextarea"
      v-model="value" 
      v-bind="{...$attrs}"
      :id="id"
      :name="name"
      :size="size"
      :color="errorMessage ? 'red' : color"
      :variant="variant"
    />
    <UInput
      v-else
      v-model="value"
      :id="id"
      :name="name"
      :size="size"
      :color="errorMessage ? 'red' : color"
      :variant="variant"
    />
    <small v-if="errorMessage" class="text-red-500 mt-1">
      {{ errorMessage }}
    </small>
  </div>
</template>

<script setup lang="ts">
import { toRef } from 'vue';
import { useField } from 'vee-validate';

const props = defineProps({
  modelValue: [String, Number],
  isTextarea: {
    type: Boolean,
    default: () => false
  },
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: () => 'md',
    validator(value: string) {
      return ['2xs', 'xs', 'sm', 'md', 'lg', "xl"].includes(value);
    }
  },
  color: {
    type: String,
    default: () => 'white',
  },
  variant: {
    type: String,
    default: () => 'outline',
    validator(value: string) {
      return ['outline', 'none',].includes(value);
    }
  }
});

const emit = defineEmits(['update:model-value'])

const name = toRef(props, 'name');
const modelValue = toRef(props, 'modelValue');
const { value, errorMessage } = useField(name, undefined, {
  initialValue: modelValue
});

watch(value, (val) => {
  emit('update:model-value', val);
});
</script>

<style scoped>

</style>