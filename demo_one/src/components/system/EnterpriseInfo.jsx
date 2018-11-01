import React from 'react'
import { Row, Col,Card, Button,  Divider, message,  Radio, Form, Input, Cascader} from 'antd';
import {provinces, cities, areas} from '../../constants/Area'
import UpLoadImg  from './UploadImg'



const FormItem = Form.Item;


class EnterpriseInfo extends React.Component {
  state = {

  };

  onChange = (value) =>{
    // console.log(value)
  }

  handleSubmit = (e) => {
    e && e.preventDefault();
    this.props.form.setFieldsValue({
      companyLicenseCopy: this.state.companyLicenseCopy,
      companyCustomerLicense: this.state.companyCustomerLicense,
      idCardPositive: this.state.idCardPositive,
      idCardNegative: this.state.idCardNegative
    });
    this.props.form.validateFields((err, values) => {
      // console.log('Received values of form: ', values);
      if (!err) {
        this.props.submit(values)
        // console.log('Received values of form: ', values);
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
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 4,
        },
      },
    };

    return (
        <div>
          <Row><p style={{fontSize: '13px',fontWeight: '800'}}>企业信息</p></Row>
          <Divider style={{margin: '10px 0'}}></Divider>
          <Form onSubmit={this.handleSubmit} >
            <FormItem
                label="公司名称"
                {...formItemLayout}
            >
              {getFieldDecorator('companyName', {
                rules: [
                  {
                    required: true, message: '请输入公司名称',
                  }
                ],
              })(
                  <Input placeholder="请输入公司名称" maxLength={50}/>
              )}

            </FormItem>
            <FormItem
                label="公司地址"
                {...formItemLayout}
            >
              {getFieldDecorator('companyAddress', {
                rules: [
                  {
                    required: true, message: '请选择地址',
                  }
                ],
              })(
              <Cascader
                  options={this.state.options}
                  expandTrigger="hover"
                  onChange={this.onChange}
                  placeholder="请选择地址"
              />
              )}
            </FormItem>
            <FormItem
                label="详细地址"
                {...formItemLayout}
            >
              {getFieldDecorator('companyAddressDetail', {
                rules: [{
                  required: true, message: '请选择地址',
                }],
              })(
                  <Input placeholder="请输入详细地址" maxLength={50}/>
              )}

            </FormItem>
            <FormItem
                label="税务登记证编号"
                {...formItemLayout}
            >
              {getFieldDecorator('companyTaxNum', {
                rules: [],
              })(
                  <Input placeholder="请输入税务登记证编号" maxLength={50}/>
              )}

            </FormItem>
            <FormItem
                label="组织机构编号"
                {...formItemLayout}
            >
              {getFieldDecorator('companyOrgNum', {
                rules: [],
              })(
                  <Input placeholder="请输入组织机构编号" maxLength={50}/>
              )}

            </FormItem>
            <FormItem
                label="营业执照副本"
                {...formItemLayout}
            >
              {getFieldDecorator('companyLicenseCopy', {
                rules: [{
                  required: true, message: '请上传营业执照副本',
                }],
                getValueFromEvent: this.normFile
              })(
                  <UpLoadImg
                      type={'companyLicenseCopy'}
                      url={this.state.companyLicenseCopy}
                      getImgUrl={this.getImgUrl}
                  />
              )}
            </FormItem>
            <FormItem
                label="开户许可证"
                {...formItemLayout}
            >
              {getFieldDecorator('companyCustomerLicense', {
                rules: [{
                  required: true, message: '请上传开户许可证',
                }],
              })(
                  <UpLoadImg type={'companyCustomerLicense'} url={this.state.companyCustomerLicense} getImgUrl={this.getImgUrl}/>
              )}

            </FormItem>
            <Row><p style={{fontSize: '13px',fontWeight: '800'}}>管理员信息</p></Row>
            <Divider style={{margin: '10px 0'}}></Divider>
              <FormItem
                  label="姓名"
                  {...formItemLayout}
              >
                {getFieldDecorator('userName', {
                  rules: [
                    {
                      required: true, message: '请输入管理员姓名',
                    }
                  ],
                })(
                    <Input placeholder="请输入管理员姓名"  maxLength={10}/>
                )}

              </FormItem>

              <FormItem
                  label="手机"
                  {...formItemLayout}
              >
                {getFieldDecorator('userPhone', {
                  rules: [{
                    required: true, message: '请输入管理员手机号码',
                  }, {
                    validator: this.checkTel,
                  }],
                  validateTrigger:'onBlur'
                })(
                    <Input placeholder="请输入管理员手机号码" maxLength={11}/>
                )}

              </FormItem>
              <FormItem
                  label="身份证号"
                  {...formItemLayout}
              >
                {getFieldDecorator('userIdCard', {
                  rules: [{
                    required: true, message: '请输入管理员身份证号',
                  }, {
                    validator: this.checkCardNo,
                  }],
                  validateTrigger:'onBlur'
                })(
                    <Input placeholder="请输入管理员身份证号" maxLength={18}/>
                )}

              </FormItem>
              <FormItem
                  label="身份证正面"
                  {...formItemLayout}
              >
                {getFieldDecorator('idCardPositive', {
                  rules: [{
                    required: true, message: '请上传身份证正面照片',
                  }],
                })(
                    <UpLoadImg  type={'idCardPositive'} url={this.state.idCardPositive} getImgUrl={this.getImgUrl}/>
                )}

              </FormItem>
              <FormItem
                  label="身份证反面"
                  {...formItemLayout}
              >
                {getFieldDecorator('idCardNegative', {
                  rules: [{
                    required: true, message: '请上传身份证反面照片',
                  }],
                })(
                    <UpLoadImg  type={'idCardNegative'} url={this.state.idCardNegative} getImgUrl={this.getImgUrl}/>
                )}
              </FormItem>
              <FormItem

                  {...tailFormItemLayout}
              >
                <Button type='primary' size='large'  htmlType="submit">提交验证</Button>
              </FormItem>
          </Form>
        </div>

    )
  }
}

export default  Form.create()(EnterpriseInfo)
