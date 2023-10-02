import {createStore} from "vuex";
import axiosClient from "../axios";

const store = createStore({
  state: {
    user: {
      data: {},
      token: sessionStorage.getItem("Token")
    },
    currentSurvey: {
      loading: false,
      data: {},
    },
    surveys: {
      loading: false,
      data: []
    },
    questionTypes: ["text", "select", "radio", "checkbox", "textarea"],
    notification: {
      show: false,
      type: null,
      message: null
    }
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
      delete survey.image_url;
      let response;
      if (survey.id) {
        response = axiosClient.put(`/survey/${survey.id}`, survey)
          .then((res) => {
            commit('setCurrentSurveyData', res.data);
            return res;
          });
      } else {
        response = axiosClient.post('/survey', survey)
          .then((res) => {
            commit('setCurrentSurveyData', res.data);
            return res;
          });
      }
      return response;
    },
    getSurvey({commit}, id) {
      commit('setCurrentSurveyLoading', true);
      return axiosClient.get(`/survey/${id}`)
        .then((res) => {
          commit('setCurrentSurveyData', res.data);
          commit('setCurrentSurveyLoading', false);
          return res;
        }).catch((err) => {
          commit('setCurrentSurveyLoading', false);
          throw err;
        });
    },
    deleteSurvey({}, id) {
      return axiosClient.delete(`/survey/${id}`);
    },

    getSurveys({commit}) {
      commit('setSurveysLoading', true);
      return axiosClient.get('/survey')
        .then((res) => {
          commit('setSurveysData', res.data);
          commit('setSurveysLoading', false);
          return res;
        })
    },
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
    setCurrentSurveyLoading: (state, loading) => {
      state.currentSurvey.loading = loading;
    },
    setCurrentSurveyData: (state, survey) => {
      state.currentSurvey.data = survey.data;
    },
    setSurveysLoading: (state, loading) => {
      state.surveys.loading = loading;
    },
    setSurveysData: (state, surveys) => {
      state.surveys.data = surveys.data;
    },
    notify: (state, {type, message}) => {
      state.notification.show = true;
      state.notification.type = type;
      state.notification.message = message;
      setTimeout(() => {
        state.notification.show = false;
      }, 3000);
    }
  },
  modules: {},
});

export default store;
