// store.moduleA.dispatch(someAction, 'firstArg', 'secondArg')
// store.moduleA.nestedModule.dispatch(nestedAction, 'firstArg')
// everything typed correctly

// but typing it is complicated and leads to hard to maintain code
type ExtendedStore<MT extends ModuleTree> = {
  [K in keyof MT]: {
    dispatch<
      A extends Action<
        StateTreeFromModuleTree<
          StateFromModule<MT[K]>,
          ModulesFromModule<MT[K]>
        >
      >
    >(
      action: A,
      ...args: PayloadType<A>
    ): ActionReturnType<A>
  } & ExtendedStore<ModulesFromModule<MT[K]>>
}

export type StateTree = Record<string, any>

export interface Module<S extends StateTree> {
  state?: S
  modules?: ModuleTree
}

export type ModuleTree = Record<string, Module<any>>
