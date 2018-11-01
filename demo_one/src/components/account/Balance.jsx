
import React from 'react';
import { Row, Col,Card, Button, Icon,  Divider, Message, Table, Tabs, Form, Input, Modal, Switch} from 'antd';
import {fetch} from '../../api/tools'
import { receiveData, fetchData } from '@/action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import  ChangePwd  from './ChangePayPwd'
import  SetAlarm  from './SetAlarm'

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;


class Balance extends React.Component {

  state={
    activeIndex: 0,
    usersWallet:{},
    accountDetail:[],
    userInfo:{},
    countTime: 60,
    isShowChangePwd: false,
    isShowSetAlarm: false,
    balance: 0,
    frozenAmount: 0
  }

  handleTab=(index)=>{
    this.setState({activeIndex: index})
  }

  handleAlarm = (status,record)=>{
    this.setState({isShowSetAlarm: true, alarmRecord: record, alarmStatus:status});
    // record.alarmType = status?1:0
    // fetch('put','/usercenter/useSub/alarm-set-up',record).then(res=>{
    //   if(res.code == 0){
    //     this.fetchAccountDetail()
    //   } else {
    //     Message.error(res.msg)
    //   }
    // })
  }

  postAlarm = (params) =>{
    fetch('put','/usercenter/useSub/alarm-set-up',params).then(res=>{
      if(res.code == 0){
        this.fetchAccountDetail()
        this.setState({isShowSetAlarm: false})
        Message.destroy()
        Message.success('设置成功')
      } else {
        Message.destroy()
        Message.error(res.msg)
      }
    })
  }

