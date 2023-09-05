import {createStore} from "vuex";

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
      return fetch('http://localhost:8000/api/register', {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        method: "Post",
        body: JSON.stringify(user)
      }).then((res) => res.json())
        .then((res) => {
          commit("setUser", res);
          return res;
        })
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
