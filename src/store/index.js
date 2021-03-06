import Vue from 'vue'
import Vuex from 'vuex'
import mainSchedule from './main-schedule'
import subSchedule from './sub-schedule'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loginType: Vue.ls.get('loginType'),
    column: 1,
    screen: Vue.ls.get('screen'),
  },
  getters: {
    style: state => state.screen.style
  },
  mutations: {
    SET_COLUMN(state, column) {
      state.column = column;
      return state;
    }
  },
  actions: {
    toggleColumn({ state, commit }) {
      const column = state.column;
      if (column < 3) {
        commit('SET_COLUMN', column + 1)
      } else {
        commit('SET_COLUMN', 1)
      }
    }
  },
  modules: {
    mainSchedule,
    subSchedule
  }
})
