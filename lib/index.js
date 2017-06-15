'use strict'

const _ = require('lodash')
const User = require('./user')
const Report = require('./report')
const logger = require('./logger').getInstance()

module.exports = class Tongji {
  constructor(config) {
    this.user = new User(config)
    this.report = new Report(config)
    logger.config(_.pick(config, ['logLevel', 'logProvider']))
  }

  async login() {
    logger.info('[TAM] Start user login process')
    if (!await this.user.preLogin()) {
      throw new Error('[TAM] Prelogin failed. Cannot process next step.')
    }

    const session = await this.user.doLogin()
    if (!session) {
      throw new Error('[TAM] Cannot retieve user session.')
    }

    this.report.setContext(session)
    return true
    // add emit event later.
  }

  async logout() {
    return this.user.doLogout()
  }

  getSiteList() {
    return this.report.getSiteList()
  }

  getData(params) {
    return this.report.getData(params)
  }
}
