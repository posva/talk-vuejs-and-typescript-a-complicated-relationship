# Vue.js and Typescript a complicated relationship

Eduardo San Martin Morote - [Twitter](https://twitter.com/posva) - [https://esm.dev](https://esm.dev)

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
