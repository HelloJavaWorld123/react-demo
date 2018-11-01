
import React from 'react';
import { Row, Col,Card, Button, Icon, Divider, Message, Form, Select, Input, Table, DatePicker} from 'antd';
import {fetch} from '../../api/tools'



const FormItem = Form.Item;
const Option = Select.Option;





class Prepayment extends React.Component {
  state = {
    activeIndex: 0,
    list:[],
    total:0,
    current: 1,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let beginTime = values.beginTime && values.beginTime.format('YYYY-MM-DD')||''
        let endTime = values.endTime && values.endTime.format('YYYY-MM-DD')||''
        let current = 1
        this.setState({list:[],current: current, exId: values.exId, status: values.status,tradeType: values.tradeType,beginTime:beginTime,endTime:endTime},()=>{
          this.fetchList(current,values.exId,values.status,values.tradeType,beginTime,endTime)
        })
      }
    });
  };

  onChange = (value) =>{
    // console.log(value);
  }

  componentDidMount(){
   this.fetchList(1)

  }

  fetchList = (current,exId='',status='',tradeType='',beginTime='',endTime='', shopServiceId=this.props.shopServiceId) => {
    fetch('get',`/usercenter/transaction/advance-charge-trans-detail-list?current=${current}&exId=${exId}&status=${status}&tradeType=${tradeType}&beginTime=${beginTime}&endTime=${endTime}&shopServiceId=${shopServiceId}`).then(res=>{
      if(res.code == 0){
        let list = res.data.records
        // list = this.state.list.concat(list);
        list.forEach((item,index)=>{
          let tradeType = item.tradeType;
          let status = item.status
          item.number = (current-1)*10 + index+1;
          switch (tradeType){
            case 'ALL':
              item.tradeType = '所有交易'
              break
            case 'REVERSE':
              item.tradeType = '冲正';
              break
            case 'WITHDRAW':
              item.tradeType = '线下提现';
              break
            case 'RECHARGE':
              item.tradeType = '线下充值';
              break
            case 'RECHARGE_OL':
              item.tradeType = '在线充值';
              break
            case 'UNFREEZE':
              item.tradeType = '解冻';
              break
            case 'FREEZE':
              item.tradeType = '冻结';
              break
            case 'REFUND':
              item.tradeType = '退款';
              break
            case 'TRANSFER':
              item.tradeType = '转账';
              break
            case 'ESTABLISH':
              item.tradeType = '开户';
              break
          }
          switch (status){
            case 0:
              item.status = '取消'
              break
            case 1:
              item.status = '正常';
              break
            case 2:
              item.status = '部分取消';
          }
        })
        this.setState({list: list, total: res.data.total, current: current})
      }else{
        Message.destroy()
        Message.error(res.msg)
      }
    })
  }

  fetchMore = (page,pageSize) =>{
    this.fetchList(page.current, this.state.exId,this.state.status,this.state.tradeType,this.state.beginTime,this.state.endTime)
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { list , total, current} = this.state
    return (

        <div>
          <Form layout="inline" onSubmit={this.handleSubmit} >
            <FormItem>
              {getFieldDecorator('exId', {
                rules: [],
              })(
                  <Input style={{width: '150px'}} placeholder="请输入订单号" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('tradeType', {
                rules: [],
              })(
                  <Select  dropdownMatchSelectWidth={false} allowClear={true} placeholder="请选择交易类型">
                    {dealType.map((item,index)=>
                        <Option value={item.key} key={index}>{item.name}</Option>
                    )}
                  </Select>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('status', {
                rules: [],
              })(
                  <Select  dropdownMatchSelectWidth={false} allowClear={true} placeholder="请选择状态">
                    {orderType.map((item,index)=>
                        <Option value={item.key} key={index}>{item.name}</Option>
                    )}
                  </Select>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('beginTime', {
                rules: [],
              })(
                  <DatePicker placeholder={'请选择起始日期'}/>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('endTime', {
                rules: [],
              })(
                  <DatePicker placeholder={'请选择结束日期'}/>
              )}
            </FormItem>
            <FormItem>
              <Button
                  type="primary"
                  htmlType="submit"
              >
                查询
              </Button>
            </FormItem>
            {/*<FormItem>*/}
              {/*<Button type="primary">导出</Button>*/}
            {/*</FormItem>*/}
          </Form>
          <Table className='mt15'  columns={columns} dataSource={list} pagination={{total: total, current: current}} onChange={(page,pageSize)=>{this.fetchMore(page,pageSize)}}/>
        </div>
    );
  }
}

const columns = [{
  title: '序号',
  dataIndex: 'number',
  key: 'number',
}, {
  title: '交易流水 ',
  dataIndex: 'walletId',
  key: 'walletId',
}, {
  title: '订单号',
  dataIndex: 'exId',
  key: 'exId',
}, {
  title: '交易类型',
  dataIndex: 'tradeType',
  key: 'tradeType',
},{
  title: '初始金额',
  dataIndex: 'primevalAmount',
  key: '1',
},{
  title: '变动金额',
  dataIndex: 'variationAmount',
  key: '2',
},{
  title: ' 余额',
  dataIndex: 'balance',
  key: '3',
},{
  title: '状态',
  dataIndex: 'status',
  key: '4',
},{
  title: '创建时间',
  dataIndex: 'createTime',
  key: '5',
},{
  title: ' 备注',
  dataIndex: 'remark',
  key: '6',
},];

const dealType = [
  {key:'ALL',name:'所有交易'},
  {key:'ESTABLISH',name:'开户'},
  {key:'TRANSFER',name:'转账'},
  {key:'FREEZE',name:'冻结'},
  {key:'UNFREEZE',name:'解冻'},
  {key:'RECHARGE_OL',name:'在线充值'},
  {key:'RECHARGE',name:'线下充值'},
  {key:'WITHDRAW',name:'线下提现'},
  {key:'REVERSE',name:'冲正'},
];

const orderType = [
  {key:1,name:'正常'},
  {key:0,name:'取消'},
  {key:2,name:'部分取消'},
]





export default Form.create()(Prepayment);