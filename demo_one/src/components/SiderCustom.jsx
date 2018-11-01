/**
 * Created by hao.cheng on 2017/4/13.
 */
import React, { Component } from 'react';
import { Layout } from 'antd';
import { withRouter } from 'react-router-dom';
import {menu} from '../constants/menus';
import SiderMenu from './SiderMenu';
import logo from '@/style/imgs/logo.png';
import * as config from '../api/config';



const { Sider } = Layout;

class SiderCustom extends Component {
    state = {
        collapsed: false,
        mode: 'inline',
        selectedKey: '',
        firstHide: true,        // 点击收缩菜单，第一次隐藏展开子菜单，openMenu时恢复
        openKey: ['/app/account','/app/system']  //默认展开的menu
    };

    componentDidMount() {
        this.setMenuOpen(this.props)
        this.setState({menu: menu})
    }

    componentWillReceiveProps(nextProps) {
        this.onCollapse(nextProps.collapsed);
        this.setMenuOpen(nextProps)
    }

    setMenuOpen = props => {
        const { pathname } = props.location;
        let openKey = this.state.openKey
        openKey.push(pathname.substr(0, pathname.lastIndexOf('/')))
        openKey = Array.from(new Set(openKey));
        this.setState({
            openKey: openKey,
            selectedKey: pathname
        });
    };

    onCollapse = (collapsed) => {
        this.setState({
            collapsed,
            firstHide: collapsed,
            mode: collapsed ? 'vertical' : 'inline',
        });
    };

    menuClick = e => {
        this.setState({
            selectedKey: e.key
        });
        const { popoverHide } = this.props;     // 响应式布局控制小屏幕点击菜单时隐藏菜单操作
        popoverHide && popoverHide();
    };

    openMenu = v => {
        this.setState({
            openKey: v,
            firstHide: false,
        })
    };

    render() {
        return (
            <Sider
                trigger={null}
                breakpoint="lg"
                collapsed={this.props.collapsed}
                style={{ overflowY: 'auto' }}
            >
                {/*<div className="logo" />*/}
                <div className="sidebar-title" onClick={()=>window.location.href=`${config.BASE_PATH}home`}>
                  {/*{!this.state.collapsed?'合作商管理平台':'合作商'}*/}
                  <img src={logo} alt="" style={{height: 30, marginLeft: '-30px'}}/>
                </div>
                <SiderMenu
                    menus={this.state.menu}
                    onClick={this.menuClick}
                    theme="light"
                    mode="inline"
                    selectedKeys={[this.state.selectedKey]}
                    openKeys={this.state.openKey}
                    onOpenChange={this.openMenu}
                />
                <style>
                    {`
                    #nprogress .spinner{
                        left: ${this.state.collapsed ? '70px' : '206px'};
                        right: 0 !important;
                    }
                    `}
                </style>
            </Sider>
        )
    }
}

export default withRouter(SiderCustom);