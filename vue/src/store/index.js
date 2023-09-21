import {createStore} from "vuex";
import axiosClient from "../axios";

const tmpSurveys = [
  {
    id: 1,
    title: "First survey",
    slug: "first-survey-1",
    status: "draft",
    image: "https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcGQxMDMtbWlzY3RoZW1ldDAwMTQ4YS1pbWFnZS5wbmc.png",
    description: "First survey about me, Rana Arouk First survey about me, Rana AroukFirst survey about me, Rana AroukFirst survey about me, Rana AroukFirst survey about me, Rana AroukFirst survey about me, Rana AroukFirst survey about me, Rana AroukFirst survey about me, Rana AroukFirst survey about me, Rana AroukFirst survey about me, Rana Arouk",
    created_at: '2023-09-07 00:00:00',
    updated_at: '2023-09-07 00:00:00',
    expire_date: '2023-09-07 00:00:00',
    questions: [
      {
        id: 1,
        type: "select",
        question: "from Which country are you ?",
        description: null,
        data: {
          options: [
            {uuid: "9855989798", text: "Syria"},
            {uuid: "944989798", text: "Canada"},
            {uuid: "339989798", text: "US"},
            {uuid: "985489798", text: "UK"},
          ],
        }
      },
      {
        id: 2,
        type: "checkbox",
        question: "What are the programming languages you have experience with?",
        description: "test test test",
        data: {
          options: [
            {uuid: "98559897", text: "PHP"},
            {uuid: "9449897", text: "C#"},
            {uuid: "3399897", text: "JAVA"},
            {uuid: "9854897", text: "C++"},
          ],
        }
      },
      {
        id: 3,
        type: "checkbox",
        question: "What are the web frameworks have you worked on ?",
        description: "frameworks",
        data: {
          options: [
            {uuid: "98559798", text: "Laravel"},
            {uuid: "9449798", text: "ASP.Net"},
            {uuid: "3399798", text: "Django"},
            {uuid: "9854798", text: "Codeignitor"},
          ],
        }
      },
      {
        id: 4,
        type: "radio",
        question: "Do you speak english well?",
        description: "english",
        data: {
          options: [
            {uuid: "9855798", text: "Yes"},
            {uuid: "944998", text: "No"},
          ],
        }
      },
      {
        id: 5,
        type: "checkbox",
        question: "What are the tools have you worked ?",
        description: "tools",
        data: {
          options: [
            {uuid: "98559798", text: "PHPStorm"},
            {uuid: "9449798", text: "Navicat"},
            {uuid: "3399798", text: "GitKraken"},
            {uuid: "9854798", text: "Xampp"},
          ],
        }
      },
      {
        id: 6,
        type: "text",
        question: "Your email",
        description: "HR",
        data: {}
      },
      {
        id: 7,
        type: "textarea",
        question: "Talk about yourself?",
        description: null,
        data: {}
      },
    ],
  },
  {
    id: 200,
    title: "Second survey",
    slug: "second-survey-2",
    status: "draft",
    image: "https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjgyMC1rYXRpZS01NC5wbmc.png",
    description: "Second survey about learning english, Second survey about learning english Second survey about learning english Second survey about learning english Second survey about learning english",
    created_at: '2023-09-07 00:00:00',
    updated_at: '2023-09-07 00:00:00',
    expire_date: '2023-09-07 00:00:00',
    questions: []
  },
  {
    id: 300,
    title: "Third survey",
    slug: "third-survey-3",
    status: "draft",
    image: "https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjUzNy1udW5vb24tMDMucG5n.png",
    description: "Third survey about atomic habits, survey about atomic habits, survey about atomic habits, survey about atomic habits ",
    created_at: '2023-09-07 00:00:00',
    updated_at: '2023-09-07 00:00:00',
    expire_date: '2023-09-07 00:00:00',
    questions: []
  }
];

const store = createStore({
  state: {
    user: {
      data: {},
      token: sessionStorage.getItem("Token")
    },
    surveys: [...tmpSurveys],
    questionTypes: ["text", "select", "radio", "checkbox", "textarea"]
  },
  getters: {},
  actions: {
    register({commit}, user) {
      return axiosClient.post('/register', user)
        .then((data) => {
          commit('setUser', data);
          return data;
        })
    }
    ,

    login({commit}, user) {
      return axiosClient.post('/login', user)
        .then((response) => {
          commit('setUser', response);
          return response
        });
    },
    logout({commit}) {
      return axiosClient.post('/logout')
        .then((response) => {
          commit('logout');
          return response
        });
    },
    saveSurvey({commit}, survey) {
      let response;
      if (survey.id) {
        response = axiosClient.put(`/survey/${survey.id}`, survey)
          .then((res) => {
            commit('updateSurvey', res.data);
            return res;
          });
      } else {
        response = axiosClient.post('/survey', survey)
          .then((res) => {
            commit('saveSurvey', res.data);
            return res;
          });
      }
      return response;
    }
  },
  mutations: {
    logout: (state) => {
      state.user.data = {};
      state.user.token = null;
    },
    setUser: (state, response) => {
      state.user.data = response.data.user;
      state.user.token = response.data.token;
      sessionStorage.setItem('Token', response.data.token);
    },
    saveSurvey: (state, survey) => {
      state.surveys = [...state.surveys, survey.data];
    },
    updateSurvey: (state, survey) => {
      state.surveys = state.surveys.map((s) => {
        if (s.id === survey.data.id)
          return survey.data;
        return s;
      });
    },
  },
  modules: {},
});

export default store;
