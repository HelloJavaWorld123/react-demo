
import axios from 'axios';
import { get, fetch, toQueryString} from './tools';
import * as config from './config';
import { message } from 'antd';


export const npmDependencies = () => axios.get('./npm.json').then(res => res.data).catch(err => console.log(err));

const GIT_OAUTH = 'https://github.com/login/oauth';

export const gitOauthLogin = () => axios.get(`${GIT_OAUTH}/authorize?client_id=792cdcd244e98dcd2dee&redirect_uri=http://localhost:3006/&scope=user&state=reactAdmin`);
export const gitOauthToken = code => axios.post('https://cors-anywhere.herokuapp.com/' + GIT_OAUTH + '/access_token', {...{client_id: '792cdcd244e98dcd2dee',
    client_secret: '81c4ff9df390d482b7c8b214a55cf24bf1f53059', redirect_uri: 'http://localhost:3006/', state: 'reactAdmin'}, code: code}, {headers: {Accept: 'application/json'}})
    .then(res => res.data).catch(err => console.log(err));
export const gitOauthInfo = access_token => axios({
    method: 'get',
    url: 'https://api.github.com/user?access_token=' + access_token,
}).then(res => res.data).catch(err => console.log(err));



//用户登录
export const login = (params) => axios.post(config.BASE_API+'/auth/oauth/token',toQueryString(params),{headers: {'Content-Type': 'application/x-www-form-urlencoded',Accept: 'application/json',Authorization:'Basic ZGF0YW9uZTpkYXRhb25l'}}).catch(err=>{
  if(err.response && [400,401,403].includes(err.response.status)){
    message.destroy()
    message.error('用户名不存在或密码错误')
  }else{
    message.destroy()
    message.error('系统未知错误,请反馈给管理员')
  }
})

//用户退出登录
export const loginOut = (params) => axios.post(config.BASE_API+'/auth/authentication/removeToken',toQueryString(params),{headers: {'Content-Type': 'application/x-www-form-urlencoded',Accept: 'application/json'}})

//获取用户未读信息条数
 export const unreadNews = () => fetch('get','/usercenter/messages/count?status=0')

//获取用户充值信息情况
export const usersWallet = () => fetch('get','/usercenter/transaction/main-wallet-info')

//获取用户账号信息
export const userInfo = () => fetch('get','/admin/user/simple')





