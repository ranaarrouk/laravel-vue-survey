<template>
  <PageComponent>
    <template v-slot:header>
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">Surveys</h1>
        <router-link
        :to="{ name: 'SurveyCreate'}"
        class="px-3 py-2 rounded text-white bg-emerald-500 hover:bg-emerald-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 -mt-1 inline-block">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add new survey
        </router-link>
      </div>
    </template>
    <div>
        <pre>
          {{ surveys}}
        </pre>
    </div>
  </PageComponent>
</template>

<script setup>

  import PageComponent from "../components/PageComponent.vue";
  import store from "../store";
  import { computed } from "vue";

  const surveys = computed(() => store.state.surveys);

</script>

<style scoped>

</style>
