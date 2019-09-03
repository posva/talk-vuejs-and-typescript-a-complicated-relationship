# Vue.js and Typescript a complicated relationship

- Paris Typescript Meetup 03/09/2019
- Durée 30m

## Core concepts

- Typings in Vue
  - Generics for props, data, etc
  - Inferring `this`
  - Ternaries
  - Defaults
- Vue.extend to have types
- Decorators
  - https://github.com/vuejs/vue-class-component
  - https://github.com/kaorun343/vue-property-decorator
  - Still TS only: https://github.com/tc39/proposal-decorators
    - important because breaking changes affect people
- Solving it with the composition API
  - Naturally inferred typings

## Plan

- Vue.js object-based API
  - Present the basics of Vue.js API for any public
  - Explain the need of typings on `this`
  - Showcase with `new Vue`
