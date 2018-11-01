/**
 * Created by 叶子 on 2017/7/30.
 */
import * as type from './type';
import * as http from '../api/index';
import { message } from 'antd';


const requestData = category => ({
    type: type.REQUEST_DATA,
    category
});

export const receiveData = (data, category) => ({
    type: type.RECEIVE_DATA,
    data,
    category
});
/**
 * 请求数据调用方法
 * @param funcName      请求接口的函数名
 * @param params        请求接口的参数
 */
export const fetchData = ({funcName, params, stateName}) => dispatch => {
    !stateName && (stateName = funcName);
    dispatch(requestData(stateName));
    return http[funcName](params).then(res => {
      if(res.code == 0){
        dispatch(receiveData(res, stateName))
      }else{
        message.error(res.message);
      }
    });
};

// 清空store
export const clearData = () => ({
  type: type.CLEAR_DATA,
  data: {}
});

export const fetchLoginData = ({funcName, params, stateName}) => dispatch => {
  !stateName && (stateName = funcName);
  dispatch(requestData(stateName));
  return http[funcName](params).then(res => {
    if(res.status == 200){
      dispatch(receiveData(res, stateName))
    }else{
      message.error('登录失败');
    }
  });
};