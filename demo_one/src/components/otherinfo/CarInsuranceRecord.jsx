import React from 'react'
import { Row, Col,Card, Button,Select,Divider, Message,  Radio,TextArea, Form, Input, Cascader,DatePicker} from 'antd';
import {provinces, cities, areas} from '../../constants/Area'
import UpLoadImg  from '../system/UploadImg'
import {fetch} from '../../api/tools'
//出险记录添加

const Option= Select.Option;
const FormItem = Form.Item;
class CarInsuranceRecord extends React.Component {
  state = {
      formLayout: 'horizontal',
  };




  onChange = (value) =>{
    // console.log(value)
  }

  handleSubmit = (e) => {
    e && e.preventDefault();
    /*this.props.form.setFieldsValue({
        carNumber: this.state.carNumber,
        carType: this.state.carType,
        inspectionUser: this.state.inspectionUser,
        inspectionDate: this.state.inspectionDate
    });*/
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // this.props.submit(values)
        // console.log('年检信息: ', values);
          const filesValues = {
              ...values,
              'beginTime':values['beginTime'].format('YYYY-MM-DD HH:mm:ss'),
              'endTime':values['endTime'].format('YYYY-MM-DD HH:mm:ss'),
              'insuranceTime':values['insuranceTime'].format('YYYY-MM-DD HH:mm:ss'),
          };
          /*alert(filesValues.commercialBeginTime+"--------"+filesValues.commercialEndTime);
          return;*/
        fetch('post','/chedui/zichan/carInsuranceRecord',filesValues).then(res=>{
          if (res.code ===2000) {
              Message.success('添加成功');
              this.props.history.push('/app/car/CarInsuranceRecordList');
          }
        })
      }
    });
  };

  checkCardNo = (rule, value, callback) => {
    if(value && !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)){
      callback('请输入正确的管理员身份证号');
    } else {
      callback();
    }
  };


  //校验手机号码
  checkTel = (rule, value, callback)=>{
    if(value && !(/^1\d{10}$/.test(value))){
      callback('请输入正确的管理员手机号码')
    }else{
      callback();
    }
  };


  getImgUrl = (type, url) => {
    this.setState({[type]: url},()=>{
      this.handleSubmit()
    })
  };

  componentDidMount(){
    areas.forEach(area => {
      const matchCity = cities.filter(city => city.code === area.cityCode)[0];
      if (matchCity) {
        matchCity.children = matchCity.children || [];
        matchCity.children.push({
          label: area.name,
          value: area.name
        });
      }
    });

    cities.forEach(city => {
      const matchProvince = provinces.filter(
          province => province.code === city.provinceCode
      )[0];
      if (matchProvince) {
        matchProvince.children = matchProvince.children || [];
        matchProvince.children.push({
          label: city.name,
          value: city.name,
          children: city.children
        });
      }
    });

    const options = provinces.map(province => ({
      label: province.name,
      value: province.name,
      children: province.children
    }));

    this.setState({options: options})
  }


  render() {
    const { getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8,
              offset:0,
        },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15,
              offset:0,
        },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 15,
          offset:11,
        },
      },
    };
    const {formLayout} = this.state;
    const { TextArea } = Input;

    return (
        <div>
          <Row><p style={{fontSize: '13px',fontWeight: '800'}}>出险记录</p></Row>
          <Divider style={{margin: '10px 0'}}></Divider>
          <Form onSubmit={this.handleSubmit} layout={formLayout}>
              <Row>
                  <Col span={12}>
                      <FormItem
                          label="车牌号码"
                          {...formItemLayout}
                      >
                          {getFieldDecorator('carNumber', {
                              rules: [
                                  {
                                      required: true, message: '请输入车牌号码',
                                  }
                              ],
                          })(
                              <Input placeholder="请输入车牌号码" maxLength={50}/>
                          )}
                      </FormItem>
                  </Col>
                  <Col span={12}>
                      <FormItem
                          {...formItemLayout}
                          label="进厂时间"
                      >
                          {getFieldDecorator('beginTime', {
                              rules: [{
                                  required:true,message:"请选择进厂时间"
                              }],
                          })(
                              <DatePicker  placeholder={'请选择进厂时间'}/>
                          )}
                      </FormItem>
                  </Col>
              </Row>
              <Row>
                  <Col span={12}>
                      <FormItem
                          label="客户名称"
                          {...formItemLayout}
                      >
                          {getFieldDecorator('userName', {
                              rules: [{
                                  required:true,message:"请输入客户名称"
                              }],
                          })(
                              <Input placeholder="请输入客户名称" maxLength={50}/>
                          )}
                      </FormItem>
                  </Col>
                  <Col span={12}>
                      <FormItem
                          label="修理厂地址"
                          {...formItemLayout}
                      >
                          {getFieldDecorator('maintainAddress', {
                              rules: [{
                                  required:true,message:"请输入修理厂地址"
                              }],
                          })(
                              <Input placeholder="请输入修理厂地址" maxLength={50}/>
                          )}
                      </FormItem>
                  </Col>
              </Row>
              <Row>
                  <Col span={12}>
                      <FormItem
                          label="客户联系方式"
                          {...formItemLayout}
                      >
                          {getFieldDecorator('userTelephone', {
                              rules: [{
                                  required:true,message:"请输入客户联系方式"
                              }],
                          })(
                              <Input placeholder="请输入客户联系方式" maxLength={50}/>
                          )}
                      </FormItem>
                      <FormItem
                          label="出险地址"
                          {...formItemLayout}
                      >
                          {getFieldDecorator('insuranceAddress', {
                              rules: [{
                                  required:true,message:"请输入出险地址"
                              }],
                          })(
                              <Input placeholder="请输入出险地址" maxLength={50}/>
                          )}
                      </FormItem>
                  </Col>
                  <Col span={12}>
                      <FormItem
                          label="维修内容"
                          {...formItemLayout}
                      >
                          {getFieldDecorator('maintainRemark', {
                              rules: [{
                                  required:true,message:"请输入维修内容"
                              }],
                          })(
                              <TextArea rows={5}  placeholder={'请输入维修内容'} />
                          )}
                      </FormItem>
                  </Col>
              </Row>
              <Row>
                  <Col span={12}>
                      <FormItem
                          {...formItemLayout}
                          label="出险时间"
                      >
                          {getFieldDecorator('insuranceTime', {
                              rules: [{
                                  required:true,message:"请选择出险时间"
                              }],
                          })(
                              <DatePicker  placeholder={'请选择出险时间'}/>
                          )}
                      </FormItem>
                  </Col>
                  <Col span={12}>
                      <FormItem
                          label="维修状态"
                          {...formItemLayout}
                      >
                          {getFieldDecorator('maintainStatus', {
                              rules: [{
                                  required:true,message:"请选择维修状态"
                              }],
                          })(
                              <Select  dropdownMatchSelectWidth={false} allowClear={true} placeholder="请选择维修状态">
                                  {maintainStatus.map((item,index)=>
                                      <Option value={item.value} key={index}>{item.name}</Option>
                                  )}
                              </Select>
                          )}
                      </FormItem>
                  </Col>
              </Row>
              <Row>
                  <Col span={12}>
                      <FormItem
                          label="理赔状态"
                          {...formItemLayout}
                      >
                          {getFieldDecorator('status', {
                              rules: [{
                                  required:true,message:"请选择理赔状态"
                              }],
                          })(
                              <Select  dropdownMatchSelectWidth={false} allowClear={true} placeholder="请选择理赔状态">
                                  {status.map((item,index)=>
                                      <Option value={item.value} key={index}>{item.name}</Option>
                                  )}
                              </Select>
                          )}
                      </FormItem>
                  </Col>
                  <Col span={12}>
                      <FormItem
                          {...formItemLayout}
                          label="出厂日期"
                      >
                          {getFieldDecorator('endTime', {
                              rules: [{
                                  required:true,message:"请选择出厂日期"
                              }],
                          })(
                              <DatePicker  placeholder={'请选择出厂日期'}/>
                          )}
                      </FormItem>
                  </Col>
              </Row>
              <Row>
                  <Col span={12}>
                      <FormItem
                          label="己方金额"
                          {...formItemLayout}
                      >
                          {getFieldDecorator('money', {
                              rules: [{
                                  required:true,message:"请输入己方金额"
                              }],
                          })(
                              <Input placeholder="请输入己方金额" maxLength={50}/>
                          )}
                      </FormItem>
                  </Col>
                  <Col span={12}>
                      <FormItem
                          label="订单状态"
                          {...formItemLayout}
                      >
                          {getFieldDecorator('maintainOrderStatus', {
                              rules: [{
                                  required:true,message:"请选择订单状态"
                              }],
                          })(
                              <Select  dropdownMatchSelectWidth={false} allowClear={true} placeholder="请选择订单状态">
                                  {maintainOrderStatus.map((item,index)=>
                                      <Option value={item.value} key={index}>{item.name}</Option>
                                  )}
                              </Select>
                          )}
                      </FormItem>
                  </Col>
              </Row>
              <Row>
                  <Col span={12}>
                      <FormItem
                          label="第三方金额"
                          {...formItemLayout}
                      >
                          {getFieldDecorator('thirdPartyMoney', {
                              rules: [{
                                  required:true,message:"请输入第三方金额"
                              }],
                          })(
                              <Input placeholder="请输入第三方金额" maxLength={50}/>
                          )}
                      </FormItem>
                  </Col>
                  <Col span={12}>
                      <FormItem
                          label="提车状态"
                          {...formItemLayout}
                      >
                          {getFieldDecorator('carStatus', {
                              rules: [{
                                  required:true,message:"请选择提车状态"
                              }],
                          })(
                              <Select  dropdownMatchSelectWidth={false} allowClear={true} placeholder="请选择提车状态">
                                  {carStatus.map((item,index)=>
                                      <Option value={item.value} key={index}>{item.name}</Option>
                                  )}
                              </Select>
                          )}
                      </FormItem>
                  </Col>
              </Row>
              <Row>
                  <Col span={12}>
                      <FormItem
                          label="出险描述"
                          {...formItemLayout}
                      >
                          {getFieldDecorator('insuranceRemark', {
                              rules: [{
                                  required:true,message:"请输入出险描述"
                              }],
                          })(
                              <TextArea rows={5}  placeholder={'请输入出险描述'} />
                          )}
                      </FormItem>
                  </Col>
              </Row>
              <FormItem
                  {...tailFormItemLayout}
              >
                  <Button type='primary' size='large'  htmlType="submit">确认增加</Button>
              </FormItem>
          </Form>
        </div>

    )
  }
}

const carStatus = [
    {value:'0',name:'已提车'},
    {value:'1',name:'未提车'}
]

const maintainStatus = [
    {value:'0',name:'维修中'},
    {value:'1',name:'已修好'}
]
const status = [
    {value:'0',name:'未理赔'},
    {value:'1',name:'已理赔'}
]
const maintainOrderStatus = [
    {value:'0',name:'未结算'},
    {value:'1',name:'已结算'},
    {value:'2',name:'已确定'}
]



export default  Form.create()(CarInsuranceRecord)
