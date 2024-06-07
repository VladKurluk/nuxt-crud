import { max } from "date-fns";
import { defineStore } from "pinia";

export const useUsersConsulting = defineStore("usersConsulting", () => {
    const usersConsulting = ref([]);

    const addConsulting = (payload) => {
        usersConsulting.value.push(payload);
    }

    const updateConsulting = (payload) => {
        const index = usersConsulting.value.findIndex((el) => el.id === payload.id);
        usersConsulting.value.splice(index, 1, payload);
    }

    const deleteConsulting = (payload) => {
        usersConsulting.value = usersConsulting.value.filter((el) => el.id !== payload);
    }

    const pricesRange = computed(() => {
        const prices = usersConsulting.value.flatMap(el => el.consultings.map(consulting => parseFloat(consulting.price)));

        return {
            min: prices.length ? Math.min(...prices) : 0,
            max: prices.length ? Math.max(...prices) : 0
        }
    });

    return {
        usersConsulting,
        addConsulting,
        updateConsulting,
        deleteConsulting,
        pricesRange
    }
});