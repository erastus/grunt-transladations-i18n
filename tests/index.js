const requireModule = require.context('.', false, /\.json$/)
let modules = {}
requireModule.keys().forEach((fileName) => {
  if (fileName === './index.js') return
  modules = Object.assign(modules, requireModule(fileName));
})

export default modules