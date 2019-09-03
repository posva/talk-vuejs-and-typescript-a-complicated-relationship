import { Store } from 'vuex'

const store = new Store({
  state: {
    n: 0,
  },

  mutations: {
    add: state => state.n++,
  },

  actions: {
    someAction(context) {
      context.commit('add')
      context.commit('or a non existant one')
      context.state.n
    },
  },
})
