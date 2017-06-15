'use strict'

const _ = require('lodash')
const fetch = require('node-fetch')
const encrypt = require('./encrypt')
const zlib = require('mz/zlib')
const logger = require('./logger').getInstance()

const _url = 'https://api.baidu.com/sem/common/HolmesLoginService'
const _headers = {
  'account_type': '1',
  'Content-Type': 'data/gzencode and rsa public encrypt;charset=UTF-8'
}

const sendRequest = async postData => {
  logger.debug('[TAM] Sending request with url', _url)
  let res = await fetch(_url, {
    method: 'POST',
    body: await encrypt(postData),
    headers: _headers
  })

  try {
    let buffer = await res.buffer()
    let rawBody = await zlib.gunzip(buffer.slice(8))
    return JSON.parse(rawBody)
  } catch (err) {
    logger.error('[TAM] Request faild with error:', err)
    return null
  }
}

module.exports = class User {
  constructor(config) {
    Object.assign(this, config)
  }

  async preLogin() {
    const postData = {
      username: this.username,
      functionName: 'preLogin',
      token: this.token,
      uuid: this.uuid,
      request: { osVersion: 'windows', deviceType: 'pc', clientVersion: '1.0' }
    }

    logger.info('[TAM] Processing preLogin...')
    const res = await sendRequest(postData)

    if (res && res.needAuthCode === false) {
        logger.info('[TAM] PreLogin completed successfully')
        return true
    } else {
        logger.info('[TAM] PreLogin failed with unexpected response:', res)
        return false
    }
  }

  async doLogin() {
    const postData = {
      username: this.username,
      functionName: 'doLogin',
      token: this.token,
      uuid: this.uuid,
      request: { password: this.password }
    }

    logger.info('[TAM] Processing doLogin...')
    let res = await sendRequest(postData)

    if (res && res.retcode === 0) {
      logger.info('[TAM] DoLogin completed successfully')
      this.session = _.pick(res, ['ucid', 'st'])
      return this.session
    } else {
      logger.warn('[TAM] DoLogin failed with unexpected response:', res)
      return null
    }
  }

  async doLogout() {
    let postData = {
      username: this.username,
      functionName: 'doLogout',
      token: this.token,
      uuid: this.uuid,
      request: this.session
    }

    logger.info('[TAM] Processing doLogout...')

    let res = await sendRequest(postData)
    if (res && res.retcode === 0) {
      logger.info('[TAM] doLogout completed successfully')
      return true
    } else {
      logger.warn('[TAM] doLogout failed with unexpected response:', res)
      return false
    }
  }
}