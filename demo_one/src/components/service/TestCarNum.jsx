
import React from 'react';
import { Row, Col,Card, Button, Icon, Divider, Message, Form, Select, Input, Table} from 'antd';
import {fetch} from '../../api/tools'

const FormItem = Form.Item;
const Option = Select.Option;

const vioType = [
  {key:1,name:'有违章'},
  {key:2,name:'无违章'},
  {key:3,name:'有可办违章'},
  // {key:4,name:'有不可办违章'},
  // {key:5,name:'有扣分违章'},
  // {key:6,name:'有办理中违章'},
];

const columns = [{
  title: '序号',
  dataIndex: 'number',
  key: 'number',
}, {
  title: '车牌',
  dataIndex: 'carNumber',
  key: 'carNumber',
}, {
  title: '车架号',
  dataIndex: 'carCode',
  key: 'carCode',
}, {
  title: '发动机号',
  dataIndex: 'carDriveCode',
  key: 'carDriveCode',
}];



class TestCarNum extends React.Component {
  state = {
    activeIndex: 0,
    carList:[]
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        this.fetchVioListCar(1,values.prefix, values.queryType)
      }
    });
  };

  onChange = (value) =>{
    console.log(value);
  }

  componentDidMount(){
    this.fetchVioListCar('1')
  }

  fetchVioListCar = (current,prefix='',queryType='', appKey=this.props.appKey) => {
    fetch('get',`/usercenter/violation/list/test?current=${current}&size=10&prefix=${prefix}&queryType=${queryType}&appKey=${appKey}`).then(res=>{
      if(res.code == 0){
        let carList = res.data;
        carList.length >0 && carList.forEach((item,index)=>{
          item.number = index+1;
        })
        this.setState({carList: carList})
      }else{
        Message.destroy()
        Message.error(res.msg)
      }
    })
  }



  render() {
    const { getFieldDecorator} = this.props.form;
    const { carList } = this.state
    return (
        <div>
          <Row type="flex" justify="space-between" align='middle' className='mb15'>
            <Col span={18} style={{fontSize: 14, fontWeight: 500}}>
              <div>测试车牌可用于测试违章查询的流程，车牌信息均为真实数据，请勿随意反复测试。</div>
              <div>每日限获取50条测试车牌数据。</div>
              <div>若产生测试订单需要退单，请联系客服：020 - 324345355。</div>
            </Col>
            {/*<Col span={6} style={{textAlign: 'right'}}>*/}
              {/*<Button style={{marginLeft: 30}} type='primary' >返回</Button>*/}
            {/*</Col>*/}
          </Row>
          <Form layout="inline" onSubmit={this.handleSubmit} >
            <FormItem>
              {getFieldDecorator('prefix', {
                rules: [],
              })(
                  <Input style={{width: '150px'}} placeholder="请输入车牌前缀" maxLength={7} />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('queryType', {
                rules: [],
              })(
                  <Select  dropdownMatchSelectWidth={false} allowClear={true} placeholder="请选择违章情况">
                    {vioType.map((item,index)=>
                        <Option value={item.key} key={index}>{item.name}</Option>
                    )}
                  </Select>
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
          <Table className='mt15'  columns={columns} dataSource={carList}  />
        </div>

    );
  }
}



export default Form.create()(TestCarNum);