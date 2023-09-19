<template>
  <div class="flex justify-between items-center">
    <h3 class="font-bold">
      {{ index + 1 }} . {{ model.question}}
    </h3>
    <div class="flex items-center">
      <!--      add question -->
      <button type="button" @click="addQuestion()"
              class="flex items-center text-white text-xs bg-gray-500 border border-transparent rounded-sm px-3 py-1 hover:border-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
             class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
        </svg>
        Add
      </button>
      <!--     / add question -->

      <!--      delete question -->
      <button type="button" @click="deleteQuestion()"
              class="flex items-center text-xs text-red-500 px-3 py-1 border border-transparent rounded-sm hover:border-red-600">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
             class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
        </svg>
        Delete
      </button>
      <!--     / delete question -->

    </div>
  </div>

  <div class="grid gap-3 grid-cols-12">
    <!--    question -->
    <div class="mt-3 col-span-9">
      <label :for="'question_text_'+model.data"
             class="block text-sm font-medium mt-1 text-gray-700">
        Question Text
      </label>
      <input @change="dataChange"
             type="text"
             :id="'question_text_'+model.data"
             :name="'question_text_'+model.data"
             v-model="model.question"
             class="block mt-1 w-full border-gray-300 sm:text-sm rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
    </div>

    <!--    /question -->

    <!--    question type -->
    <div class="mt-3 col-span-3">
      <label for="question_type"
             class="block text-sm font-medium mt-1 text-gray-700">
        Type
      </label>
      <select @change="typeChange"
              id="question_type"
              name="question_type"
              v-model="model.type"
              class="block mt-1 px-3 py-2 w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
        <option v-for="type in questionTypes" :key="type" :value="type">
          {{ upperCaseFirst(type)}}
        </option>
      </select>
    </div>
    <!--    /question type -->
  </div>

  <div class="mt-3 col-span-9">
    <label class="block text-gray-700 font-medium sm:text-sm" :for="'question_description_'+ model.id">
      Description
    </label>
    <textarea :name="'question_description_'+model.id" :id="'question_description_'+model.id"
              v-model="model.description"
              @change="dataChange"
              class="block w-full mt-1 border rounded-md shadow-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500">

    </textarea>
  </div>

  <!--  data-->
  <div>
    <div v-if="shouldHaveOptions()" class="mt-2">
      <h4 class="text-sm font-semibold mb-1 flex justify-between items-center">
        Options
        <button type="button"
                @click="addOption()"
                class="flex items-center text-xs text-white bg-gray-600 hover:bg-gray-700 rounded-sm py-1 px-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6"/>
          </svg>
          Add option
        </button>
      </h4>

      <div v-if="!model.data.options.length" class="text-center text-gray-700 text-xs py-3">
        You don't have any options defined
      </div>

      <div v-for="(option, index) in model.data.options" :key="option.uuid"
           class="flex items-center mb-1">
        <span class="w-6 text-xs">
          {{ index + 1 }}.
        </span>
        <input type="text"
               v-model="option.text"
               @change="dataChange"
               class="w-full px-2 py-1 text-xs rounded-md border border-gray-300 focus:border-indigo-600"/>

        <button type="button" @click="removeOption(option)"
                class="flex justify-center items-center text-red-700 text-xs w-6 h-6 border border-transparent rounded-full transition-colors bg-white hover:bg-red-100 hover:border-red-700">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>
    </div>
  </div>
  <!--  / data-->

  <hr class="my-4">
</template>

<script setup>
  import {ref, computed} from "vue";
  import store from "../../store";
  import {v4 as uuidv4} from "uuid";

  const props = defineProps({
    question: Object,
    index: Number
  })

  const emit = defineEmits(["change", "addQuestion", "deleteQuestion"]);

  const model = ref(JSON.parse(JSON.stringify(props.question)));

  const questionTypes = computed(() => store.state.questionTypes);

  function upperCaseFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function shouldHaveOptions() {
    return ["select", "radio", "checkbox"].includes(model.value.type)
  }

  function getOptions() {
    return model.value.data.options;
  }

  function setOptions(options) {
    return model.value.data.options = options;
  }

  function addOption(option) {
    setOptions([...getOptions(), {uuid: uuidv4(), text: ""}]);
    dataChange();
  }

  function removeOption(option) {
    setOptions(getOptions().filter((opt) => opt !== option));
    dataChange();
  }

  function typeChange() {
    if(shouldHaveOptions())
    {
      setOptions(getOptions() || []);
    }
    dataChange();
  }

  function dataChange(){
    const data = JSON.parse(JSON.stringify(model.value));
    if(!shouldHaveOptions())
      delete data.data.options;
    emit("change", data);
  }

  function addQuestion() {
    emit("addQuestion", props.index + 1);
  }

  function deleteQuestion() {
    emit("deleteQuestion", props.question);
  }

</script>

<style scoped>

</style>