  handleSubmitPay = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if(this.state.isFetchData) return;
        this.setState({isFetchData: true});
        fetch('get',`/shop/api/shop/order/recharge?money=${values.money}&payType=29`).then(res=>{
          setTimeout(()=>{this.setState({isFetchData: false})},1000)
          if(res.code == 0){
            window.location.href = res.data.result.paySign
          }else{
            Message.destroy()
            Message.error(res.msg)
          }
        })
      }
    });
  };

  handleSubmitTransfer = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let params = {
          accountName: values.accountName,
          payAccount: values.payAccount,
          rechargeMoney: values.rechargeMoney,
          telephone: values.telephone,
        }
        fetch('post','/usercenter/recharge-apply/save',params).then(res=>{
          if(res.code == 0) {
            Message.destroy()
            Message.success('充值申请已提交，需管理员审核，请耐心等待')
            this.props.form.resetFields();
          }else{
            Message.destroy()
            Message.error(res.msg)
          }
        })
      }
    });
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

  //获取短信验证码
  sendMsgCode = () =>{
    if(this.props.form.getFieldValue('phone')){
      fetch('get',`/admin/userRegister/regCode?phone=${this.props.form.getFieldValue('phone')}`).then(res=>{
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




  componentDidMount(){
    // let userInfo = this.props.userInfo && this.props.userInfo.data && this.props.userInfo.data.data
    // if(userInfo){
    //   this.setState({userInfo: userInfo})
    // }else{
    //   this.props.fetchData({funcName:'userInfo',stateName: 'userInfo'})
    // }
    // let usersWallet = this.props.usersWallet && this.props.usersWallet.data && this.props.usersWallet.data.data
    // if(usersWallet){
    //   this.setState({usersWallet: usersWallet})
    // } else{
    //   this.props.fetchData({funcName:'usersWallet',stateName: 'usersWallet'})
    // }
    // this.fetchAccountDetail()
  }

  fetchAccountDetail(){
    // fetch('get','/usercenter/useSub/account-detail-list').then(res=>{
    //   if(res.code == 0){
    //     let accountDetail = res.data
    //     let balance = 0
    //     let frozenAmount = 0
    //     accountDetail.forEach((item)=>{
    //       balance = this.accAdd(balance,item.balance);
    //       frozenAmount = this.accAdd(frozenAmount, item.frozenAmount);
    //       let purpose = item.purpose
    //       switch (purpose){
    //         case 0:
    //           item.purposeName = '账户余额'
    //           break
    //         case 1:
    //           item.purposeName = '服务预付款';
    //           break
    //       }
    //     })
    //     this.setState({accountDetail: accountDetail, balance: balance, frozenAmount: frozenAmount})
    //   }
    // })
  }

  accAdd = (arg1,arg2) => {
  var r1,r2,m;
  try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
  try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
  m=Math.pow(10,Math.max(r1,r2));
  return (arg1*m+arg2*m)/m;
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
    if(value && !(/^[.\d]{1,6}$/.test(value))){
      callback('请输入正确的金额')
    }else{
      callback();
    }
  };


  checkCompany = (rule, value, callback)=>{
    if(value && !(/^[\u4e00-\u9fa5]{1,20}$/.test(value))){
      callback('请输入正确的开户名称')
    }else{
      callback();
    }
  };

  checkAccount = (rule, value, callback)=>{
    if(value && !(/^\d{1,20}$/.test(value))){
      callback('请输入正确的转账账号')
    }else{
      callback();
    }
  };

  componentWillReceiveProps(nextProps) {
    let userInfo = nextProps.userInfo && nextProps.userInfo.data && nextProps.userInfo.data.data || {}
    let usersWallet = nextProps.usersWallet && nextProps.usersWallet.data && nextProps.usersWallet.data.data || {}
    this.setState({usersWallet: usersWallet, userInfo: userInfo})
  }

  render() {
    const { getFieldDecorator} = this.props.form;
    const {usersWallet, userInfo, balance, frozenAmount} = this.state

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
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };

    let columns = [
      { title: '用途', width: 100, dataIndex: 'purposeName', key: 'purposeName' },
      { title: '服务名称 ', width: 100, dataIndex: 'serviceName', key: 'serviceName' },
      { title: '余额(元)', dataIndex: 'balance', key: '1' },
      { title: '冻结金额(元) ', dataIndex: 'frozenAmount', key: '2' },
      { title: '预警金额(元)', dataIndex: 'alarmAmount', key: '3' },
      { title: '手机号码', dataIndex: 'alarmPhone', key: '4' },
      { title: '预警邮箱', dataIndex: 'alarmEmail', key: '5' },
      { title: '余额预警', dataIndex: '', key: '6',
        render: (record) =>
            <div>
              <Switch checked={record.alarmType == 1} onChange={(status)=>{this.handleAlarm(status,record)}}></Switch>
            </div>
      },
    ];

    return (
        <div className="gutter-example">
          <Card title="账户概览" bordered = {false}>
            <Row >
              <Col span={24} className='c-default-bg' style={{padding: '0 0 0 15px'}}>
                  <Col span={6}>
                    <p>总余额(元)</p>
                    <p className="f18">{balance}</p>
                  </Col>
                  <Col span={6}>
                    <p>总冻结(元)</p>
                    <p className="f18">{frozenAmount}</p>
                  </Col>
                <Col span={12}>
                  <Row type='flex' align='top'>
                    <p className="inline-block"><Icon type={'exclamation-circle-o'} style={{fontSize: 12}} /></p>
                    <p className="ml5 inline-block">总余额=账户余额 + 各服务预付款余额<br/>
                      总冻结=账户冻结金额 + 各服务冻结金额。
                    </p>
                  </Row>
                </Col>
              </Col>
              {/*<Col span={9} offset={1} className='c-default-bg' style={{padding: '0 0 0 20px'}}>*/}
                {/*<Row type="flex" justify="start" align='middle'>*/}
                  {/*<div>*/}
                    {/*<p>支付密码 <Icon type={'eye-o'} style={{fontSize: 12}}/></p>*/}
                    {/*<p className="f18">******</p>*/}
                  {/*</div>*/}
                  {/*<Button type="primary" style={{marginLeft: '40px'}} onClick={()=>{this.setState({isShowChangePwd: true})}}>更改/设置</Button>*/}
                {/*</Row>*/}
              {/*</Col>*/}
            </Row>
          </Card>
          <Card title="账户明细" bordered = {false}>
            <Table className='mt15'  columns={columns} dataSource={this.state.accountDetail} />
          </Card>
          <Card title="账户充值" extra={<div className="detail-tabs" style={{width: 150, position: 'absolute', left: 105, top: 10}}>
            {['在线充值','银行卡转账'].map((item,index)=>
                <span
                    key={index}
                    onClick={()=>this.handleTab(index)}
                    className={this.state.activeIndex == index?'activeTab':''}
                    style={{width: '50%'}}
                >
                    {item}
                  </span>
            )}
          </div>} bordered = {false} style={{marginTop:'-30'}}>

            {/*<Divider></Divider>*/}
            {this.state.activeIndex == 0 &&
            <Form layout="inline" onSubmit={this.handleSubmitPay}>
              <FormItem
                  label="充值金额"
              >
                {getFieldDecorator('money', {
                  rules: [{ required: true, message: '请输入充值金额'},{
                    validator: this.checkAmount,
                  }],
                  validateTrigger:'onBlur'
                })(
                    <div>
                      <Input style={{width: '300px'}} placeholder="请输入充值金额"/>
                      <span style={{marginLeft: 5}}>元</span>
                    </div>
                )}
              </FormItem>
              <Row type="flex" align='middle' className='mt15'>
                <span style={{color:'rgba(0, 0, 0, 0.85)'}}>&nbsp;&nbsp;支付方式:</span>
                <div className="center" style={{color: '#018bde', marginLeft:10, border: '1px solid #018bde', borderRadius: 3,padding: '5px 30px'}}>
                  <img style={{width: 28,marginRight: 10}} src="https://ossweb.cx580.com/cxypay/images/pay_alipay.png" alt=""/>
                  <p style={{margin: 0}}><span style={{fontSize: 12, fontWeight: 500}}>支付宝</span><br/>ALIPAY</p>
                </div>
              </Row>
              <FormItem style={{marginLeft: 62}}  className='mt15'>
                <Button
                    type="primary"
                    htmlType="submit"
                    style={{width: 140}}
                >
                  去支付
                </Button>
              </FormItem>
              </Form>}
            {this.state.activeIndex == 1 &&
                <Row>
                  <Col span={12} style={{borderRight: '1px dashed #e8e8e8'}}>
                    <p><span style={{marginRight: 15}}>第一步</span>请您通过网银转账，或者自行到银行进行汇款，汇款账号如下：</p>
                    <div className="balance-list" style={{marginLeft: 50}}>
                      <p><span>开户名称</span> 广州时光大数据科技有限公司</p>
                      <p><span>开户银行</span> 中国招商银行</p>
                      <p><span>开户支行</span> 招商银行广州科技园支行</p>
                      <p><span>账号</span> 1209 1373 2610 101</p>
                    </div>
                    <div style={{marginLeft: 50, marginTop: 15}}>
                      <p style={{fontWeight: 900}}>温馨提示：</p>
                      <p>1、受银行处理时间影响，采用线下汇款方式到账会有延迟。</p>
                      <p>2、具体到账时间以银行的实际到账时间为准。</p>
                      <p>3、财务确认收到款后直接匹配到您的车行易数据平台账户上。</p>
                    </div>
                  </Col>
                  <Col span={12} style={{paddingLeft: 30}}>
                    <p><span style={{marginRight: 15}}>第二步</span>转账后填写转账记录，财务确认后充值成功</p>
                    <Form onSubmit={this.handleSubmitTransfer}>
                      <FormItem
                          label="转账金额"
                          {...formItemLayout}
                          style={{marginBottom: 10}}
                      >
                        {getFieldDecorator('rechargeMoney', {
                          rules: [{ required: true, message: '请输入转账金额'},{
                            validator: this.checkAmount,
                          }],
                          validateTrigger:'onBlur'
                        })(
                              <Input placeholder="请输入转账金额" />
                        )}
                      </FormItem>
                      <FormItem
                          {...formItemLayout}
                          label="开户名称"
                          style={{marginBottom: 10}}
                      >
                        {getFieldDecorator('accountName', {
                          rules: [{ required: true, message: '请输入开户名称'},{validator: this.checkCompany,}],
                          validateTrigger:'onBlur'
                        })(

                            <Input placeholder="请输入开户名称"  />
                        )}
                      </FormItem>
                      <FormItem
                          {...formItemLayout}
                          label="转账账号"
                          style={{marginBottom: 10}}
                      >
                        {getFieldDecorator('payAccount', {
                          rules: [{ required: true, message: '请输入转账时的账号'},{
                            validator: this.checkAccount,
                          }],
                          validateTrigger:'onBlur'
                        })(

                            <Input placeholder="请输入转账时的账号"  />
                        )}
                      </FormItem>
                      <FormItem
                          label="手机号码"
                          {...formItemLayout}
                          style={{marginBottom: 10}}
                      >
                        {getFieldDecorator('telephone', {
                          rules: [{ required: true, message: '请输入手机号码'}, {
                            validator: this.checkTel,
                          }],
                          validateTrigger:'onBlur'
                        })(

                            <Input placeholder="请输入手机号码"  />
                        )}
                      </FormItem>
                      <FormItem {...tailFormItemLayout}>
                        <Button style={{width: 150}} type="primary" htmlType="submit">提交</Button>
                        {/*<p>两笔转账待确认</p>*/}
                      </FormItem>
                    </Form>
                  </Col>

                </Row>
            }
          </Card>
          {/*{this.state.isShowChangePwd && <ChangePwd  close={()=>{this.setState({isShowChangePwd: false})}}/>}*/}
          {this.state.isShowSetAlarm &&
          <SetAlarm
              close={()=>{this.setState({isShowSetAlarm: false})}}
              alarmRecord={this.state.alarmRecord}
              alarmStatus={this.state.alarmStatus}
              postAlarm={this.postAlarm}
          />}
        </div>
    );
  }
}




const mapStateToProps = state => {
  const { usersWallet = {data: {}} , userInfo = {data: {}}} = state.httpData;
  return {usersWallet, userInfo};
};


const mapDispatchToProps = dispatch => ({
  fetchData: bindActionCreators(fetchData, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Balance))


