import Vue from 'vue'

const Component = Vue.extend({
  data: () => ({
    isActive: true,
  }),

  props: {
    text: {
      type: String,
      required: true,
    },
    color: String,
    multipleTypes: [String, Number],
  },

  methods: {
    doStuff() {
      this.isActive = !this.isActive

      this.text.toUpperCase()
      // color could be undefined because it is not required
      this.color.toUpperCase()
      // props cannot be modified because they are readonly
      if (typeof this.multipleTypes === 'number') this.multipleTypes + 2
      else this.multipleTypes.toUpperCase()
    },
  },
})
