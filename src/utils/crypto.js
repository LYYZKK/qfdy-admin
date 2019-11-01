import CryptoJS from 'crypto-js/crypto-js'

class Crypto {
  constructor(key, iv) {
    this.key = key
    this.iv = iv
  }

  encrypt({ plainStr, returnBase64 = false, returnHex = true }) {
    const encrypted = CryptoJS.AES.encrypt(plainStr, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })

    if (returnBase64) {
      // TODO 返回 base64 格式人密文.
    }

    if (returnHex) {
      return CryptoJS.enc.Hex.parse(encrypted.ciphertext.toString())
    }
  }
}

// 默认 KEY、iv.
const KEY = CryptoJS.enc.Utf8.parse('Wise2cPromotions') // ""中与后台一样  密码
const IV = CryptoJS.enc.Utf8.parse('Wise2cPromotions') // ""中与后台一样

/**
 * AES加密 ：字符串 key iv  返回base64
 */
export function Encrypt(plainStr, keyStr, ivStr) {
  let key = KEY
  let iv = IV

  if (keyStr) {
    key = CryptoJS.enc.Utf8.parse(keyStr)
    iv = CryptoJS.enc.Utf8.parse(ivStr)
  }

  const encrypted = CryptoJS.AES.encrypt(plainStr, key, {
    iv: iv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })

  return CryptoJS.enc.Hex.parse(encrypted.ciphertext.toString())
}

/**
 * AES 解密 ：字符串 key iv
 *
 */
export function Decrypt(enctyptedStr, keyStr, ivStr) {
  let key = KEY
  let iv = IV

  if (keyStr) {
    key = CryptoJS.enc.Utf8.parse(keyStr)
    iv = CryptoJS.enc.Utf8.parse(ivStr)
  }

  const encryptedBase64Str = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(enctyptedStr))
  const decrypted = CryptoJS.AES.decrypt(encryptedBase64Str, key, {
    iv: iv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })

  return CryptoJS.enc.Utf8.stringify(decrypted).toString()
}
