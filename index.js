const TAM  = require('./lib')

module.exports = {
  getInstance: (config) =>  {
    return new TAM(config)
  }
}