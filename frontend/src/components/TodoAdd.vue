<script setup lang="ts">
import { ref } from 'vue';
import type { TodoForm } from '@/shared/interfaces';
import { useTodo } from '@/shared/stores';
import FormDatePicker from '@/components/forms/FormDatePicker.vue';
import FormEditor from '@/components/forms/FormEditor.vue';
import AppSpinner from '@/components/AppSpinner.vue';

const todoStore = useTodo();
const text = ref('');
const date = ref('');
const loading = ref(false);
const errorMsg = ref('');
const errorDate = ref(false);
const errorText = ref(false);

const onSubmit = async () => {
  errorMsg.value = '';
  errorText.value = !text.value.trim();
  errorDate.value = !date.value;
  if (!date.value || !text.value.trim()) {
      errorMsg.value = 'Veuillez renseigner tous les champs';
      return;
  }
  try {
    const todoForm: TodoForm = { date: new Date(date.value), text: text.value.trim() };
    loading.value = true;
    await todoStore.createTodo(todoForm);

    // clear form after successful submission
    text.value = '';
    date.value = '';
  } catch (e) {
    errorMsg.value = (e as { error: string }).error || 'Une erreur est survenue';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="w-full bg-white rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
      <h2
        class="mt-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
      >
        Nouvelle tâche
      </h2>
      <p v-if="errorMsg">
        <span class="flex items-center text-sm font-medium text-gray-900 dark:text-white me-3">
          <span class="inline w-3 h-3 me-3 bg-red-500 rounded-full"></span>
          {{ errorMsg }}</span
        >
      </p>
      <div class="space-y-4 md:space-y-6">
        <form @submit.prevent="onSubmit">
          <FormDatePicker
            v-model="date"
            mode="date"
            name="date"
            :error="errorDate"
            placeholder="jj/mm/aaaa"
            class="mb-4"
          />
          <FormEditor 
            v-model="text" 
            :error="errorText" 
            placeholder="Description ..." 
            class="mb-4"
          />
          <button
            type="submit"
            :disabled="loading"
            class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            <AppSpinner v-if="loading" class="mx-auto h-6 w-6" />
            <span v-else>Ajouter la tâche</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
