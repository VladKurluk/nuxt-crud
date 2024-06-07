<template>
  <USlideover prevent-close>
    <UCard
      as="form"
      class="flex flex-col flex-1 overflow-auto"
      :ui="{
        body: { base: 'flex-1' },
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800' 
      }"
      @submit="onSubmit"
    >
      <template #header>
        <div class="flex items-center justify-start">
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="mr-5" @click="emit('close')" />
          <h3 class="text-xl font-semibold leading-6 text-gray-900 dark:text-white">
            {{ formMode.titleText }}
          </h3>
        </div>
      </template>

      <WrapperInput
        v-model="userInfo.name"
        id="name"
        name="name"
        label="Ім'я працівника"
        class="flex flex-col mb-2.5"
      />

      <WrapperInput
        v-model="userInfo.surname"
        id="surname"
        name="surname"
        label="Прізвище працівника"
        class="flex flex-col mb-2.5"
      />

      <WrapperInput
        v-model="userInfo.description"
        id="description"
        name="description"
        label="Прo працівника"
        size="lg"
        isTextarea
        class="flex flex-col mb-2.5"
      />

      <UPopover :popper="{ placement: 'bottom-start' }">
        <div class="flex flex-col w-full">
          <WrapperInput
            :key="formattedDate"
            v-model="formattedDate"
            id="dates"
            name="dates"
            label="Дати"
            isTextarea
            autoresize
            :maxrows="5"
            class="flex flex-col mb-2.5"
          />
        </div>

        <template #panel="{ close }">
          <DatePicker
            v-model="date"
            mode="date"
            :attributes="selectedDatesAttrs"
            @close="close"
            @update:modelValue="addDate"
          />
        </template>
      </UPopover>

      <TimesCard
        v-for="(item, index) in consultingInfo"
        :key="item.id"
        class="mb-5"
        :consultingInfo="item"
        :showRemoveBtn="index > 0"
        @update:time="updateTime"
        @remove="removeTimesCard"
      />

      <template #footer>
        <div class="flex justify-between gap-x-3">
          <UButton
            size="lg"
            variant="outline"
            color="red"
            block
            class="w-1/2"
            type="button"
            @click="() => {deleteConsulting(editedData.id), emit('close')}"
          >
            Видалити
          </UButton>
          <UButton size="lg" block class="w-1/2" type="submit">
            {{ formMode.btnText }}
          </UButton>
        </div>
      </template>
    </UCard>
  </USlideover>
</template>


<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import _cloneDeep from 'lodash.cloneDeep';
import { format,  isEqual } from 'date-fns';
import { useForm } from 'vee-validate';

import { CONSULTING_TYPES } from '~/constants'
import { useUsersConsulting } from "~/store/usersConsulting";
import { useValidation } from '~/composables/useValidation';

const { addConsulting, updateConsulting, deleteConsulting } = useUsersConsulting();

const props = defineProps({
  editedData: {
    type: Object,
    default: () => {
      return {};
    }
  }
});

const emit = defineEmits(['close']);

const formMode = computed(() => {
  return Object.keys(props.editedData).length 
    ? {
      titleText: 'Редагувати',
      btnText: 'Зберегти',
      create: false
    } : {
      titleText: 'Створити',
      btnText: 'Створити',
      create: true
    };
});

const userInfo = ref({
  name: '',
  surname: '',
  description: ''
});

const consultingInfo = ref([]);

const schema = useValidation(consultingInfo.value);

const { handleSubmit } = useForm({
  validationSchema: schema,
});

const onSubmit = handleSubmit(({name, surname, description}) => {
  let payload = {
    name,
    surname,
    description,
    consultings: consultingInfo.value
  };

  if (formMode.value.create) {
    payload.id = uuidv4();
    addConsulting(payload);
  } else {
    payload.id = props.editedData.id;
    updateConsulting(payload);
  }

  emit('close');
});

const date = ref(null)
const selectedDatesAttrs = ref([
  {
    highlight: {
      color: 'green',
      fillMode: 'solid',
    },
    dates: [],
  }
]);

const addDate = (dateValue: Date) => {
  let result = selectedDatesAttrs.value[0].dates.findIndex((item) =>{
    return isEqual(dateValue, item);
  });

  if (result === -1 ) {
    selectedDatesAttrs.value[0].dates.push(dateValue);
    consultingInfo.value.push({
      id: uuidv4(),
      date: dateValue,
      starttime: new Date(),
      endtime: new Date(),
      price: 0,
      type: CONSULTING_TYPES[0],
    });
  }
}

const removeTimesCard = ({id, date}) => {
  consultingInfo.value = consultingInfo.value.filter(el => el.id !== id);

  const idx = selectedDatesAttrs.value[0].dates.findIndex(el => isEqual(date, el));

  if (idx !== -1) {
    selectedDatesAttrs.value[0].dates.splice(idx, 1);
  }
}

const formattedDate = computed(() => {
  return consultingInfo.value.reduce((acc, item) => {
    const separator = acc.length ? ',  ' : '';
    return acc = `${acc}${separator}`+ format(item.date, 'dd-MM-yyy');
  }, "")
});

const updateTime = (data) => {
  const item = consultingInfo.value.find(el => el.id === data.item.id);

  if (item) {
    item[data.timeName] = data.val;
  }
}

onMounted(() => {
  if (Object.keys(props.editedData).length) {
    const { name, surname, description, consultings } = props.editedData;
    userInfo.value.name = name;
    userInfo.value.surname = surname;
    userInfo.value.description = description;
    consultingInfo.value = _cloneDeep([...consultings]);

    selectedDatesAttrs.value[0].dates = consultings.map((el) => el.date);
  }
});
</script>
