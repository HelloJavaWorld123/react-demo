import React from 'react'
import { Row, Col,Card, Button,Select, Divider, Message,  Radio,TextArea, Form, Input, Cascader,DatePicker} from 'antd';
import {provinces, cities, areas} from '../../constants/Area'
import {fetch} from '../../api/tools'
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';

moment.locale('zh-cn');
//保单记录添加

const Option = Select.Option;
const FormItem = Form.Item;
class CarInsuranceRecordUpdate extends React.Component {
  state = {
      formLayout: 'horizontal',
  };

  isequal = (a,b)=>{
      return a+''===b+''
  };


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
          values.insuranceId = this.props.carDetailRecord.insuranceId;
          if (this.isequal(values.carStatus,'已提车')){
              values.carStatus = 0;
          } else if (this.isequal(values.carStatus,'未提车')) {
              values.carStatus = 1;
          }

          switch (values.maintainStatus.toString()) {
              case '维修中':
                  values.maintainStatus=0
                  break;
              case '已修好':
                  values.maintainStatus=1
                  break;
          }

          switch (values.status.toString()) {
              case '未理赔':
                  values.status=0
                  break;
              case '已理赔':
                  values.status=1
                  break;
          }

          switch (values.maintainOrderStatus.toString()) {
              case '未结算':
                  values.maintainOrderStatus=0
                  break;
              case '已结算':
                  values.maintainOrderStatus=1
                  break;
                  case '已确认':
                  values.maintainOrderStatus=2
                  break;
          }
          const filesValues = {
              ...values,
              'insuranceTime':values['insuranceTime'].format('YYYY-MM-DD HH:mm:ss'),
              'beginTime':values['beginTime'].format('YYYY-MM-DD HH:mm:ss'),
              'endTime':values['endTime'].format('YYYY-MM-DD HH:mm:ss'),
          };
        fetch('put','/chedui/zichan/carInsuranceRecord',filesValues).then(res=>{
          if (res.code ===2000) {
              this.props.updateOnChange();
              Message.success('修改成功');
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
      //设置数据显示回表单
      if(this.props.carDetailRecord){
          let {carNumber,userName, beginTime,
              endTime,maintainAddress,userTelephone,maintainRemark,
              insuranceTime,maintainStatus,status,money,insuranceAddress,
              maintainOrderStatus,thirdPartyMoney,carStatus,insuranceRemark} = this.props.carDetailRecord
          if (maintainOrderStatus === 0){
              maintainOrderStatus = '未结算'
          }else if(maintainOrderStatus === 1){
              maintainOrderStatus = '已结算'
          }else {
              maintainOrderStatus = '已确认'
          }
          this.props.form.setFieldsValue({
              carNumber: carNumber,
              userName: userName,
              beginTime:moment(beginTime),
              endTime:moment(endTime),
              money:money,
              maintainAddress:maintainAddress,
              userTelephone:userTelephone,
              maintainRemark:maintainRemark,
              status:status,
              maintainStatus:maintainStatus===0?'维修中':'已修好',
              maintainOrderStatus:maintainOrderStatus,
              thirdPartyMoney:thirdPartyMoney,
              carStatus:carStatus===0?'已提车':'未提车',
              insuranceTime:moment(insuranceTime),
              insuranceAddress:insuranceAddress,
              insuranceRemark:insuranceRemark
          });
      }


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
                                <Select dropdownMatchSelectWidth={false} allowClear={true} placeholder="请选择维修状态">
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
                  <Button type='primary' size='large'  htmlType="submit">确认修改</Button>
                  <Button type='danger' size='large'  onClick={this.props.goBack}>返回</Button>
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

export default  Form.create()(CarInsuranceRecordUpdate)
