
import React, { Component } from 'react';
import { Card, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, Message } from 'antd';
import {fetch} from '../../api/tools'
import Header from './Header'

const FormItem = Form.Item;
const Option = Select.Option;

class Register extends Component {
  state = {
    confirmDirty: false,
    telRegister: true,
    countTime: 60
  };


  // handleConfirmBlur = (e) => {
  //   const value = e.target.value;
  //   this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  // };

  // checkPassword = (rule, value, callback) => {
  //   const form = this.props.form;
  //   if (value && value !== form.getFieldValue('password')) {
  //     callback('Two passwords that you enter is inconsistent!');
  //   } else {
  //     callback();
  //   }
  // };
  // checkConfirm = (rule, value, callback) => {
  //   const form = this.props.form;
  //   if (value && this.state.confirmDirty) {
  //     form.validateFields(['confirm'], { force: true });
  //   }
  //   callback();
  // };

  //校验用户名
  checkUsername = (rule, value, callback)=>{
    if(value && !(/^(?![0-9]+$)[0-9A-Za-z]{5,20}$/.test(value))){
      callback('用户名必须由字母或字母+数字组合,5到20位')
    } else if(value){
      fetch('get',`/admin/userRegister/checkUserExist?userName=${value}`,{userName: value}).then(res=>{
        if(res.code != 0){
          callback('该账号已注册');
        }else{
          callback();
        }
      })
    }else{
      callback();
    }
  };


  //校验手机号码
  checkTel = (rule, value, callback)=>{
    if(value && !(/^1\d{10}$/.test(value))){
      callback('请输入正确的手机号码')
      this.setState({errorPhone: true})
    } else if(value){
      fetch('get',`/admin/userRegister/checkPhoneExist?phone=${value}`).then(res=>{
       if(res.code == 1){
         this.setState({canNotGetMsgCode: true})
         callback('该手机号已注册');
       } else {
         this.setState({canNotGetMsgCode: false})
         callback();
       }
      })
    }else{
      callback();
    }
  };

  //获取短信验证码
  sendMsgCode = () =>{
    setTimeout(()=>{
      if(this.state.errorPhone){
        Message.destroy()
        Message.error('请输入正确的手机号码')
        return
      }
      if(this.state.canNotGetMsgCode){
        Message.destroy()
        Message.error('该手机号已注册')
        return
      }
      if(this.state.isFetchData) return
      if(this.props.form.getFieldValue('phone')){
        this.setState({isFetchData: true})
        fetch('get',`/admin/userRegister/regCode?phone=${this.props.form.getFieldValue('phone')}`).then(res=>{
          //防止多次点击发送数据
          setTimeout(()=>{this.setState({isFetchData: false})},1000)
          if(res.code == 0){
            Message.destroy()
            Message.success(res.msg)
            this.countDown()
          }else{
            Message.destroy()
            Message.error(res.msg)
          }
        })
      }else{
        Message.destroy()
        Message.error('请先输入正确的手机号')
      }
    },200)
  }

  //校验验证码
  checkCode = (rule, value, callback) =>{
    if(value && !(/^\d{4}$/.test(value))){
      callback('请输入正确的验证码')
    } else if(value){
      fetch('get',`/admin/userRegister/checkRegCodeExp?phone=${this.props.form.getFieldValue('phone')}&code=${value}`).then(res=>{
        if(res.code != 0){
          callback(res.msg);
        } else {
          callback();
        }
      })
    }else{
      callback();
    }
  }
  //倒计时
  countDown = () =>{
    this.setState({
      'isGetCode': true
    });
    this.timer = setInterval(() => {
      let tempTime = this.state.countTime;
      if (tempTime > 1) {
        tempTime = tempTime - 1;
        this.setState({
          'countTime': tempTime
        })
      } else {
        this.setState({
          'isGetCode': false,
          'countTime': 60
        });
        clearInterval(this.timer)
      }
    }, 1000)
  }

