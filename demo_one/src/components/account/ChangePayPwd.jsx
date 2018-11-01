
import React from 'react';
import { Row, Col,Card, Button, Icon,  Divider, Message, Table, Tabs, Form, Input, Modal, Switch} from 'antd';
import {fetch} from '../../api/tools'
import { receiveData, fetchData } from '@/action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Encrypt }  from  '../../utils/index'


const TabPane = Tabs.TabPane;
const FormItem = Form.Item;


class ChangePayPwd extends React.Component {

  state={
    activeIndex: 0,
    usersWallet:{},
    accountDetail:[],
    userInfo:{},
    countTime: 60,
    visible: true,
    confirmDirty: false,
  }

  handleTab=(index)=>{
    this.setState({activeIndex: index})
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };


  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
    this.props.close()
  };


  handleOk = (e) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let params = {
          code: values.captcha,
          payPwd: Encrypt(values.payPwd),
          phone: this.state.userInfo.phone
        }
        fetch('put','/admin/user/payPwd',params).then(res=>{
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

  //获取短信验证码
  sendMsgCode = () =>{
    if(this.state.userInfo && this.state.userInfo.phone){
      fetch('get',`/admin/userRegister/regCode?phone=${this.state.userInfo.phone}`).then(res=>{
        if(res.code == 0){
          Message.destroy()
          Message.success(res.msg)
          this.countDown()
        }
      })
    }else{
      Message.destroy()
      Message.error('请先输入正确的手机号')
    }
  }

  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if(value && !(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(value))){
      callback('密码必须由数字+字母组合，6到20位')
    } else if (value && value !== form.getFieldValue('payPwd')) {
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
      form.validateFields(['confirmpayPwd'], { force: true });
    }
    callback();
  };


  //校验验证码
  checkCode = (rule, value, callback) =>{
    if(value && !(/^\d{4}$/.test(value))){
      callback('请输入正确的验证码')
    } else if(value){
      fetch('get',`/admin/userRegister/checkRegCodeExp?phone=${this.state.userInfo.phone}&code=${value}`).then(res=>{
        if(res.code != 0){
          callback(res.msg);
        } else {
          callback();
        }
      })
    } else{
      callback();
    }
  }




  componentDidMount(){
    // let userInfo = this.props.userInfo && this.props.userInfo.data && this.props.userInfo.data.data
      //     // if(userInfo){
      //     //   this.setState({userInfo: userInfo})
      //     // }else{
      //     //   this.props.fetchData({funcName:'userInfo',stateName: 'userInfo'})
      //     // }

  }

  componentWillReceiveProps(nextProps) {
    let userInfo = nextProps.userInfo && nextProps.userInfo.data && nextProps.userInfo.data.data || {}
    this.setState({ userInfo: userInfo})
  }

  render() {
    const { getFieldDecorator} = this.props.form;
    const { userInfo} = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 12,
          offset: 6,
        },
      },
    };

    return (
        <div className="gutter-example">
         <Card title="支付密码" bordered = {false}>
           <Row>
             <Col span={14} offset={5}>
               <Col offset={3} style={{height: 40}}>短信验证码将发到绑定的手机号【{userInfo.phone}】上，请注意查收。</Col>
               <Form onSubmit={this.handleOk}>
                 <FormItem
                     {...formItemLayout}
                     label="验证码"
                 >
                   <div className="register-captcha">
                     {getFieldDecorator('captcha', {
                       rules: [{ required: true, message: '请输入你获取的验证码'},{
                         validator: this.checkCode,
                       }],
                       validateTrigger:'onBlur'
                     })(
                         <Input placeholder="请输入验证码"/>
                     )}
                     <Button style={{marginLeft: 5}} onClick={ this.state.isGetCode?'':this.sendMsgCode} >
                       { this.state.isGetCode? this.state.countTime+'S' : '获取验证码'}
                     </Button>
                   </div>
                 </FormItem>
                 <FormItem
                     {...formItemLayout}
                     label="支付密码"
                 >
                   {getFieldDecorator('payPwd', {
                     rules: [{ required: true, message: '请输入支付密码'}, {
                       validator: this.checkConfirm,
                     }],
                     validateTrigger:'onBlur'

                   })(
                       <Input placeholder="请输入支付密码"  type="passWord" />
                   )}
                 </FormItem>
                 <FormItem
                     {...formItemLayout}
                     label="确认密码"
                     style={{marginBottom: 10}}
                 >
                   {getFieldDecorator('confirmpayPwd', {
                     rules: [{ required: true, message: '请确认支付密码'}, {
                       validator: this.checkPassword,
                     }],
                     validateTrigger:'onBlur'
                   })(
                       <Input placeholder="请确认支付密码"  onBlur={this.handleConfirmBlur} type="passWord"/>
                   )}
                 </FormItem>
                 <FormItem
                     {...tailFormItemLayout}
                 >
                   <Button type="primary" htmlType="submit" size="large" style={{width: '100%',marginTop: '30'}}>确定</Button>
                 </FormItem>
               </Form>
             </Col>
           </Row>
         </Card>
        </div>
    );
  }
}




const mapStateToProps = state => {
  const {  userInfo = {data: {}}} = state.httpData;
  return { userInfo};
};


const mapDispatchToProps = dispatch => ({
  fetchData: bindActionCreators(fetchData, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ChangePayPwd))


