
import React from 'react';
import { Row, Col,Card, Button, Icon,  Divider, Message, Table, Form, Input, Modal, Switch, Select} from 'antd';
import {fetch} from '../../api/tools'
import { receiveData, fetchData } from '@/action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const FormItem = Form.Item;
const Option = Select.Option;


class SetAlarm extends React.Component {

  state={
    activeIndex: 0,
    usersWallet:{},
    accountDetail:[],
    userInfo:{},
    countTime: 60,
    visible: true
  }

  handleTab=(index)=>{
    this.setState({activeIndex: index})
  }


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
          alarmAmount: values.alarmAmount,
          alarmEmail: values.alarmEmail,
          alarmPhone: values.alarmPhone,
          alarmPhoneBak: values.alarmPhoneBak,
          alarmType: values.alarmType === '关闭'? 0 : 1,
          sourceServiceId: this.props.alarmRecord.sourceServiceId,
          userSub: this.props.alarmRecord.userSub
        };
        this.props.postAlarm(params)
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

  //校验手机号码
  checkTel = (rule, value, callback)=>{
    if(value && !(/^1\d{10}$/.test(value))){
      callback('请输入正确的联系电话')
    }else{
      callback();
    }
  };

  checkAmount = (rule, value, callback)=>{
    if(value && !(/^\d{1,6}$/.test(value))){
      callback('请输入正确的预警金额')
    }else{
      callback();
    }
  };



  componentDidMount(){
    // let userInfo = this.props.userInfo && this.props.userInfo.data && this.props.userInfo.data.data
    // if(userInfo){
    //   this.setState({userInfo: userInfo})
    // }else{
    //   this.props.fetchData({funcName:'userInfo',stateName: 'userInfo'})
    // }
    //
    // if(this.props.alarmRecord){
    //   let {alarmAmount,alarmPhone, alarmPhoneBak, alarmEmail, alarmType} = this.props.alarmRecord
    //   this.props.form.setFieldsValue({
    //     alarmAmount: alarmAmount && alarmAmount.toString(),
    //     alarmPhone: alarmPhone,
    //     alarmPhoneBak: alarmPhoneBak,
    //     alarmEmail: alarmEmail,
    //     alarmType: alarmType === 1? '开启':'关闭'
    // });
    // }
  }

  componentWillReceiveProps(nextProps) {
    let userInfo = nextProps.userInfo && nextProps.userInfo.data && nextProps.userInfo.data.data || {}
    this.setState({ userInfo: userInfo})
  }

  render() {
    const { getFieldDecorator} = this.props.form;
    const { userInfo} = this.state

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };



    return (
        <Modal title="预警设置"
               visible={this.state.visible}
               onCancel={this.handleCancel}
               onOk={this.handleOk}
        >
          <Form>
            <FormItem
                {...formItemLayout}
                label="预警状态"
                style={{marginBottom: 10}}
            >
              {getFieldDecorator('alarmType', {
                rules: [{ required: true, message: '请选择预警状态', whitespace: true }],
              })(
                  <Select  dropdownMatchSelectWidth={false} allowClear={true} placeholder="请选择预警状态">
                    {alarmType.map((item,index)=>
                        <Option value={item.name} key={index}>{item.name}</Option>
                    )}
                  </Select>
              )}
            </FormItem>

            <FormItem
                {...formItemLayout}
                label="预警金额"
                style={{marginBottom: 10}}
            >
              {getFieldDecorator('alarmAmount', {
                rules: [ { required: true, message: '请输入预警金额'}, {
                  validator: this.checkAmount,
                }],
                validateTrigger:'onBlur'
              })(
                  <Input placeholder="请输入预警金额" />
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="预警手机"
                style={{marginBottom: 10}}
            >
              {getFieldDecorator('alarmPhone', {
                rules: [ { required: true, message: '请输入预警手机号'}, {
                  validator: this.checkTel,
                }],
                validateTrigger:'onBlur'

              })(
                  <Input placeholder="预警手机号一" />
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="预警手机"
                style={{marginBottom: 10}}
            >
              {getFieldDecorator('alarmPhoneBak', {
                rules: [{
                  validator: this.checkTel,
                }],
                validateTrigger:'onBlur'
              })(
                  <Input placeholder="预警手机号二" />
              )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="预警邮箱"
                style={{marginBottom: 10}}
            >
              {getFieldDecorator('alarmEmail', {
                rules: [{
                  type: 'email', message: '请输入合理的预警邮箱地址',
                }]
              })(
                  <Input placeholder="请输入预警邮箱" />
              )}
            </FormItem>
          </Form>
        </Modal>
    );
  }
}

const alarmType = [
  {key:'0',name:'关闭'},
  {key:'1',name:'开启'},
]


const mapStateToProps = state => {
  const {  userInfo = {data: {}}} = state.httpData;
  return { userInfo};
};


const mapDispatchToProps = dispatch => ({
  fetchData: bindActionCreators(fetchData, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(SetAlarm))


