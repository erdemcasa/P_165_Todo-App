<template>
  <BaseModal :show="show">
    <!-- Default slot, when we want to override the whole component -->
    <slot :emit-result="emitResult">
      <!-- Modal header -->
      <slot name="title" :emit-result="emitResult">
        <button
          @click="$emit('result', false)"
          type="button"
          class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          data-modal-hide="popup-modal"
        >
          <svg
            class="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            ></path>
          </svg>
          <span class="sr-only">Fermer</span>
        </button>
      </slot>
      <!-- Modal body -->
      <div class="p-4 md:p-5 text-center">
        <slot name="body">
          <svg
            class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            ></path>
          </svg>
          <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            La suppression de votre compte supprime aussi tous vos todo. Êtes-vous certain ?
          </h3>
        </slot>
        <!-- Modal footer -->
        <slot name="actions" :emit-result="emitResult">
          <button
            @click="$emit('result', true)"
            data-modal-hide="default-modal"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
          >
            Confirmer
          </button>
          <button
            @click="$emit('result', false)"
            data-modal-hide="default-modal"
            class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            type="button"
          >
            Annuler
          </button>
        </slot>
      </div>
    </slot>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from './BaseModal.vue';

defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  (e: 'result', value: boolean): void;
}>();

// We might want to delegate the process of emitting
// the result to somewhere else, so we define a function
// we can pass through scoped slots
function emitResult(value: boolean) {
  emit('result', value);
}
</script>
