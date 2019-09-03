import Vue from 'vue'

const vm = new Vue({
  components: {
    Button: {
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
          this.text.toUpperCase()
        },
      },
    },
  },
})
