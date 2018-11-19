import React from 'react'
import { Row, Col,Card, Button,  Divider, Message,  Radio,TextArea, Form, Input, Cascader,DatePicker} from 'antd';
import {provinces, cities, areas} from '../../constants/Area'
import UpLoadImg  from '../system/UploadImg'
import {fetch} from '../../api/tools'
import moment from 'moment';

//保单记录添加


const FormItem = Form.Item;
const dateFormat = 'YYYY/MM/DD';
class CarInsuranceFileRecordUpdate extends React.Component {
  state = {
      formLayout: 'horizontal',
  };


  handleSubmit = (e) => {
    e && e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        // this.props.submit(values)
        // console.log('年检信息: ', values);
          values.id = this.props.carDetailRecord.id;
          const filesValues = {
              ...values,
              'commercialBeginTime':values['commercialBeginTime'].format('YYYY-MM-DD HH:mm:ss'),
              'commercialEndTime':values['commercialEndTime'].format('YYYY-MM-DD HH:mm:ss'),
              'beginTime':values['beginTime'].format('YYYY-MM-DD HH:mm:ss'),
              'endTime':values['endTime'].format('YYYY-MM-DD HH:mm:ss'),
          };
        fetch('put','/chedui/zichan/carInsuranceFileRecord',filesValues).then(res=>{
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
          let {carNumber,carType, beginTime,
              endTime,insuranceCompany,organizationCode,companyName,
              insuranceCode,commercialBeginTime, commercialEndTime,
              commercialCompanyName,commercialOrganizationName,commercialCompany,
              commercialCode,remark} = this.props.carDetailRecord
          this.props.form.setFieldsValue({
              carNumber: carNumber,
              carType: carType,
              beginTime:moment(beginTime),
              endTime:moment(endTime),
              insuranceCompany:insuranceCompany,
              organizationCode:organizationCode,
              companyName:companyName,
              insuranceCode:insuranceCode,
              commercialBeginTime:moment(commercialBeginTime),
              commercialEndTime:moment(commercialEndTime),
              commercialCompanyName:commercialCompanyName,
              commercialOrganizationName:commercialOrganizationName,
              commercialCompany:commercialCompany,
              commercialCode:commercialCode,
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
        <div style={{background: 'white', padding: '26px 16px 16px',margin:'20px 0px'}}>
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
                              <Input disabled={true} placeholder="请输入车牌号码" maxLength={50}/>
                          )}
                      </FormItem>
                  </Col>
                  <Col span={12}>
                      <FormItem
                          label="商业保险单号"
                          {...formItemLayout}
                      >
                          {getFieldDecorator('commercialCode', {
                              rules: [ {
                                  required: true, message: '请输入商业保险单号',
                              }],
                          })(
                              <Input placeholder="请输入商业保险单号" maxLength={20}/>
                          )}
                      </FormItem>
                  </Col>
              </Row>
              <Row>
                  <Col span={12}>
                      <FormItem
                          label="车型号"
                          {...formItemLayout}
                      >
                          {getFieldDecorator('carType', {
                              rules: [],
                          })(
                              <Input disabled={true} placeholder="自动关联" maxLength={50}/>
                          )}
                      </FormItem>
                  </Col>
                  <Col span={12}>
                      <FormItem
                          {...formItemLayout}
                          label="商业险开始时间"
                      >
                          {getFieldDecorator('commercialBeginTime', {
                              rules: [{
                                  required:true,message:"请选择商业险开始时间"
                              }],
                          })(
                                  <DatePicker placeholder={'请选择商业险开始时间'}/>
                          )}
                      </FormItem>
                  </Col>
              </Row>
              <Row>
                  <Col span={12}>
                      <FormItem
                          label="交强险单号"
                          {...formItemLayout}
                      >
                          {getFieldDecorator('insuranceCode', {
                              rules: [
                                  {
                                      required: true,message:"请输入交强险单号"
                                  }
                              ],
                          })(
                              <Input placeholder="请输入交强险单号" maxLength={50}/>
                          )}
                      </FormItem>
                  </Col>
                  <Col span={12}>
                      <FormItem
                          {...formItemLayout}
                          label="商业险结束时间"
                      >
                          {getFieldDecorator('commercialEndTime', {
                              rules: [{
                                  required:true,message:"请选择商业险结束时间"
                              }],
                          })(
                              <DatePicker  placeholder={'请选择商业险结束时间'}/>
                          )}
                      </FormItem>
                  </Col>
              </Row>
              <Row>
                  <Col span={12}>
                      <FormItem
                          {...formItemLayout}
                          label="交强险开始时间"
                      >
                          {getFieldDecorator('beginTime', {
                              rules: [{
                                  required:true,message:"请选择交强险开始时间"
                              }],
                          })(
                              <DatePicker  placeholder={'请选择交强险开始时间'}/>
                          )}
                      </FormItem>
                  </Col>
                  <Col span={12}>
                      <FormItem
                          label="商业险公司名称"
                          {...formItemLayout}
                      >
                          {getFieldDecorator('commercialCompanyName', {
                              rules: [],
                          })(
                              <Input placeholder="请输入商业险公司名称" maxLength={50}/>
                          )}
                      </FormItem>
                  </Col>
              </Row>
              <Row>
                  <Col span={12}>
                      <FormItem
                          {...formItemLayout}
                          label="交强险结束时间"
                      >
                          {getFieldDecorator('endTime', {
                              rules: [{
                                  required:true,message:"请选择交强险结束时间"
                              }],
                          })(
                              <DatePicker  placeholder={'请选择交强险结束时间'}/>
                          )}
                      </FormItem>
                  </Col>
                  <Col span={12}>
                      <FormItem
                          label="商业险组织结构代码"
                          {...formItemLayout}
                      >
                          {getFieldDecorator('commercialOrganizationName', {
                              rules: [],
                          })(
                              <Input placeholder="请输入商业险组织结构代码" maxLength={50}/>
                          )}
                      </FormItem>
                  </Col>
              </Row>
              <Row>
                  <Col span={12}>
                      <FormItem
                          label="交强险公司名称"
                          {...formItemLayout}
                      >
                          {getFieldDecorator('companyName', {
                              rules: [],
                          })(
                              <Input placeholder="请输入交强险公司名称" maxLength={50}/>
                          )}
                      </FormItem>
                  </Col>
                  <Col span={12}>
                      <FormItem
                          label="商业险公司"
                          {...formItemLayout}
                      >
                          {getFieldDecorator('commercialCompany', {
                              rules: [],
                          })(
                              <Input placeholder="请输入商业险公司" maxLength={20}/>
                          )}
                      </FormItem>
                  </Col>
              </Row>
              <Row>
                  <Col span={12}>
                      <FormItem
                          label="交强险组织结构代码"
                          {...formItemLayout}
                      >
                          {getFieldDecorator('organizationCode', {
                              rules: [],
                          })(
                              <Input placeholder="请输入交强险组织结构代码" maxLength={50}/>
                          )}
                      </FormItem>
                      <FormItem
                          label="交强险公司"
                          {...formItemLayout}
                      >
                          {getFieldDecorator('insuranceCompany', {
                              rules: [],
                          })(
                              <Input placeholder="请输入交强险公司" maxLength={50}/>
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

export default  Form.create()(CarInsuranceFileRecordUpdate)
