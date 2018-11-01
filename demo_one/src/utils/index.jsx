/**
 * Created by hao.cheng on 2017/4/28.
 */

import CryptoJS from 'crypto-js'
//AES加密并编码
export const Encrypt = (word) =>{
  const key = CryptoJS.enc.Utf8.parse("04f8c2b85a354275");  //十六位十六进制数作为密钥
  const iv = CryptoJS.enc.Utf8.parse('04f8c2b85a354275');
  let srcs = CryptoJS.enc.Utf8.parse(word);
  //AES加密
  let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  //base64编码
  let ciphertext = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(encrypted.ciphertext.toString()))
  return ciphertext;
}

// 获取url的参数
export const queryString = () => {
    let _queryString = {};
    const _query = window.location.search.substr(1);
    const _vars = _query.split('&');
    _vars.forEach((v, i) => {
        const _pair = v.split('=');
        if (!_queryString.hasOwnProperty(_pair[0])) {
            _queryString[_pair[0]] = decodeURIComponent(_pair[1]);
        } else if (typeof _queryString[_pair[0]] === 'string') {
            const _arr = [ _queryString[_pair[0]], decodeURIComponent(_pair[1])];
            _queryString[_pair[0]] = _arr;
        } else {
            _queryString[_pair[0]].push(decodeURIComponent(_pair[1]));
        }
    });
    return _queryString;
};