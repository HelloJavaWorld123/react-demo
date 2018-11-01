
import React from 'react';
import { Row, Col,Card, Button, Icon, Divider, Message, Form, Select, Input, Table, DatePicker, Cascader} from 'antd';
import {fetch} from '../../api/tools'
import {provinces, cities} from '../../constants/Area'

const FormItem = Form.Item;
const Option = Select.Option;




const columns = [
  { title: '订单号', width: 100, dataIndex: 'orderId', key: 'orderId', fixed: 'left' },
  { title: '合作商订单号 ', width: 100, dataIndex: 'thirdId', key: 'thirdId', fixed: 'left' },
  { title: '客户名称', dataIndex: 'userName', key: '1' },
  { title: '下单渠道 ', dataIndex: 'payDownChannel', key: '2' },
  { title: '支付时间', dataIndex: 'payDate', key: '3' },
  { title: '支付类型', dataIndex: 'payType', key: '4' },
  { title: '车牌', dataIndex: 'carNumber', key: '5' },
  { title: '违章状态', dataIndex: 'preOrderStatus', key: '6' },
  { title: '违章时间', dataIndex: 'occurTime', key: '7' },
  { title: '违章地点', dataIndex: 'location', key: '8' },
  { title: '违章城市', dataIndex: 'locationName', key: '9' },
  { title: '违章原因', dataIndex: 'reason', key: '10' },
  { title: '扣分', dataIndex: 'degree', key: '11' },
  { title: '罚金', dataIndex: 'fine', key: '12' },
  { title: '代办费', dataIndex: 'poundage', key: '13' },
  { title: '订单金额', dataIndex: 'amount', key: '14' },
  { title: '订单优惠', dataIndex: 'disCount', key: '15' },
  { title: '应付金额', dataIndex: 'customerPay', key: '16' },
  { title: '退款', dataIndex: 'refundMoney', key: '17' },
  { title: '退款时间', dataIndex: 'refundTime', key: '18' },
  { title: '退款说明', dataIndex: 'refundRemark', key: '19' },
  { title: '文书号', dataIndex: 'documentCode', key: '20' },
  { title: '创建时间', dataIndex: 'createDate', key: '21' },
  { title: '订单状态', dataIndex: 'status', key: '22' },
  { title: '违章编号', dataIndex: 'historyID', key: '23' },
  {
    title: '违章代码',
    key: 'operation',
    fixed: 'right',
    width: 100,
  },
];


