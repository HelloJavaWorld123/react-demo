
import React, { Component } from 'react';
import { Card, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, Message } from 'antd';
import {fetch} from '../../api/tools'
import Header from './Header'


const FormItem = Form.Item;
const Option = Select.Option;

class ForgetPassword extends Component {
  state = {
    confirmDirty: false,
    telRegister: true,
    countTime: 60
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        fetch('get',`/admin/userRegister/resetPhone?password=${values.password}&phone=${values.phone}&code=${values.captcha}`).then(res=>{
          if(res.code ==0) {
            Message.success('修改成功')
            setTimeout(()=>{this.props.history.push('/login')},1000)
          }else{
            Message.error(res.msg)
          }
        })
      }
    });
  };
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if(value && !(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(value))){
      callback('密码必须由数字+字母组合，6到20位')
    } else if (value && value !== form.getFieldValue('password')) {
      callback('两次密码输入不一致');
    } else {
      callback();
    }
  };

  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if(value && !(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(value))){
      callback('密码必须由数字+字母组合，6到20位')
    } else if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  //获取短信验证码
  sendMsgCode = () =>{
    if(this.state.canNotGetCode){
      Message.destroy()
      Message.error('请输入正确的并且已注册的手机号')
      return
    }
    if(!(/^1\d{10}$/.test(this.props.form.getFieldValue('phone')))){
      Message.destroy()
      Message.error('请输入正确的手机号')
    }
    if(this.props.form.getFieldValue('phone')){
      fetch('get',`/admin/userRegister/resetCode?phone=${this.props.form.getFieldValue('phone')}`).then(res=>{
        if(res.code == 0){
          Message.success(res.msg)
          this.countDown()
        }
      })
    }else{
      Message.destroy()
      Message.error('请先输入正确的手机号')
    }
  }

  //校验验证码
  checkCode = (rule, value, callback) =>{
    if(value && !(/^\d{4}$/.test(value))){
      callback('请输入正确的验证码')
    } else if(value){
      fetch('get',`/admin/userRegister/checkResetCodeExp?phone=${this.props.form.getFieldValue('phone')}&code=${value}`).then(res=>{
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

  //校验手机号码
  checkTel = (rule, value, callback)=>{
    if(value && !(/^1\d{10}$/.test(value))){
      callback('请输入正确的手机号码')
    }else if(value){
      fetch('get',`/admin/userRegister/checkPhoneExist?phone=${value}`).then(res=>{
        if(res.code == 0){
          this.setState({canNotGetCode: true})
          callback('该手机号未注册');
        } else {
          this.setState({canNotGetCode: false})
          callback();
        }
      })
    } else {
      callback();
    }
  };

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

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 8,
        },
      },
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
        <Select className="icp-selector" style={{width: '60px'}}>
          <Option value="86">+86</Option>
        </Select>
    );
    return (
        <div>
          <Header/>
          <div style={{background: '#f5f5f5', position: 'absolute', height: '100%', width: '100%'}}>
          <div className="registerBox">
            <div className="title">找回密码</div>
                  <Form onSubmit={this.handleSubmit} style={{width:'60%',marginLeft:'20%'}}>
                    {!this.state.telRegister &&<FormItem
                        style={{marginBottom:'10'}}
                    >
                      {getFieldDecorator('email', {
                        rules: [{
                          type: 'email', message: '请输入合理的邮箱地址!',
                        }, {
                          required: true, message: '请输入邮箱地址!',
                        }],
                      })(
                          <Input placeholder="请输入合理的邮箱地址"/>
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

                        <Button style={{marginLeft: 5}} onClick={ this.state.isGetCode?'':this.sendMsgCode} >
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
                    {this.state.telRegister &&<FormItem
                        style={{marginBottom:'10'}}
                    >
                      {getFieldDecorator('password', {
                        rules: [{
                          required: true, message: '请输入新密码',
                        }, {
                          validator: this.checkConfirm,
                        }],
                        validateTrigger:'onBlur'
                      })(
                          <Input type="password" placeholder="新密码"/>
                      )}
                    </FormItem>}
                    {this.state.telRegister &&<FormItem
                    style={{marginBottom:'22'}}
                    >
                    {getFieldDecorator('confirm', {
                    rules: [{
                    required: true, message: '请确认你的新密码',
                    }, {
                    validator: this.checkPassword,
                    }],
                      validateTrigger:'onBlur'
                    })(
                    <Input type="password" onBlur={this.handleConfirmBlur} placeholder="确认新密码"/>
                    )}
                    </FormItem>}
                    <FormItem>
                      <Button type="primary" htmlType="submit" size="large" style={{width: '100%',marginBottom: '10px'}}>{this.state.telRegister?'保存':'确定'}</Button>
                      {/*{this.state.telRegister && <div style={{textAlign: 'center'}} onClick={()=>{this.setState({telRegister: false})}}>通过邮箱找回</div>}*/}
                      {!this.state.telRegister && <div style={{textAlign: 'center'}} onClick={()=>{this.setState({telRegister: true})}}>通过手机号找回</div>}
                      <div className="center"><a href="#/login">去登录></a></div>
                    </FormItem>
                  </Form>
          </div>
          </div>
        </div>
    )
  }
}


export default  Form.create()(ForgetPassword);