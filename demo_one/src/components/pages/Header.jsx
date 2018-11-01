
import React from 'react';
import { Row, Col,Card, Button, Icon, Modal, Message} from 'antd';
import logoBLue from '@/style/imgs/logoBLue.png';
import * as config from '../../api/config';




class Header extends React.Component {


  render() {
    return (
        <div className="pageHeader">
          <div><img src={logoBLue} style={{height: '.37rem'}} alt=""/></div>
          <div className="cursor-p" onClick={()=>window.location.href=`${config.BASE_PATH}home`}>首页</div>
        </div>
    );
  }
}


export default Header