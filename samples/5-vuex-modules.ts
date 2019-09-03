import { Store } from 'vuex'

const store = new Store({
  // state: {},

  modules: {
    a: {
      state: { n: 0 },
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
    },
  },

  mutations: {
    add: state => state.a.n,
  },
})

store.commit('a/add')

// this actually works
store.state.a.n === 0
