import Vue from 'vue'
import { reactive } from '@vue/composition-api'

function createStore() {
  const state = reactive({
    amount: 0,
  })

  function increment(amount: number = 1) {
    state.amount += amount
  }

  return {
    state,
    increment,
  }
}

const store = createStore()

const Counter = Vue.extend({
  setup() {
    return {
      store,
    }
  },
})

// <button @click="store.increment">{{ store.state.amount }}</button>
