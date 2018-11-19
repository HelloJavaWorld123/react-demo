
import React from 'react';
import { Row,Col,Card, Button,notification,Icon, Divider, Message, Form, Select, Input, Table, DatePicker,Pagination} from 'antd';
import {fetch} from '../../api/tools'
import { receiveData, fetchData } from '@/action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createHashHistory } from 'history';


const history = createHashHistory();


class ContractPaymentRecordList extends React.Component {
  state = {
    activeIndex: 0,
    data:[]
  };



  componentDidMount(){
        const { contractCode,userName,carNumber} = this.props;
        fetch('get', 'chedui/contract/payment/' + contractCode).then(res=>{
            if (res.code === 2000){
                let data = res.data;
                for(let item of data){
                    item.userName = userName;
                    item.carNumber = carNumber;
                }
                this.setState({data:data})
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

      let statusPayment = {
          0:'未完成',
          1:'已完成'
      }


      const columns = [{
          title: '应收账单号',
          dataIndex: 'accountNo',
          key: 'accountNo',
      }, {
          title: '付款人',
          dataIndex: 'userName',
          key: '2',
      }, {
          title: '类型',
          dataIndex: 'paymentType',
          key: '3',
      }, {
          title: '应收金额(元)',
          dataIndex: 'receivableMoney',
          key: '1',
      }, {
          title: '实收金额(元)',
          dataIndex: 'receivedMoney',
          key: '4',
      },{
          title: '代缴金额(元)',
          dataIndex: 'neededPay',
          key: '5',
      },{
          title: '应收日期',
          dataIndex: 'receivableTime',
          key: '6',
      },{
          title: '账单状态',
          dataIndex: 'paymentStatus',
          key: '7',
      },{
          title: '车牌号',
          dataIndex: 'carNumber',
          key: '8',
      },];
    const{ data} = this.state;
    for(let item of data){
        item.paymentType = paymentTypeStatus[item.paymentType];
        item.paymentStatus = statusPayment[item.paymentStatus];
    }
    return (
        <div style={{background: 'white', padding: '26px 16px 16px'}}>
        <Button type="primary" ghost onClick={()=>{history.push('/app/car/CarIllegalRecord');}}>新增应收账单</Button>
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



/*export default Form.create()(ContractPaymentRecordList);*/
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ContractPaymentRecordList))