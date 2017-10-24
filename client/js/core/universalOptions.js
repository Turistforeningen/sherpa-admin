export default {
  minDelay: 200,
  onLoad: (importedModule, info, props, context) => {
    // Register reducer if it's set
    if (importedModule.reducer) {
      const { store } = context
      const { reducerRegistry } = store
      reducerRegistry.register(importedModule.reducer)
    }
  },
}
