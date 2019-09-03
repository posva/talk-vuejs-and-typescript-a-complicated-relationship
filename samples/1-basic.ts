import Vue from 'vue'

const vm = new Vue({
  data: {
    isActive: true,
    amount: 0,
    name: 'Eduardo',
  },

  methods: {
    timesTwo() {
      this.amount *= 2
    },
    setName(name: string) {
      this.name = name
    },
  },
})

vm.amount++
vm.isActive = !vm.isActive
vm.name.toUpperCase()
vm.timesTwo()
vm.setName('Toto')
