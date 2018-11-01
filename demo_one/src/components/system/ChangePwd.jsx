/**
 * Created by hao.cheng on 2017/4/13.
 */
import React, { Component } from 'react';
import { Card, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, Message } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import {fetch} from '../../api/tools'
import { receiveData, fetchData } from '@/action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Encrypt }  from  '../../utils/index'


const FormItem = Form.Item;
const Option = Select.Option;

class ChangePwd extends Component {

  state = {
    confirmDirty: false,
    userInfo: {}
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let params = {
          username:  this.state.userInfo.username,
          phone: this.state.userInfo.phone,
          oldPwd: Encrypt(values.oldPwd),
          newPwd: Encrypt(values.newPwd),
          email: values.email,
          nickName: values.nickName
        }
        fetch('put','/admin/user/editSimple',params).then(res=>{
          if(res.code == 0){
            Message.destroy()
            Message.success('修改成功')
            this.props.form.resetFields();
          }else{
            Message.destroy()
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
    } else if (value && value !== form.getFieldValue('newPwd')) {
      callback('两次输入密码不一致');
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

  // componentWillReceiveProps(nextProps) {
  //   let userInfo = nextProps.userInfo && nextProps.userInfo.data && nextProps.userInfo.data.data||{}
  //   this.setState({userInfo: userInfo},()=>{
  //
  //   })
  // }

  componentDidMount(){
    // let userInfo = this.props.userInfo && this.props.userInfo.data && this.props.userInfo.data.data
    // if(userInfo){
    //   this.setState({userInfo: userInfo},()=>{
    //     this.props.form.setFieldsValue({
    //       phone: this.state.userInfo.phone,
    //     });
    //   })
    // }else{
    //   this.props.fetchData({funcName:'userInfo',stateName: 'userInfo'})
    // }
    // fetch('get','/admin/user/simple').then(res=>{
    //   if(res.code == 0){
    //     this.setState({userInfo: res.data},()=>{
    //       this.props.form.setFieldsValue({
    //         phone: this.state.userInfo.phone,
    //         username: this.state.userInfo.username
    //       });
    //     })
    //   }else{
    //     Message.destroy()
    //     Message.error(res.msg)
    //   }
    // })
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 10,
          offset: 7,
        },
      },
    };
    let {userInfo} = this.state
    return (
        <div className="gutter-example">
          <Card title="修改密码">
          <Row>
            <Col className="gutter-row">
              <div className="gutter-box">
                <Card bordered={false}>
                  <Form onSubmit={this.handleSubmit}>
                    {/*<FormItem*/}
                        {/*{...formItemLayout}*/}
                        {/*label="账号"*/}
                    {/*>*/}
                      {/*{getFieldDecorator('username', {*/}
                        {/*rules: [{ required: true, message: '请输入你的账号' }],*/}
                      {/*})(*/}

                          {/*<Input disabled={true} />*/}
                      {/*)}*/}
                    {/*</FormItem>*/}
                    {/*<FormItem*/}
                        {/*{...formItemLayout}*/}
                        {/*label="手机号"*/}
                    {/*>*/}
                      {/*{getFieldDecorator('phone', {*/}
                        {/*rules: [{ required: true, message: '请输入你的电话号码!' }],*/}
                      {/*})(*/}
                          {/*<Input disabled={true}/>*/}

                      {/*)}*/}
                    {/*</FormItem>*/}
                    {/*<FormItem*/}
                        {/*{...formItemLayout}*/}
                        {/*label="邮箱"*/}
                    {/*>*/}
                      {/*{getFieldDecorator('email', {*/}
                        {/*rules: [{*/}
                          {/*type: 'email', message: '请输入合理的邮箱地址!',*/}
                        {/*}],*/}
                      {/*})(*/}
                          {/*<Input />*/}
                      {/*)}*/}
                    {/*</FormItem>*/}
                    {/*<FormItem*/}
                        {/*{...formItemLayout}*/}
                        {/*label="昵称"*/}
                    {/*>*/}
                      {/*{getFieldDecorator('nickName', {*/}
                        {/*rules: [{*/}
                          {/*required: true, message: '请输入您的昵称!',*/}
                        {/*}],*/}
                      {/*})(*/}
                          {/*<Input />*/}
                      {/*)}*/}
                    {/*</FormItem>*/}
                    <FormItem
                        {...formItemLayout}
                        label="旧密码"
                    >
                      {getFieldDecorator('oldPwd', {
                        rules: [{
                          required: true, message: '请输入旧密码',
                        }, {
                          validator: this.checkConfirm,
                        }],
                        validateTrigger:'onBlur'
                      })(
                          <Input type="password" />
                      )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="新密码"
                    >
                      {getFieldDecorator('newPwd', {
                        rules: [{
                          required: true, message: '请输入新密码',
                        }, {
                          validator: this.checkConfirm,
                        }],
                        validateTrigger:'onBlur'
                      })(
                          <Input type="password" />
                      )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="确认密码"
                    >
                      {getFieldDecorator('confirm', {
                        rules: [{
                          required: true, message: '请确认你的密码',
                        }, {
                          validator: this.checkPassword,
                        }],
                        validateTrigger:'onBlur'
                      })(
                          <Input type="password" onBlur={this.handleConfirmBlur} />
                      )}
                    </FormItem>

                    <FormItem {...tailFormItemLayout}>
                      <Button type="primary" htmlType="submit" size="large" style={{width: '100%'}}>确认修改</Button>
                    </FormItem>
                  </Form>
                </Card>
              </div>
            </Col>
          </Row>
          </Card>
        </div>
    )
  }
}


const mapStateToProps = state => {
  const {userInfo = {data: {}} } = state.httpData;
  return {userInfo};
};


const mapDispatchToProps = dispatch => ({
  fetchData: bindActionCreators(fetchData, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ChangePwd))