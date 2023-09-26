<template>
  <PageComponent>
    <template v-slot:header>
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">Surveys</h1>
        <router-link
          :to="{ name: 'SurveyCreate'}"
          class="px-3 py-2 rounded text-white bg-emerald-500 hover:bg-emerald-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor" class="w-4 h-4 -mt-1 inline-block">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
          </svg>
          Add new survey
        </router-link>
      </div>
    </template>
    <div v-if="surveysLoading" class="flex justify-center text-xl font-bold text-indigo-500">
      Loading...
    </div>
    <div v-else class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3"
    >
      <SurveyListItem v-for="survey in surveys"
                      :key="survey.id" :survey="survey" @delete="deleteSurvey(survey)"/>
    </div>
  </PageComponent>
</template>

<script setup>

  import PageComponent from "../components/PageComponent.vue";
  import SurveyListItem from "../components/SurveyListItem.vue";
  import store from "../store";
  import {computed} from "vue";
  import router from "../router";

  const surveys = computed(() => store.state.surveys.data);
  const surveysLoading = computed(() => store.state.surveys.loading);

  function deleteSurvey(survey) {
    if (confirm('Are you sure to delete this survey?')) {
      store.dispatch("deleteSurvey", survey.id).then((res) => {
        store.dispatch("getSurveys");
      });
    }
  }

  store.dispatch("getSurveys");

</script>

<style scoped>

</style>
