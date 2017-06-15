'use strict'

const crypto = require('crypto')
const constants = require('constants')
const logger = require('./logger').getInstance()
const zlib = require('mz/zlib')
const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDHn/hfvTLRXViBXTmBhNYEIJeG
GGDkmrYBxCRelriLEYEcrwWrzp0au9nEISpjMlXeEW4+T82bCM22+JUXZpIga5qd
BrPkjU08Ktf5n7Nsd7n9ZeI0YoAKCub3ulVExcxGeS3RVxFai9ozERlavpoTOdUz
EH6YWHP4reFfpMpLzwIDAQAB
-----END PUBLIC KEY-----`

// 
const gzip = data => {
  try {
    return zlib.gzip(JSON.stringify(data), { level: 9 })
  } catch (err) {
    logger.error('[TAM] Failed to zip data with error:', err)
  }
}

module.exports = async data => {
  const buffer = await gzip(data)
  const blocks = Math.ceil(buffer.length / 117)
  const ret = new Buffer(blocks * 128)
  for (let i = 0; i < blocks; i++) {
    const currentBlock = buffer.slice(117 * i, 117 * (i + 1))
    const encryptedChunk = crypto.publicEncrypt({
      key: publicKey,
      padding: constants.RSA_PKCS1_PADDING
    }, currentBlock)
    encryptedChunk.copy(ret, i * 128)
  }

  return ret
}
