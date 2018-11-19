import React from 'react'
import { Row, Col,Card, Button,Select, Divider, Message,  Radio,TextArea, Form, Input, Cascader,DatePicker} from 'antd';
import {provinces, cities, areas} from '../../constants/Area'
import {fetch} from '../../api/tools'
import moment from 'moment';

//保单记录添加

const Option = Select.Option;
const FormItem = Form.Item;
class AnnualInspectionRecordUpdate extends React.Component {
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
          values.inspectionId = this.props.carDetailRecord.inspectionId;
          const filesValues = {
              ...values,
              'inspectionDate':values['inspectionDate'].format('YYYY-MM-DD HH:mm:ss'),
              'nextInspectionDate':values['nextInspectionDate'].format('YYYY-MM-DD HH:mm:ss'),
          };
        fetch('put','/chedui/zichan/annualInspectionRecord',filesValues).then(res=>{
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
          let {carNumber,carType, inspectionUser,
              inspectionDate,inspectionMoney,nextInspectionDate,remark}= this.props.carDetailRecord
          this.props.form.setFieldsValue({
              carNumber: carNumber,
              carType: carType,
              inspectionUser:inspectionUser,
              inspectionDate:moment(inspectionDate),
              nextInspectionDate:moment(nextInspectionDate),
              inspectionMoney:inspectionMoney,
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
                        <Input placeholder="请输入车牌号码" maxLength={50}/>
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

export default  Form.create()(AnnualInspectionRecordUpdate)
