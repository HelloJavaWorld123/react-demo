/**
 * 地址配置文件
 */

const isProduction =  'https:' == document.location.protocol? true : false


export const BASE_API = isProduction ? 'https://shgwgapi.cx580.com' : 'http://localhost:9000';

//跳转地址
export const BASE_PATH = isProduction? 'https://www.tdata580.com/':'http://webtest.cx580.com:20007/content/data/index.html#/'