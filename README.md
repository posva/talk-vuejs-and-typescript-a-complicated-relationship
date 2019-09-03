# Vue.js and Typescript a complicated relationship

Eduardo San Martin Morote - [Twitter](https://twitter.com/posva) - [https://esm.dev](https://esm.dev)

- Paris Typescript Meetup 03/09/2019
- Durée 30m

## Description

Typescript support in Vue.js have been an adventure since the beginning. Due to how the API is designed, allowing typings in Vue Components heavily relies on generics and ternary types. While things are taking a completely different turn with the new Composition API, there is some History we can learn from. During this talk we will talk about how to type Vue.js components with its current API and understand why we need to install a few dependencies by taking a look at Vue typings. We will also talk about what are the solutions we will be able to use in the future with the new Composition API.

## Core concepts

- Typings in Vue
  - Generics for props, data, etc
  - Inferring `this`
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

- Vue.js object-based API and Out of the box TS support

  - Present the basics of Vue.js API for any public
  - Explain the need of typings on `this`
  - Showcase with `new Vue` (1)
  - Briefly talk about components and the need to type components being more important
  - Try adding regular component, but fails (2)
    - We usually split in obects otherwise it would be a mess
  - Show creating POJO, try importing types (2)

    - `Component` type: no Data
    - check d.ts, it's `ComponentOptions`
    - Use a type for data, not working because function

      ```ts
      const Component: ComponentOptions<never, { isActive: boolean }> = {
        data: () => ({ isActive: true }),

        methods: {
          toggleActive() {
            // error
            this.isActive
          },
        },
      }
      ```

    - Dive into d.ts files to show there is a `DataRef` type to infer
    - We start to see that typings are quite complicated to read already. If you want to maintain them, you probably need a bunch of minutes of reading before getting comfortable to fix something or add a feature.

  - Use Vue.extend, show limitations (3)
    - `required` is useless
    - Could be much better with Typescript decorators
  - See https://vuejs.org/v2/guide/typescript.html
  - Lessons Learned

    - Some API are designed in a not fully compatible Typescript way (not ergonomical). eg: we can add non-reactive things to Vue in `created` hook, but we need to declare the property somewhere (3):

    ```ts
    created () {
      // error
      this.notReactive = []
    },
    ```

- Vue Stores with Vuex

  - Similar problems as the API is object based

    - explain quickly state, mutations and actions
    - show working example (4)
    - Look at index.d.ts in vuex, only generic is the state so no mutation/action autocompletion
    - It could be possible to extract mutation names with `keyof` and then type the arguments an `infer`. For example we can allow returning a plain value and still infer the returned value of an action as a Promise of that value but also allow returning a promise or not returning anything

    ```ts
    export type ActionReturnType<A extends Function> = A extends (
      ...args: any[]
    ) => infer R
      ? (R extends Promise<any> ? R : Promise<R>)
      : Promise<void>
    ```

    - This is to support modules: a way to organize the store in smaller stores

  - Dynamic module registration = no static typings
    - but allow other patters like code splitting
  - Mutation of a (namespaced) module (5) cannot be typed because of the string shape
  - Small sample of a non-existant API for dispatching actions in nested modules
  - Alternatives:
    - https://github.com/ktsn/vuex-smart-module
    - https://github.com/ktsn/sinai

- Classes + Decorator based TS support
  - More natural to TS users
  - Way shorter thanks to getters, methods
  - Using https://github.com/vuejs/vue-class-component (included in Vue.js Typescript guide)
    - Local properties = data
    - methods = component methods / lifecycle hooks
    - getters = computed
    - setters = computed setters
    - Every other option is added through the `@Component` decorator
  - Even further with https://github.com/kaorun343/vue-property-decorator
- Editor support
  - VSCode + Vetur in-template
  - https://github.com/vuejs/vetur
  - Follow the repo and @octref for new
- Allow plugins to extend types
- Vue 3
  - Written in Typescript, typings become essential
  - Droped RFC about Class based components
  - Composition API with full typing support
