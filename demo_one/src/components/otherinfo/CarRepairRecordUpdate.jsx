import React from 'react'
import { Row, Col,Card, Button,  Divider, Message,  Radio,TextArea, Form, Input, Cascader,DatePicker} from 'antd';
import {provinces, cities, areas} from '../../constants/Area'
import {fetch} from '../../api/tools'
import moment from 'moment';

//保养记录修改


const FormItem = Form.Item;
class CarRepairRecordUpdate extends React.Component {
  state = {
      formLayout: 'horizontal',
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
          values.id = this.props.carDetailRecord.id;
          const filesValues = {
              ...values,
              'nextMaintainTime':values['nextMaintainTime'].format('YYYY-MM-DD HH:mm:ss'),
              'beginTime':values['beginTime'].format('YYYY-MM-DD HH:mm:ss'),
              'endTime':values['endTime'].format('YYYY-MM-DD HH:mm:ss'),
          };
        fetch('put','/chedui/zichan/carRepairRecord',filesValues).then(res=>{
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
          let {carNumber,company, beginTime,
              endTime,nextMaintainTime,money,maintainMeter,
              nextMaintainMeter,carStats,companyAddress,orderStatus,remark} = this.props.carDetailRecord
          this.props.form.setFieldsValue({
              carNumber: carNumber,
              company: company,
              beginTime:moment(beginTime),
              endTime:moment(endTime),
              money:money,
              maintainMeter:maintainMeter,
              nextMaintainMeter:nextMaintainMeter,
              carStats:carStats,
              orderStatus:orderStatus,
              companyAddress:companyAddress,
              nextMaintainTime:moment(nextMaintainTime),
              remark:remark
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
          <Row><p style={{fontSize: '13px',fontWeight: '800'}}>保单记录</p></Row>
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
                            label="保养厂名称"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('company', {
                                rules: [ {
                                    required: true, message: '请输入保养厂名称',
                                }],
                            })(
                                <Input placeholder="请输入保养厂名称" maxLength={20}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label="开始修理时间"
                        >
                            {getFieldDecorator('beginTime', {
                                rules: [{
                                    required:true,message:"请选择开始修理时间"
                                }],
                            })(
                                <DatePicker  placeholder={'请选择商开始修理时间'}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label="结束时间"
                        >
                            {getFieldDecorator('endTime', {
                                rules: [{
                                    required:true,message:"请选择结束时间"
                                }],
                            })(
                                <DatePicker  placeholder={'请选择结束时间'}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label="下次维修时间"
                        >
                            {getFieldDecorator('nextMaintainTime', {
                                rules: [{
                                    required:true,message:"请选择下次维修时间"
                                }],
                            })(
                                <DatePicker  placeholder={'请选择下次维修时间'}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            label="进厂公里数"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('maintainMeter', {
                                rules: [{
                                    required:true,message:"请输入进厂公里数"
                                }],
                            })(
                                <Input placeholder="请输入进厂公里数" maxLength={50}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem
                            label="下次保养公里数"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('nextMaintainMeter', {
                                rules: [],
                            })(
                                <Input placeholder="请输入下次保养公里数" maxLength={50}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            label="维修厂详细地址"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('companyAddress', {
                                rules: [],
                            })(
                                <Input placeholder="请输入维修厂详细地址" maxLength={50}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem
                            label="保养金额"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('money', {
                                rules: [{
                                    required:true,message:"请输入保养金额"
                                }],
                            })(
                                <Input placeholder="请输入保养金额" maxLength={50}/>
                            )}
                        </FormItem>
                        <FormItem
                            label="订单状态"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('orderStatus', {
                                rules: [],
                            })(
                                <Input placeholder="请选择订单状态" maxLength={50}/>
                            )}
                        </FormItem>
                        <FormItem
                            label="提车状态"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('carStats', {
                                rules: [],
                            })(
                                <Input placeholder="请选择提车状态" maxLength={50}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            label="备注"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('remark', {
                                rules: [],
                            })(
                                <TextArea rows={5}  placeholder={'如需备注,请输入备注信息'} />
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

export default  Form.create()(CarRepairRecordUpdate)
