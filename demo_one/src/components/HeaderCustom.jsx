/**
 * Created by hao.cheng on 2017/4/13.
 */
import React, { Component } from 'react';
import { Menu, Icon, Layout, Popover, Badge } from 'antd';
import screenfull from 'screenfull';
import { gitOauthToken, gitOauthInfo } from '../api';
import { queryString } from '../utils';
import SiderCustom from './SiderCustom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { createAxiosInstance} from '../api/tools';


import {fetch} from '../api/tools'
import {loginOut} from '../api/index'
import { receiveData, fetchData, clearData } from '@/action';

const { Header } = Layout;

class HeaderCustom extends Component {
    state = {
        user: '',
        visible: true,
      unreadNewsNum: 0,
      userInfo:{}
    };
    componentDidMount() {
        const QueryString = queryString();
        // if (QueryString.hasOwnProperty('code')) {
        //     console.log(QueryString);
        //     const _user = JSON.parse(localStorage.getItem('user'));
        //     !_user && gitOauthToken(QueryString.code).then(res => {
        //         console.log(res);
        //         gitOauthInfo(res.access_token).then(info => {
        //             this.setState({
        //                 user: info
        //             });
        //             localStorage.setItem('user', JSON.stringify(info));
        //         });
        //     });
        //     _user && this.setState({
        //         user: _user
        //     });
        // }
        const _user = JSON.parse(localStorage.getItem('user')) || '测试';
        if (!_user && QueryString.hasOwnProperty('code')) {
            gitOauthToken(QueryString.code).then(res => {
                gitOauthInfo(res.access_token).then(info => {
                    this.setState({
                        user: info
                    });
                    localStorage.setItem('user', JSON.stringify(info));
                });
            });
        } else {
            this.setState({
                user: _user
            });
        }

    };
    screenFull = () => {
        if (screenfull.enabled) {
            screenfull.request();
        }

    };
    menuClick = e => {
        e.key === 'logout' && this.logout();
        e.key === 'news' && this.props.history.push('/app/system/news')
    };

    logout = () => {
        this.props.clearData()
        let accesstoken = this.getCookie('authorization')
        let params ={
          accesstoken: accesstoken && accesstoken.split('Bearer ')[1],
        }
        loginOut(params)
        window.axiosInstance = createAxiosInstance('');
        // localStorage.removeItem('authorization');
        // localStorage.removeItem('deadline');
        let domain = 'https:' == document.location.protocol? 'tdata580.com' : 'cx580.com';
        let expire_time = new Date()
        expire_time.setTime(expire_time.getTime() - 1000);
        document.cookie = `authorization=''; expires=${expire_time.toGMTString()}; domain=${domain}; path=/`
        this.props.history.push('/login')
    };

    getCookie = (name) => {
      let arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
      if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
      else
        return null;
    };



    popoverHide = () => {
        this.setState({
            visible: false,
        });
    };
    handleVisibleChange = (visible) => {
        this.setState({ visible });
    };



  componentWillReceiveProps(nextProps) {
    // let pathname = nextProps.location && nextProps.location.pathname
    // let unreadNewsNum = nextProps.unreadNewsNum && nextProps.unreadNewsNum.data && nextProps.unreadNewsNum.data.data
    // let userInfo = nextProps.userInfo && nextProps.userInfo.data && nextProps.userInfo.data.data||{}
    // let path = ''
    // if(pathname && pathname.indexOf('/app/service/detail')>-1){
    //   path = '服务详情-'+ localStorage.getItem('serviceName')
    // }
    //
    // this.setState({pathname: path, unreadNewsNum: unreadNewsNum, userInfo: userInfo})
  }

   componentDidMount(){
     // let userInfo = this.props.userInfo && this.props.userInfo.data && this.props.userInfo.data.data
     // if(userInfo){
     //   this.setState({userInfo: userInfo})
     // }else{
     //   this.props.fetchData({funcName:'userInfo',stateName: 'userInfo'})
     // }
     // this.props.fetchData({funcName:'unreadNews',stateName: 'unreadNewsNum'})
   }


    render() {
        const { responsive, path } = this.props;
        const { userInfo } = this.state
        return (
            <Header style={{ background: '#fff', padding: 0, height: 65 }} className="custom-theme" >
                {
                    responsive.data.isMobile &&
                        <Popover content={<SiderCustom path={path} popoverHide={this.popoverHide} />} trigger="click" placement="bottomLeft" visible={this.state.visible} onVisibleChange={this.handleVisibleChange}>
                            <Icon type="bars" className="trigger custom-trigger" />
                        </Popover>

                }
              {/*<div style={{ lineHeight: '64px', display: 'inline',fontSize: '18px', fontWeight: '700' }}>合作商管理系统</div>*/}
              {this.state.pathname && <div className="detail-title">
                {this.state.pathname}
              </div>}
              <Menu
                    mode="horizontal"
                    style={{ lineHeight: '64px', float: 'right' }}
                    onClick={this.menuClick}
                >
                   <span style={{float: 'left'}}>欢迎您！{userInfo.nickName||userInfo.username}</span>
                   {/*<Menu.Item>*/}
                    {/**/}
                   {/*</Menu.Item>*/}
                    <Menu.Item key="news">
                      {this.state.unreadNewsNum >0 && <Badge count={this.state.unreadNewsNum} overflowCount={this.state.unreadNewsNum} style={{marginLeft: 10}} >
                        <i className="iconfont icon-xiaoxi004" style={{fontSize: '.2rem'}}></i>
                      </Badge>}
                      {this.state.unreadNewsNum == 0 &&
                        <i className="iconfont icon-xiaoxi004"></i>
                      }
                    </Menu.Item>
                    <Menu.Item key="logout">
                      <span>退出登录</span>
                    </Menu.Item>
                </Menu>
                <style>{`
                    .ant-menu-submenu-horizontal > .ant-menu {
                        width: 120px;
                        left: -40px;
                    }
                `}</style>
            </Header>
        )
    }
}

const mapStateToProps = state => {
    const { responsive = {data: {}} ,unreadNewsNum = {data: {}}, userInfo = {data: {}}} = state.httpData;
    return {responsive, unreadNewsNum, userInfo};
};


const mapDispatchToProps = dispatch => ({
  fetchData: bindActionCreators(fetchData, dispatch),
  clearData: bindActionCreators(clearData, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderCustom));

