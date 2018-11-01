
import React from 'react';
import { Row, Col,Card, Button, Icon,  Divider, Message, Tabs, Table} from 'antd';
import {fetch} from '../../api/tools'

const TabPane = Tabs.TabPane;







class Exchange extends React.Component {
  state={
    consumeList:[],
    consumeTotal: 0,
    rechargeList:[],
    rechargeTotal:0
  }

  componentDidMount(){
    this.fetchConsume(1)
    this.fetchRecharge(1)
  }

  fetchConsume = (current) => {
    fetch('get',`/usercenter/transaction/consume-record-list?current=${current}&size=10`).then(res=>{
      if(res.code  == 0){
        let consumeList = res.data.records
        // consumeList = this.state.consumeList.concat(consumeList);
        consumeList.forEach((item,index)=>{
          // let { payChannel } = item;
          item.number = (current-1)*10 + index+1;
          // switch (payChannel) {
          //   case '0':
          //     item.payTypeName = '未支付'
          //     break
          //   case '29':
          //     item.payTypeName = '支付宝支付'
          //     break
          //   case '76':
          //     item.payTypeName = '钱包支付'
          //     break
          // }
        })
        this.setState({consumeList: consumeList, consumeTotal: res.data.total,consumeCurrent:current})
      }else{
        Message.destroy()
        Message.error(res.msg)
      }
    })
  }

  fetchMore = (page,pageSize) =>{
    this.fetchConsume(page.current)
  }

  fetchRecharge = (current) => {
    fetch('get',`/usercenter/transaction/recharge-record-list?current=${current}&size=10`).then(res=>{
      if(res.code  == 0){
        let rechargeList = res.data.records
        // rechargeList = this.state.rechargeList.concat(rechargeList);
        rechargeList.forEach((item,index)=>{
          // let { payChannel } = item;
          item.number = (current-1)*10+index+1;
          // switch (payChannel) {
          //   case '0':
          //     item.payTypeName = '未支付'
          //     break
          //   case '29':
          //     item.payTypeName = '支付宝支付'
          //     break
          //   case '76':
          //     item.payTypeName = '钱包支付'
          //     break
          // }
        })
        this.setState({rechargeList: rechargeList, rechargeTotal: res.data.total,rechargeCurrent:current})
      }else{
        Message.destroy()
        Message.error(res.msg)
      }
    })
  }

  fetchMoreRecharge = (page,pageSize) =>{
    this.fetchRecharge(page.current)
  }


  render() {
    const {consumeList, consumeTotal, consumeCurrent,rechargeList,rechargeTotal, rechargeCurrent} = this.state
    return (
        <div className="gutter-example">
          <Card>
            <Tabs>
              <TabPane tab="消费记录" key="1">
                <Table
                    columns={columns1}
                    dataSource={consumeList}
                    pagination={{total: consumeTotal, current: consumeCurrent}}
                    onChange={(page,pageSize)=>{this.fetchMore(page,pageSize)}}
                />
              </TabPane>
              <TabPane tab="充值记录" key="2">
                <Table
                    columns={columns2}
                    dataSource={rechargeList}
                    pagination={{total: rechargeTotal, current: rechargeCurrent}}
                    onChange={(page,pageSize)=>{this.fetchMoreRecharge(page,pageSize)}}
                />
              </TabPane>
            </Tabs>
          </Card>
        </div>
    );
  }
}

const columns1= [
  { title: '序号', width: 60, dataIndex: 'number', key: 'number' },
  { title: '时间 ', width: 150, dataIndex: 'createTime', key: 'createTime' },
  { title: '订单号', dataIndex: 'orderId', key: '1' },
  { title: '类型', dataIndex: 'orderType', key: '2' },
  { title: '支付方式', dataIndex: 'payChannel', key: '3' },
  { title: '消费金额', dataIndex: 'payAmount', key: '4' },
  { title: '状态', dataIndex: 'orderStatus', key: '5' },
  { title: '备注', dataIndex: 'remarks', key: '6' },
];


const columns2= [
  { title: '序号', width: 60, dataIndex: 'number', key: 'number' },
  { title: '时间 ', width: 150, dataIndex: 'createTime', key: 'createTime' },
  { title: '充值余额', dataIndex: 'payAmount', key: '1' },
  { title: '充值类型 ', dataIndex: 'orderType', key: '2' },
  { title: '支付方式', dataIndex: 'payChannel', key: '3' },
  { title: '交易流水', dataIndex: 'payTransactionID', key: '4' },
  { title: '状态', dataIndex: 'orderStatus', key: '5' },
  { title: '备注', dataIndex: 'remarks', key: '6' },
];

const data2 = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York Park',
}, {
  key: '2',
  name: 'Jim Green',
  age: 40,
  address: 'London Park',
}];



export default Exchange;