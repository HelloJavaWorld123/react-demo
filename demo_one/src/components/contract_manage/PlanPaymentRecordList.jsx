
import React from 'react';
import { Row,Col,Card, Button,notification,Icon, Divider, Message, Form, Select, Input, Table, DatePicker,Pagination} from 'antd';
import {fetch} from '../../api/tools'
import { receiveData, fetchData } from '@/action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createHashHistory } from 'history';


const history = createHashHistory();


class PlanPaymentRecordList extends React.Component {
  state = {
    activeIndex: 0,
    data:[]
  };



  componentDidMount(){
      const { contractCode} = this.props;
        fetch('get', 'chedui/contract/payment/plan/' + contractCode).then(res=>{
            if (res.code === 2000){
                this.setState({data:res.data});
            }
        })
  }

  render() {

      let paymentTypeStatus = {
          0:'首付款',
          1:'押金',
          2:'租金',
          3:'管理费',
          4:'其他'
      }

      let paymentCategoryStatus = {
          0:'月付',
          1:'年付',
          2:'一次性付'
      }

      const columns = [{
          title: '类型',
          dataIndex: 'paymentType',
          key: '1',
      }, {
          title: '金额(元)',
          dataIndex: 'receivableMoney',
          key: '2',
      }, {
          title: '支付类别',
          dataIndex: 'paymentCategory',
          key: '3',
      },{
          title: '开始日期',
          dataIndex: 'receivableTime',
          key: '4',
      }];
    let{ data} = this.state;
    for(let item of data){
        item.paymentType = paymentTypeStatus[item.paymentType];
        item.paymentCategory = paymentCategoryStatus[item.paymentCategory];
    }
    return (
        <div style={{background: 'white', padding: '26px 16px 16px'}}>
        {/*<Button type="primary" ghost onClick={()=>{history.push('/app/car/CarIllegalRecord');}}>新增应收账单</Button>*/}
        <Table className='mt15'  columns={columns} dataSource={data} pagination={false} />
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



/*export default Form.create()(PlanPaymentRecordList);*/
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(PlanPaymentRecordList))