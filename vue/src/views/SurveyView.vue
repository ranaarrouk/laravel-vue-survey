<template>
  <PageComponent>
    <template v-slot:header>
      <div class="flex justify-between items-center">
        <h1 class="text-3xl text-grey-900 font-bold">{{ model.id? model.title : 'Create a survey'}} </h1>
      </div>
    </template>

    <form @submit.prevent="saveSurvey">
      <div class="shadow sm:rounded-md sm:overflow-hidden">
        <!--        Survey fields-->
        <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
          <!--      image -->
          <div>
            <label class="block text-sm text-gray-700 font-medium">Image</label>
            <div class="mt-1 flex items-center">
              <img
                v-if="model.image_url"
                :src="model.image_url"
                class="w-64 h-48 object-cover">
              <span v-else
                    class="flex items-center justify-center rounded-full w-12 h-12 bg-gray-100 overflow-hidden"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor"
                     class="w-[80%] h-[80%] text-gray-300">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
                </svg>
              </span>
              <button type="button" class="relative overflow-hidden ml-5 bg-white
               px-3 py-2 border border-gray-300 text-sm font-medium text-grey-700
hover:bg-gray-50  focus:ring-2 focus:offset-ring-2 focus:outline-none focus:ring-indigo-500">
                <input @change="onImageChoose"
                  type="file" class="absolute left-0 right-0 bottom-0 top-0 opacity-0 cursor-pointer">
                Change
              </button>
            </div>
          </div>
          <!--     end image -->

          <!--    title -->
          <div>
            <label class="block text-sm text-gray-700 font-medium">title</label>
            <input name="title" id="title" v-model="model.title" type="text" autocomplete="survey_title"
                   class="block mt-1 w-full sm:text-sm shadow-sm border border-grey-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md">
          </div>
          <!--   end title -->

          <!--      description-->
          <div>
            <label class="block text-sm text-gray-700 font-medium">description</label>
            <textarea name="description" id="description" v-model="model.description"
                      placeholder="Describe your survey"
                      class="mt-1 w-full border border-gray-300 shadow-sm rounded-md sm:text-sm hover:border-indigo-500
                      focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 "></textarea>
          </div>
          <!--    end  description-->

          <!--   expire date   -->
          <div>
            <label class="block text-sm text-gray-700 font-medium">expire date</label>
            <input type="date" name="expire_date" id="expire_date" v-model="model.expire_date"
                   class="block mt-1 w-full rounded shadow-sm border-grey-300 hover:border-indigo-500 focus:ring-indigo-500">
          </div>
          <!--   end expire date   -->

          <!--      status -->
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input name="status" id="status" v-model="model.status" type="checkbox"
                     class="rounded border-grey-300 focus:ring-indigo-500 h-4 w-4">
            </div>
            <div class="ml-3 text-sm">
              <label for="status" class="text-gray-700 font-medium">active</label>
            </div>
          </div>
          <!--      end status -->
        </div>
        <!--        End of Survey fields-->

        <!--        Questions-->
        <div class="px-4 py-5 space-y-6 bg-white sm:p-6">
          <h3 class="flex items-center justify-between font-semibold text-2xl">Questions
            <button type="button"
                    @click="addQuestion"
                    class="flex items-center px-4 py-1 bg-gray-600 hover:bg-gray-700 rounded-sm
                   text-white text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
              </svg>
              Add Question
            </button>
          </h3>
          <div v-if="!model.questions.length" class="text-center text-gray-600">
            There is no questions yet.
          </div>
          <div v-for="(question, index) in model.questions">
            <QuestionEditor
              :key="question.id"
              :question="question"
              :index="index"
              @change="questionChange"
              @addQuestion="addQuestion"
              @deleteQuestion="deleteQuestion">
            </QuestionEditor>
          </div>
        </div>
        <!--        Questions-->

        <div class="px-4 py-3 bg-grey-50 text-right sm:px-6">
          <button type="submit"
                  class=" inline-flex justify-center
                  px-4 py-2 bg-indigo-600 hover:bg-indigo-700
                  border border-transparent text-white shadow-sm
                  focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:outline-none
                  sm:text-sm font-medium">Save
          </button>
        </div>
      </div>
    </form>

  </PageComponent>
</template>

<script setup>

  import PageComponent from "../components/PageComponent.vue";
  import QuestionEditor from "../components/editor/QuestionEditor.vue";
  import {v4 as uuidv4} from "uuid";

  import store from "../store";
  import {useRoute, useRouter} from "vue-router";
  import {ref} from "vue";

  const route = useRoute();
  const router = useRouter();

  // reactive value
  const model = ref({
    title: "",
    image: null,
    image_url: null,
    description: null,
    status: false,
    expire_date: null,
    questions: []
  });

  if (route.params.id) {
    model.value = store.state.surveys.find(
      (s) => s.id === parseInt(route.params.id)
    )
  }

  function onImageChoose(ev) {
    const file = ev.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      model.value.image = reader.result;
      model.value.image_url = reader.result;
    }
    reader.readAsDataURL(file);
  }

  function addQuestion(index) {
    const newQuestion = {
      id: uuidv4(),
      type: "text",
      question: "",
      description: null,
      data: {}
    };

    model.value.questions.splice(index, 0, newQuestion);
    console.log(model.value.questions);
  }

  function deleteQuestion(question) {
    model.value.questions = model.value.questions.filter(
      (q) => q.id !== question.id
    );
  }

  function questionChange(question) {
    model.value.questions = model.value.questions.map(
      (q) => {
        if(q.id === question.id){
          return JSON.parse(JSON.stringify(question));
        }
        return q;
      }
    );
  }

  function saveSurvey(){
    store.dispatch('saveSurvey', model.value).then(({data}) => {
      router.push({
        name: 'SurveyView',
        params: {id: data.data.id}
      })
    });
  }

</script>
