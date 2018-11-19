import React from 'react'
import {
    Button,
    Card,
    Cascader,
    Col,
    DatePicker,
    Divider,
    Form,
    Input,
    Message,
    notification,
    Radio,
    Row,
    Select
} from 'antd';
import {fetch} from '../../api/tools'
//年检记录添加


const FormItem = Form.Item;
const Option = Select.Option;
const carNumbers = [
    {carNumber:'粤A9NG71',carType:'奥迪-A6'},
    {carNumber:'粤AFH3508',carType:'奥迪-A9'},
    {carNumber:'川AF8C44',carType:'宝马-x5'},
    {carNumber:'粤BFF965',carType:'宝马-x5'},
    {carNumber:'鲁B1S77X',carType:'宝马-x5'},
    {carNumber:'黑P16482',carType:'宝马-x5'},
]

class AnnualInspectionRecord extends React.Component {
  state = {
      formLayout: 'horizontal',
      carNumbers:[]
  };




  handleSubmit = (e) => {
    e && e.preventDefault();
    this.props.form.validateFields((err, values) => {

      if (!err) {
          const filesValues = {
            ...values,
              'inspectionDate':values['inspectionDate'].format('YYYY-MM-DD HH:mm:ss'),
              'nextInspectionDate':values['nextInspectionDate'].format('YYYY-MM-DD HH:mm:ss')
      }
        // this.props.submit(values)
        // console.log('年检信息: ', values);
        fetch('post','/chedui/zichan/annualInspectionRecord',filesValues).then(res=>{
          if (res.code ===2000) {
              Message.success('添加成功');
            // window.location.href("/app/car/carList")
              this.props.history.push('/app/car/AnnualInspectionRecordList');
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
      /*fetch('get','chedui/zichan/annualInspectionRecord/carInfo').then(res=>{
          if (res.code ===2000){
              notification['success']({
                  message: '通知',
                  description:'车辆信息获取成功'
              });
              this.setState({carNumbers:res.data})
          }
      })*/
      const{ carNumber,carType} = this.props.match.params;
      this.props.form.setFieldsValue({
          carNumber:carNumber,
          carType:carType
      })

  }
//select选中的值
    handleChange = (value)=>{
      for(let car of carNumbers){
          if (car.carNumber===value){
              /*alert(car.carType)
              this.setState({carType:car.carType})*/
              this.props.form.setFieldsValue({carType:car.carType})
          }
      }
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
        sm: { span: 8,
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
          <Row><p style={{fontSize: '13px',fontWeight: '800'}}>年检记录</p></Row>
          <Divider style={{margin: '10px 0'}}></Divider>
          <Form onSubmit={this.handleSubmit} layout={formLayout}>
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
                  <Select
                      showSearch
                      dropdownMatchSelectWidth={false}
                      allowClear={true}
                      optionFilterProp="children"
                      filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      onChange={this.handleChange}
                      placeholder="车牌号码">
                      {carNumbers.map((item,index)=>
                      <Option value={item.carNumber} key={index}>{item.carNumber}</Option>
                  )}
                  </Select>
              )}
             </FormItem>
              <FormItem
                  {...formItemLayout}
                  label="车辆类型"
                  key={123}
              >
                  {getFieldDecorator('carType', {
                      rules: [],
                  })(
                      <Input disabled={true} placeholder="请输入车辆类型" />
                  )}
              </FormItem>
              <FormItem
                  label="年检处理人"
                  {...formItemLayout}
              >
                  {getFieldDecorator('inspectionUser', {
                      rules: [
                          {
                              required: true, message: '请输入年检处理人',
                          }
                      ],
                  })(
                      <Input  placeholder="请输入年检处理人" maxLength={10}/>
                  )}
              </FormItem>
              <FormItem
                  label="年检日期"
                  {...formItemLayout}
              >
                  {getFieldDecorator('inspectionDate', {
                      rules: [
                          {
                              required: true, message: '请输入年检日期',
                          }
                      ],
                  })(
                      <DatePicker placeholder={'请选择年检日期'}/>
                  )}
              </FormItem>
              <FormItem
                  label="年检金额"
                  {...formItemLayout}
              >
                  {getFieldDecorator('inspectionMoney', {
                      rules: [],
                  })(
                      <Input placeholder="请输入年检金额" maxLength={20}/>
                  )}
              </FormItem>
              <FormItem
                  label="下次年检日期"
                  {...formItemLayout}
              >
                  {getFieldDecorator('nextInspectionDate', {
                      rules: [
                          {
                              required: true, message: '请输入下次年检日期',
                          }
                      ],
                  })(
                      <DatePicker placeholder={'请选择下次年检日期'}/>
                  )}
              </FormItem>
              <FormItem
                  label="备注"
                  {...formItemLayout}
              >
                  {getFieldDecorator('remark', {
                      rules: [],
                  })(
                      <TextArea rows={4}  placeholder={'如需备注,请输入备注信息'} />
                  )}
              </FormItem>
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


export default  Form.create()(AnnualInspectionRecord)
