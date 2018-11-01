/**
 * http通用工具函数
 */
import axios from 'axios';
import { message } from 'antd';
import * as config from './config';


const toQueryPair = (key, value) =>{
  ///<summary>将键值对转为URL参数</summary>
  if (typeof value == 'undefined') {
    return key;
  }
  return key + '=' + encodeURIComponent(value === null ? '' : String(value));
  //return key + '=' + (value == null ? '' : String(value));
}

export const toQueryString = (obj) =>{
  if(obj){
    var ret = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        key = encodeURIComponent(key);
        var values = obj[key];
        if (values && values.constructor === Array) { //数组
          var queryValues = [];
          for (var i = 0, len = values.length, value; i < len; i++) {
            value = values[i];
            queryValues.push(toQueryPair(key, value));
          }
          ret = ret.concat(queryValues);
        } else { //字符串
          ret.push(toQueryPair(key, values));
        }
      }
    }
    return ret.join('&');
  }else{
    return ''
  }
};

const getCookie = (name) => {
  let arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  if(arr=document.cookie.match(reg))
    return unescape(arr[2]);
  else
    return null;
};

//设置统一的请求头
export const createAxiosInstance = (token) =>{
  let headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
      'Access-Control-Allow-Origin':'*'
  };
  let authToken = token?'Bearer '+ token : getCookie('authorization')
  if(authToken){
    let Authorization = {'Authorization': authToken}
    Object.assign(headers,Authorization)
  }
  const instance = axios.create({
    baseURL: config.BASE_API,
    timeout: 10000,
    headers: headers,
  })
  return instance
}

window.axiosInstance = createAxiosInstance();

export const post = (url, params) =>{
  let formParams = toQueryString(params)
  window.axiosInstance.post(url, formParams)
}

//统一的请求接口
export const fetch = (method,url,params) => {
  let promise = new Promise((resolve, reject) => {
    window.axiosInstance[method](url, params)
        .then(function (response) {
          if(response.data && response.data.code == 401){
            window.location.href = '#/login'
            return
          }
          resolve(response.data)
        })
        .catch(function (e) {
          console.error("fetch 请求出错了");
          reject('网络故障，请稍后再试')
        });
    // 超时处理
    setTimeout(() => reject('系统繁忙，请稍后再试'), 20000);
  });
  return promise;
}


