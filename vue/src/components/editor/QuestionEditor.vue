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
    <textarea :name="'question_description_'+model.id" :id="'question_description_'+model.id" v-model="model.description"
              @change="dataChange"
              class="block w-full mt-1 border rounded-md shadow-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500">

    </textarea>
  </div>
  <hr class="my-4">
</template>

<script setup>
  import {ref} from "vue";

  const props = defineProps({
    question: Object,
    index: Number
  })

  const emit = defineEmits(["change", "addQuestion", "deleteQuestion"]);

  const model = ref(JSON.parse(JSON.stringify(props.question)));

</script>

<style scoped>

</style>
