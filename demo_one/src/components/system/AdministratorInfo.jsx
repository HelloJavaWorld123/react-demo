import React from 'react'
import { Row, Col,Card, Button,  Divider, message,  Radio, Form, Input, Cascader} from 'antd';
import UpLoadImg from  './UploadImg'


const FormItem = Form.Item;


class AdministratorInfo extends React.Component {
  state = {

  };

  onChange = (value) =>{
    console.log(value);
  }


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


  handleSubmit = (e) => {
    e && e.preventDefault();
    this.props.form.setFieldsValue({
      idCardPositive: this.state.idCardPositive,
      idCardNegative: this.state.idCardNegative
    });
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.submit(values)
      }
    });
  };

  getImgUrl = (type, url) => {
    this.setState({[type]: url},()=>{
      this.handleSubmit()
    })
  };

  componentDidMount(){

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
          <Row><p style={{fontSize: '13px',fontWeight: '800'}}>管理员信息</p></Row>
          <Divider style={{margin: '10px 0'}}></Divider>
          <Form onSubmit={this.handleSubmit} >
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
                  <UpLoadImg  type={'idCardPositive'} getImgUrl={this.getImgUrl}  url={this.state.idCardPositive} />
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
                  <UpLoadImg type={'idCardNegative'} getImgUrl={this.getImgUrl} url={this.state.idCardNegative}/>
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

export default  Form.create()(AdministratorInfo)
