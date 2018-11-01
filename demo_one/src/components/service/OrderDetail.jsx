
import React from 'react';
import { Row, Col,Card, Button, Icon, Divider, message, Form, Select, Input, Table, DatePicker} from 'antd';


const FormItem = Form.Item;
const Option = Select.Option;


const vioType = [
  {key:1,name:'有违章'},
  {key:2,name:'无违章'},
  {key:3,name:'有可办违章'},
  {key:4,name:'有不可办违章'},
  {key:5,name:'有扣分违章'},
  {key:6,name:'有办理中违章'},
];

const dateType = [
  {key:1,name:'订单日期'},
  {key:2,name:'支付日期'},
  {key:3,name:'完成日期'},
  {key:4,name:'退款日期'},

]

const columns = [{
  title: '扣分',
  dataIndex: 'name',
  key: 'name',
  render: text => <a>{text}</a>,
}, {
  title: '罚金',
  dataIndex: 'age',
  key: 'age',
}, {
  title: '代办费',
  dataIndex: 'address',
  key: 'address',
}, {
  title: '订单金额',
  dataIndex: '1',
  key: 'action',
},{
  title: '订单优惠',
  dataIndex: 'address',
  key: '1',
},{
  title: '应付金额',
  dataIndex: 'address',
  key: '2',
},{
  title: '退款',
  dataIndex: 'address',
  key: '3',
},{
  title: '退款时间',
  dataIndex: 'address',
  key: '4',
},{
  title: '主订单完成时间',
  dataIndex: 'address',
  key: '5',
},{
  title: '退款说明',
  dataIndex: 'address',
  key: '6',
},];

const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}];


class OrderDetail extends React.Component {
  state = {
    activeIndex: 0
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
      }
    });
  };

  onChange = (value) =>{
    console.log(value);
  }

  componentDidMount(){

  }


  render() {
    const { getFieldDecorator} = this.props.form;
    return (

        <div>
          {/*<Row type="flex" justify="space-between" align='middle' className='mb15'>*/}
            {/*<Col span={24} style={{textAlign: 'right'}}>*/}
              {/*<Button style={{marginLeft: 30}} type='primary' >返回</Button>*/}
            {/*</Col>*/}
          {/*</Row>*/}
          <Form layout="inline" onSubmit={this.handleSubmit} >
            <FormItem>
              {getFieldDecorator('userPhone', {
                rules: [],
              })(
                  <Input style={{width: '150px'}} placeholder="请输入合作商账号" maxLength={7} />
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
              {getFieldDecorator('startTime', {
                rules: [],
              })(
                  <DatePicker placeholder={'请选择起始日期'}/>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('startTime', {
                rules: [],
              })(
                  <DatePicker placeholder={'请选择结束日期'}/>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('userPhone', {
                rules: [],
              })(
                  <Input style={{width: '150px'}} placeholder="请输入订单号" maxLength={7} />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('vioType', {
                rules: [],
              })(
                  <Select  dropdownMatchSelectWidth={false} allowClear={true} placeholder="请选择违章办理状态">
                    {vioType.map((item,index)=>
                        <Option value={item.key} key={index}>{item.name}</Option>
                    )}
                  </Select>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('userPhone', {
                rules: [],
              })(
                  <Input style={{width: '150px'}} placeholder="请输入违章城市" maxLength={7} />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('userPhone', {
                rules: [],
              })(
                  <Input style={{width: '150px'}} placeholder="请输入车牌" maxLength={7} />
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
          <Table className='mt15'  columns={columns} dataSource={data} />
        </div>



    );
  }
}



export default Form.create()(OrderDetail);