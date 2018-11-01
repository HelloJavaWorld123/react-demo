
import React from 'react';
import { Row, Col,Card, Button, Icon, Modal, Message} from 'antd';
import BasicTable from './Table'
import {fetch} from '../../api/tools'
import { receiveData, fetchData } from '@/action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as config from '../../api/config';




class Home extends React.Component {
  state = {
    visible: false,
    newsInfo:[],
    userInfo:{},
    modalContent: {},
    usersWallet:{}
  };

  showModal = (item) => {
    this.setState({
      visible: true,
      modalContent: item
    });
    let params = {
      id: item.id,
      status: 1,
    }
    // fetch('put','/usercenter/messages/update',params).then(res=>{
    //   if(res.code == 0){
    //     this.fetchNews()
    //     this.props.fetchData({funcName:'unreadNews',stateName: 'unreadNewsNum'})
    //   }else{
    //     Message.error(res.msg)
    //   }
    // })
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  goDetail = (record) =>{
    // let detailName = record.serviceName + record.accessType
    let detailName = record.serviceName
    localStorage.setItem('serviceName', detailName)
    this.props.history.push(`/app/service/detail/${record.appKey}`)
  }

  componentDidMount(){
    // this.fetchNews()
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
  }

  fetchNews = () => {
    // fetch('get','/usercenter/messages/list?current=1&size=2').then(res=>{
    //   if(res.code == 0){
    //     this.setState({newsInfo: res.data.records,})
    //   }else{
    //     Message.error(res.msg)
    //   }
    // })
  }

  componentWillReceiveProps(nextProps) {
    let usersWallet = nextProps.usersWallet && nextProps.usersWallet.data && nextProps.usersWallet.data.data || {}
    let userInfo = nextProps.userInfo && nextProps.userInfo.data && nextProps.userInfo.data.data||{}
    this.setState({usersWallet: usersWallet, userInfo: userInfo})
  }

  toNewService(){
    window.location.href = `${config.BASE_PATH}serviceList`
  }


  render() {
    let { newsInfo, modalContent, userInfo, usersWallet } = this.state
    return (
          <div className="gutter-example">
            <Row type="flex" justify="start">
                <Card style={{ width: 420 ,marginRight: 20}}>
                  <p>{userInfo.accountLevel}</p>
                  <p>欢迎，{userInfo.nickName || userInfo.username} <a onClick={()=>this.props.history.push('/app/system/authentication')}>{userInfo.certifiedStatus}</a></p>
                  <p>上次登录时间：{userInfo.lastLoginTime}</p>
                  <Button type='primary' onClick={()=>this.props.history.push('/app/system/setAccount')}>账号设置</Button>
                </Card>
              <Card style={{ width: 420 }}>
                <p>账户余额</p>
                <p className="f18">￥<span className="f36">{usersWallet.balance}</span></p>
                <Button type='primary' onClick={()=>this.props.history.push('/app/account/balance')}>去充值</Button>
              </Card>
            </Row>
            {newsInfo.length>0 && <div style={{background:'white', width:'100%',marginTop: 15, marginBottom: 15, padding: 10}}>
              <Row type="flex" justify="space-between" align='middle'>
                <div>
                  {newsInfo.map((item,index)=>
                    <p className={'y-center'} onClick={()=>this.showModal(item)} key={index}>
                      {item.type == 1 && '【系统消息】'}
                      {item.type == 0 && '【后台消息】'}
                      <span className={item.status==0?'c-blue col-content':'col-content'}>{item.content}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{item.createTime}
                    </p>
                  )}
                </div>
                <Button type='primary' onClick={()=>this.props.history.push('/app/system/news')}>查看全部</Button>
              </Row>
            </div>}
            <Row gutter={16}>
              <Col className="gutter-row" md={24}>
                <div className="gutter-box">
                  <Card title="我的数据" bordered={false}>
                    <BasicTable  type={1} goDetail={this.goDetail}/>
                  </Card>
                </div>
              </Col>
            </Row>
            <Button type='primary' style={{marginTop: 15,width: '100%', height: 42}} onClick={this.toNewService}>
              <Icon type='plus' style={{fontSize: 13}} />申请数据服务
            </Button>
            <Modal title="消息详情"
                   visible={this.state.visible}
                   onCancel={this.handleCancel}
                   footer={false}
            >
              <p style={{fontSize: '13px',marginLeft:'-5'}}>{modalContent.type == 1 &&'【系统消息】'}{modalContent.type == 0 &&'【后台消息】'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{modalContent.createTime}</p>
              <p style={{color: '#ababab'}}>{modalContent.content}</p>
              <div className="modal-footer-btn">
                <Button type='primary' onClick={this.handleCancel}>我知道了</Button>
              </div>
            </Modal>
          </div>
    );
  }
}



const mapStateToProps = state => {
  const { usersWallet = {data: {}} , userInfo = {data: {}} } = state.httpData;
  return {usersWallet, userInfo};
};


const mapDispatchToProps = dispatch => ({
  fetchData: bindActionCreators(fetchData, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home)