  //校验密码
  checkPassword = (rule, value, callback) =>{
    if(value && !(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(value))){
      callback('密码必须由数字+字母组合，6到20位')
    } else{
      callback();
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(values && !values.agreement){
        Message.destroy()
        Message.error('同意用户服务协议,才可完成注册')
        return
      }
      if (!err) {
        let params = {
          password: values.psd,
          username: values.name,
          phone: values.phone,
          code: values.captcha
        }
        fetch('put',`/admin/userRegister/add`, params).then(res=>{
          if(res.code == 0){
            Message.destroy()
            Message.success('注册成功')
            setTimeout(()=>{this.props.history.push('/login')},1000)
          } else {
            Message.destroy()
            Message.error(res.msg)
          }
        })
      }
    });
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  componentDidMount(){

  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
        <div>
          <Header/>
          <div style={{background: '#f5f5f5', position: 'absolute', height: '100%', width: '100%'}}>
            <div className="registerBox">
              <div className="title">手机号注册</div>
                  <Form onSubmit={this.handleSubmit} style={{width:'60%',marginLeft:'20%'}}>
                    {/*for disable autocomplete on chrome*/}
                    <FormItem style={{height:0, zIndex: '-1'}}>
                      <input type="text" autocomplete="off" style={{opacity: 0}}/>
                      <input className="form-control" style={{opacity: 0}} type="password" name="tradePassword" id="txPassword" autocomplete="new-password" />
                      <input className="form-control" style={{opacity: 0}} type="text"  id="nameEx"  name="name" autocomplete="off" />
                    </FormItem>
                    <FormItem style={{marginBottom:'10'}}
                    >
                      {getFieldDecorator('name', {
                        rules: [{required: true, message: '请输入用户名'},{ validator: this.checkUsername}],
                        validateTrigger:'onBlur'
                      })(
                          <Input placeholder="用户名" type="text"/>
                      )}
                    </FormItem>
                    {!this.state.telRegister &&<FormItem
                        style={{marginBottom:'10'}}
                    >
                      {getFieldDecorator('email', {
                        rules: [{
                          type: 'email', message: '请输入合理的邮箱地址',
                        }, {
                          required: true, message: '请输入邮箱地址',
                        }],
                      })(
                          <Input />
                      )}
                    </FormItem>}
                    {this.state.telRegister && <FormItem
                        style={{marginBottom:'10'}}
                    >
                      {getFieldDecorator('phone', {
                        rules: [{ required: true, message: '请输入正确的手机号码'},{ validator: this.checkTel}],
                        validateTrigger:'onBlur'
                      })(
                          <Input  placeholder="手机号"/>

                      )}
                    </FormItem>}
                    {this.state.telRegister && <FormItem
                        style={{marginBottom:'10'}}
                    >
                      <div className="register-captcha">
                        {getFieldDecorator('captcha', {
                          rules: [{ required: true, message: '请输入你获取的验证码'},{ validator: this.checkCode}],
                          validateTrigger:'onBlur'
                        })(
                            <Input placeholder="验证码"/>
                        )}
                        <Button  style={{marginLeft: 5}} onClick={ this.state.isGetCode?'': this.sendMsgCode} >
                          { this.state.isGetCode? this.state.countTime+'S' : '获取验证码'}
                        </Button>
                      </div>
                    </FormItem>}
                    {!this.state.telRegister && <FormItem
                    >
                      <div className="register-captcha">
                        {getFieldDecorator('captcha', {
                          rules: [{ required: true, message: '请输入图形验证码' }],
                        })(
                            <Input placeholder="请输入图形验证码"/>
                        )}
                        <img src="" alt=""/>
                      </div>
                    </FormItem>}
                    <FormItem
                        style={{marginBottom:'10'}}
                    >
                      {getFieldDecorator('psd', {
                        rules: [{ required: true, message: '请输入密码'},{ validator: this.checkPassword}],
                        validateTrigger:'onBlur'
                      })(
                          <Input type="password" placeholder="密码"/>
                      )}
                    </FormItem>
                    <FormItem style={{ marginBottom: 8 }}>
                      {getFieldDecorator('agreement', {
                        valuePropName: 'checked',
                        initialValue: true,
                      })(
                          <Checkbox></Checkbox>
                      )}
                      <span>已经阅读并同意<span className="c-blue cursor-p" onClick={()=>{window.open("#/Protocol")}}>用户服务协议</span>及<span className="c-blue cursor-p" onClick={()=>{window.open("#/dataProtocol")}}>数据服务使用协议</span></span>
                    </FormItem>
                    <FormItem>
                       <Button type="primary" htmlType="submit" size="large" style={{width: '100%'}}>注册</Button>
                    </FormItem>
                    <FormItem>
                      <p style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                        {/*{this.state.telRegister && <span onClick={()=>{this.setState({telRegister: false})}}>邮箱注册</span>}*/}
                        {!this.state.telRegister && <span onClick={()=>{this.setState({telRegister: true})}}>手机号注册</span>}
                        <span onClick={()=>{this.props.history.push('/login')}}>已有账号？<a>直接登录</a></span>
                      </p>
                    </FormItem>
                  </Form>
            </div>

          </div>
        </div>
    )
  }
}


export default  Form.create()(Register);