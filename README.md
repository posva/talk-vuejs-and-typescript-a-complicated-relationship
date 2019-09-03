# Vue.js and TypeScript a complicated relationship

Eduardo San Martin Morote (@posva) - [Twitter](https://twitter.com/posva) - [https://esm.dev](https://esm.dev)

- Paris TypeScript Meetup 03/09/2019
- Durée 30m

## Description

TypeScript support in Vue.js have been an adventure since the beginning. Due to how the API is designed, allowing typings in Vue Components heavily relies on generics and ternary types. While things are taking a completely different turn with the new Composition API, there is some History we can learn from. During this talk we will talk about how to type Vue.js components with its current API and understand why we need to install a few dependencies by taking a look at Vue typings. We will also talk about what are the solutions we will be able to use in the future with the new Composition API.

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

- Presentation

  - Eduardo San Martin Morote
  - Freelance
  - Vue.js Core team
  - @posva on Twitter and Github

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
    - Could be much better with TypeScript decorators
  - See https://vuejs.org/v2/guide/typescript.html
  - Lessons Learned

    - Some API are designed in a not fully compatible TypeScript way (not ergonomical). eg: we can add non-reactive things to Vue in `created` hook, but we need to declare the property somewhere (3):

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
    - To have mutations we would have to bring the Mutations Tree all over the place, same with actions.
    - Then it would be possible to extract mutation names with `keyof` and then use ternaries with `infer` to allow flexibile cases (no state vs state, no mutations, etc). For example we can allow returning a plain value and still infer the returned value of an action as a Promise of that value but also allow returning a promise or not returning anything

    ```ts
    export type ActionReturnType<A extends Function> = A extends (
      ...args: any[]
    ) => infer R
      ? (R extends Promise<any> ? R : Promise<R>)
      : Promise<void>
    ```

    - But bigger apps have modular requirements for Stores: modules: a way to organize the store in smaller stores
    - Explain modules
    - This brings a new layer of complexity by making types recursive

  - Dynamic module registration = no static typings
    - but allow other patters like code splitting
  - Mutation of a (namespaced) module (5) cannot be typed because of the string shape
  - Small sample of a non-existant API for dispatching actions in nested modules
  - Alternatives:
    - https://github.com/ktsn/vuex-smart-module
    - https://github.com/ktsn/sinai
  - Still a big issue for TypeScript users

- Classes + Decorator based TS support
  - More natural to TS users
  - Way shorter thanks to getters, methods
  - Using https://github.com/vuejs/vue-class-component (included in Vue.js TypeScript guide)
    - Local properties = data
    - methods = component methods / lifecycle hooks
    - getters = computed
    - setters = computed setters
    - Every other option is added through the `@Component` decorator
  - Even further with https://github.com/kaorun343/vue-property-decorator
    - Pretty much remove the necessity of using an argument for `@Component`
    - Some extra helpers like `@PropSync`
- Editor support
  - VSCode + Vetur in-template
  - Autocompletion for methods and propertis in template (7)
  - https://github.com/vuejs/vetur
  - Follow the repo and @octref for new
- Allow plugins to extend types
  - This isn't much but if you write Vue plugins and you add properties to Vue instances (explain `$router` and `$store`), you can look at how they do
  - Open vuex/types/vue.d.ts
- Vue 3

  - Written in TypeScript, typings become essential
  - Droped RFC about Class based components
    - Closed PR: https://github.com/vuejs/rfcs/pull/17
    - RFC: https://github.com/vuejs/rfcs/blob/class-api/active-rfcs/0000-class-api.md
      - Very similar to vue-class-component but out of the box
    - Dropping reason: https://github.com/vuejs/rfcs/pull/17#issuecomment-494242121
      - Do not improve on limitations of the current API
      - Not using classes brings a performance boost
      - Decorators are still TS only as they are stage-2 in js https://github.com/tc39/proposal-decorators and they are crucial to add some properties to the component like props. One of the values of Vue is being accessible and being able to use it without a compilation step, this would go against it
      - Complex, hard to maintain types that grow with time
  - Composition API with full typing support
    - Initially solves a different problem: instead of trying to replace the object syntax API, it's a different, more advanced API that also brings **composability**. It's similar to _hooks_ in _React_
    - Went through **a lot of feedback**, toxic, hateful and misinformed comments (thanks Reddit and Hacker News)
    - PR: https://github.com/vuejs/rfcs/pull/78
    - RFC: https://vue-composition-api-rfc.netlify.com (a website)
      - I recommend to read the whole thing from start to end, as an article
      - If you read comments, you may come across terms that have been renamed like `state` -> `reactive` and `value` -> `ref`
      - It was called function api before because it's based on functions
      - Show the comparison image
      - Final code of reorganized component: https://gist.github.com/yyx990803/8854f8f6a97631576c14b63c8acd8f2e (9) vs https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-ui/src/components/folder/FolderExplorer.vue
      - Extra benefits like better compression
      - Typings are natural as we are using functions and returning an object on the `setup` method, which can easily be inferred since it's no longer 5 things to take into account (data, props, methods, computed, inject)
    - Can be played with for Vue 2 at https://github.com/vuejs/composition-api
      - It has limitations (listed in readme)
      - It reflects RFC's API, meaning it could have breaking changes
      - Only use it if you need the composition level offered by the new API or if you want to experiment with a different way of doing things.
      - Please, report any bugs
    - Vuex Stores API will have to be revisited
      - Can create a simple store easily (8)
      - It would still be nice to have an API around it so it stays clean an maintainable, @ktsn will take a look at this
    - Other improvements to come like Vue Router, but it's not related to Typescript anymore, it's more about having consistent APIs
  - The future of TypeScript is looking good for Vue.js

- Closing
  - If you enjoy the Vue ecosystem and you want to support its development, I have a [Github Sponsorship page](https://github.com/users/posva/sponsorship)
  - @posva on Twitter
