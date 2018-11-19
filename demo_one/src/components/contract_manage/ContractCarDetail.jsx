
import React from 'react';
import { Row,Col,Card, Button,notification,Icon, Divider, Message, Form, Select, Input, Table, DatePicker,Pagination} from 'antd';
import {fetch} from '../../api/tools'
import { receiveData, fetchData } from '@/action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createHashHistory } from 'history';


const history = createHashHistory();

class ContractCarDetail extends React.Component {
  state = {
    activeIndex: 0,
    carInfo:{}
  };



  componentDidMount(){
      const { carNumber} = this.props;
        fetch('get', 'chedui/contract/risk/carDetail/'+carNumber).then(res=>{
            if (res.code === 2000){
                this.setState({carInfo:res.data});
            }
        })
  }

  render() {
    const{ carInfo} = this.state;
    const colorStatus = {
        0:'黑色',
        1:'红色',
        2:'橙色',
        3:'黄色',
        4:'绿色',
        5:'青色',
        6:'蓝色',
        7:'紫色'
    }

    const engineSourceStatus = {
        0:'汽油',
        1:'柴油',
        2:'氢气',
        3:'电'
    }
    console.log(carInfo);
      let carInfos = [
          {line:[{title:'车牌号',value:carInfo.carNumber},{title:'注册地址',value:carInfo.carCompany}]},
          {line:[{title:'业务单位',value:carInfo.goodsSource},{title:'入库时间',value:carInfo.incomingTime}]},
          {line:[{title:'注册时间',value:carInfo.createTime},{title:'车辆种类',value:carInfo.carModelType}]},
          {line:[{title:'车身颜色',value:colorStatus[carInfo.carBodyColor]},{title:'座位数',value:carInfo.siteNum}]},
          {line:[{title:'车引擎号码',value:carInfo.carEngineNumber},{title:'车架号码',value:carInfo.carFrameNumber}]},
          {line:[{title:'能源类型',value:engineSourceStatus[carInfo.engineSource]},{title:'采购时间',value:carInfo.buyTime}]}]
    return (
        <div style={{background: 'white',padding: '26px 16px 16px',margin:'20px 0px',width:'1200px'}}>
            {carInfos.map((item,index)=>
                <Row key={index} style={{padding: '10px'}}>
                    <div>
                        <Col span={12} style={{textAlign: 'left'}}>
                            <span style={{fontSize:'15px',fontWeight: '500'}}>{item.line[0].title+' : '}</span>
                            <span style={{fontSize:'15px'}}>{item.line[0].value}</span>
                        </Col>
                        <Col span={12}>
                            <span style={{fontSize:'15px',fontWeight: '500'}}>{item.line[1].title+' : '}</span>
                            <span style={{fontSize:'15px'}}>{item.line[1].value}</span>
                        </Col>
                    </div>
                </Row>
    )};
        </div>
    )
  }
}
const mapStateToProps = state => {
    const { usersWallet = {data: {}} , userInfo = {data: {}}} = state.httpData;
    return {usersWallet, userInfo};
};


const mapDispatchToProps = dispatch => ({
    fetchData: bindActionCreators(fetchData, dispatch),
});



/*export default Form.create()(ContractCarDetail);*/
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ContractCarDetail))