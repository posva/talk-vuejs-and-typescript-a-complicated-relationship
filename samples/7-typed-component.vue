<template>
  <div>
    <button @click="increment">{{ counter }}</button>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  data: () => ({ counter: 0 }),

  methods: {
    increment() {
      this.counter++;
    }
  }
});
</script>

<style scoped>
</style>