class OrderChecking extends React.Component {
  state = {
    activeIndex: 0,
    data:[],
    total:0,
    current: 1
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let beginDate = values.beginDate && values.beginDate.format('YYYY-MM-DD')||''
        let endDate = values.endDate && values.endDate.format('YYYY-MM-DD')||''
        this.setState({beginDate: beginDate, endDate: endDate, carNumber: values.carNumber, dateType: values.dateType, orderId: values.orderId, preOrderStatus: values.preOrderStatus})
        this.fetchOrderList(1,beginDate, endDate, values.carNumber, values.dateType, values.orderId, values.preOrderStatus)
      }
    });
  };

  onChange = (value) =>{
    // console.log(value);
  }

  componentDidMount(){
    cities.forEach(city => {
      const matchProvince = provinces.filter(
          province => province.code === city.provinceCode
      )[0];
      if (matchProvince) {
        matchProvince.children = matchProvince.children || [];
        matchProvince.children.push({
          label: city.name,
          value: city.code,
        });
      }
    });

    const options = provinces.map(province => ({
      label: province.name,
      value: province.code,
      children: province.children
    }));

    this.setState({options: options})

  }

  // 获取违章订单明细
  fetchOrderList(current, beginDate, endDate, carNumber='', dateType='', orderId='', preOrderStatus=''){
    if(!beginDate){
      Message.error('请选择开始日期')
      return
    }
    if(!endDate){
      Message.error('请选择结束日期')
      return
    }
    fetch('get',`/usercenter/transaction/violation-order-detail-list?shopServiceId=${this.props.shopServiceId}
    &beginDate=${beginDate}&endDate=${endDate}&carNumber=${carNumber}&current=${current}&dateType=${dateType}
    &locationId=${this.state.locationId||''}&orderId=${orderId}&preOrderStatus=${preOrderStatus}&size=10`).then(res=>{
      if(res.code == 0){
        let list = res.data.records
        list.forEach((item)=>{
          let preOrderStatus = item.preOrderStatus
          let status = item.status
          for( let i of orderType){
            if(i.key == preOrderStatus){
              item.preOrderStatus = i.name
            }
            if(i.key == status){
              item.status = i.name
            }
          }
        })
        this.setState({data: list, total: res.data.total, current: current})
      } else{
        res.msg ? Message.error(res.msg) : Message.error('查询错误')
      }

    })
  }

  fetchMore = (page,pageSize) =>{
    this.fetchOrderList(page.current, this.state.beginDate,this.state.endDate, this.state.carNumber, this.state.dateType, this.state.orderId,this.state.preOrderStatus)
  }

  onChange = (value) =>{
    this.setState({locationId: value[1]})
  }

  render() {
    const { getFieldDecorator} = this.props.form;
    return (

        <div>
          <Form layout="inline" onSubmit={this.handleSubmit} >
            <FormItem>
              {getFieldDecorator('orderId', {
                rules: [],
              })(
                  <Input style={{width: '150px'}} placeholder="请输入订单号" />
              )}
            </FormItem>
            <FormItem>
              <Cascader
                  options={this.state.options}
                  expandTrigger="hover"
                  onChange={this.onChange}
                  style={{ width: 150 }}
                  placeholder="请选择违章城市"
              />
              {/*{getFieldDecorator('locationId', {*/}
                {/*rules: [],*/}
              {/*})(*/}
                  {/*<Input style={{width: '150px'}} placeholder="请输入违章城市" maxLength={7} />*/}
              {/*)}*/}
            </FormItem>
            <FormItem>
              {getFieldDecorator('carNumber', {
                rules: [],
              })(
                  <Input style={{width: '150px'}} placeholder="请输入车牌" maxLength={7} />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('dateType', {
                rules: [],
              })(
                  <Select  dropdownMatchSelectWidth={false} allowClear={true} placeholder="请选择日期类型">
                    {dateType.map((item,index)=>
                        <Option value={item.key} key={index}>{item.name}</Option>
                    )}
                  </Select>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('preOrderStatus', {
                rules: [],
              })(
                  <Select  dropdownMatchSelectWidth={false} allowClear={true} placeholder="请选择订单状态">
                    {orderType.map((item,index)=>
                        <Option value={item.key} key={index}>{item.name}</Option>
                    )}
                  </Select>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('beginDate', {
                rules: [],
              })(
                  <DatePicker placeholder={'请选择起始日期'}/>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('endDate', {
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
          </Form>
          <Table
              className='mt15'
              columns={columns}
              dataSource={this.state.data}
              scroll={{ x: 2600 }}
              pagination={{total: this.state.total, current: this.state.current}}
              onChange={(page,pageSize)=>{this.fetchMore(page,pageSize)}}
          />
        </div>



    );
  }
}

const dateType = [
  {key:0,name:'订单日期'},
  {key:1,name:'支付日期'},
  {key:2,name:'完成日期'},
  {key:3,name:'退款日期'},
  {key:4,name:'主订单完成日期'},

]

const orderType = [
  {key:'NeedPay',name:'待付款'},
  {key:'Deleted',name:'已删除'},
  {key:'Payed',name:'已付款'},
  {key:'Proceccing',name:'正在办理'},
  {key:'Drawbacked',name:'已退款'},
  {key:'Finished',name:'已完成'},
]



export default Form.create()(OrderChecking);