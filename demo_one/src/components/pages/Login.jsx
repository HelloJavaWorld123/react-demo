/**
 * Created by hao.cheng on 2017/4/16.
 */
import React from 'react';
import {Row, Col, Form, Icon, Input, Button, Checkbox,Message } from 'antd';
import { connect } from 'react-redux';
import {login} from '../../api/index';
import loginBg from '@/style/imgs/loginBg.png';
import logo from '@/style/imgs/logo.png';
import { createAxiosInstance} from '../../api/tools';
import * as config from '../../api/config';
import moment from 'moment';
import { Encrypt }  from  '../../utils/index'





const FormItem = Form.Item;

class Login extends React.Component {
    state={
      usernameError: false,
      psdError: false,
      errorInfo: ''
    }

   componentWillMount() {

    }

    handleSubmit = (e) => {
        e.preventDefault()
        // const { history } = this.props
        // this.props.form.validateFields((err, values) => {
        //     if (!err) {
        //       if(!(/^[A-Za-z0-9]{5,15}$/.test(values.username))){
        //         this.setState({usernameError: true, errorInfo: '请输入正确用户名/手机号（5-15位英文或者数字）'})
        //         return
        //       }else{
        //         this.setState({usernameError: false, errorInfo: ''})
        //       }
        //       if(!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(values.password))){
        //         this.setState({psdError: true, errorInfo: '密码必须由数字+字母组合，6到20位'})
        //         return
        //       }else{
        //         this.setState({psdError: false, errorInfo: ''})
        //       }
        //       let params = {
        //         username: values.username,
        //         password: Encrypt(values.password),
        //         // password: values.password,
        //         grant_type:'password',
        //         scope:'server'
        //        };
        //       login(params).then(res=>{
        //         if(res && res.data && res.data.access_token){
        //           window.axiosInstance = createAxiosInstance(res.data.access_token);
        //           let domain = 'https:' == document.location.protocol? 'tdata580.com' : 'cx580.com';
        //           let expire_time = new Date()
        //           expire_time.setTime(expire_time.getTime() + res.data.expires_in*1000)
        //           document.cookie = `authorization=Bearer ${res.data.access_token}; expires=${expire_time.toGMTString()}; domain=${domain}; path=/`
        //           // localStorage.setItem('authorization','Bearer '+res.data.access_token)
        //           // localStorage.setItem('deadline',moment().add(res.data.expires_in,'s').format('YYYY-MM-DD HH:mm:ss'))
        //           history.push('/app/home')
        //         }else{
        //           res.data && this.setState({errorInfo: res.data.msg})
        //         }
        //       });
        //     }
        // });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const {usernameError, psdError, errorInfo} = this.state
        return (
            <div className="login-container">
              <Row className="login-header y-center" >
                <Col span={16} offset={4}>
                  <div className="content ">
                    <div className="logo">
                      <img src={logo} alt=""/>
                    </div>
                     <div className="cursor-p" onClick={()=>window.location.href=`${config.BASE_PATH}home`}>首页</div>
                  </div>
                </Col>
              </Row>

            <Row className="login">
              <img src={loginBg} className="login-bg" alt=""/>
              {/*<Col span={16} offset={4}>*/}
              <div className="login-form" >
                    <div className="login-logo">
                        <span>登录</span>
                    </div>
                    <Form onSubmit={this.handleSubmit} style={{maxWidth: '400px'}}>
                        <FormItem style={{marginBottom: '.1rem'}} className='login-form-item'>
                            {getFieldDecorator('username', {
                                rules: [],
                            })(
                                <Input placeholder="用户名/手机号" style={{height: '.5rem'}} className={`${usernameError?'errBorder':''}`}/>
                            )}
                        </FormItem>
                        <FormItem style={{marginBottom: '.1rem'}} className='login-form-item'>
                            {getFieldDecorator('password', {
                                rules: [],
                            })(
                                <Input type="password"  style={{height: '.5rem'}} placeholder="请输入密码" className={`${psdError?'errBorder':''}`}/>
                            )}
                        </FormItem>
                        <div style={{color:'#FF4444', fontSize:'12', marginBottom: `${errorInfo? '.22rem': '.44rem'}`}}>{errorInfo}</div>
                        <FormItem className='login-form-item'>
                          {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                          })(
                              <Checkbox style={{display:'none'}}>记住密码</Checkbox>
                          )}
                          <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%', height: '.44rem', fontSize:'.18rem'}}>
                            登录
                          </Button>
                            <p style={{display: 'flex', justifyContent: 'space-between', marginTop:'.21rem', fontSize:'.16rem'}}>
                                <a onClick={()=>{this.props.history.push('/register')}}>账号注册</a>
                              <a  onClick={()=>{this.props.history.push('/forgetPassword')}}>忘记密码</a>
                            </p>
                          {/*<p className="login-form-forgot" href="" style={{float: 'right'}}></p>*/}
                        </FormItem>
                    </Form>
                </div>
              {/*</Col>*/}
            </Row>
            <div className="login-footer center">
              版权所有 广州车行易科技股份有限公司 备案/许可证编号为：粤ICP备12014404号-4 电话：020-62936789
            </div>
            </div>

        );
    }
}

const mapStateToPorps = state => {
  return {}
};


export default connect(mapStateToPorps)(Form.create()(Login));