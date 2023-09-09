import {createStore} from "vuex";
import axiosClient from "../axios";

const store = createStore({
  state: {
    user: {
      data: {
        },
      token: sessionStorage.getItem("Token")
    }
  },
  getters: {},
  actions: {
    register({commit}, user){
      return axiosClient.post('/register', user)
        .then((data) => {
          commit('setUser', data);
          return data;
        })
    }
    ,

    login({commit}, user)
    {
      return axiosClient.post('/login', user)
        .then((data) => {
          commit('setUser', data);
          return data
        });
    }
  },
  mutations: {
    logout: (state) => {
      state.user.data = {};
      state.user.token = null;
    },
    setUser: (state, userData) => {
      state.user.data = userData.data;
      state.user.token = userData.token;
      sessionStorage.setItem('Token', userData.token);
    }
  },
  modules: {},
});

export default store;
