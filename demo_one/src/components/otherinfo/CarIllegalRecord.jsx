import React from 'react'
import { Row, Col,Card, Button,  Divider, Message,Radio,Select,Form, Input, Cascader,DatePicker} from 'antd';
import {provinces, cities, areas} from '../../constants/Area'
import UpLoadImg  from '../system/UploadImg'
import {fetch} from '../../api/tools'
//年检记录添加


const FormItem = Form.Item;
const Option = Select.Option;

class CarIllegalRecord extends React.Component {
  state = {
      formLayout: 'horizontal',
  };




  onChange = (value) =>{
    // console.log(value)
  }

  handleSubmit = (e) => {
    e && e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // this.props.submit(values)
        // console.log('年检信息: ', values);
          const filesValue = {
              ...values,
              'illegalTime': values['illegalTime'].format('YYYY-MM-DD HH:mm:ss')
          };
        fetch('post','/chedui/zichan/carIllegalRecord',filesValue).then(res=>{
          if (res.code ===2000) {
              Message.success('添加成功');
              this.props.history.push('/app/car/CarIllegalRecordList');
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
      const{ carNumber,carType} = this.props.match.params;
      this.props.form.setFieldsValue({
          carNumber:carNumber,
          carType:carType
      })

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
          <Row><p style={{fontSize: '13px',fontWeight: '800'}}>违章记录</p></Row>
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
                  label="违章日期"
              >
                  {getFieldDecorator('illegalTime', {
                      rules: [{
                          required:true,message:"请选择违章日期"
                      }],
                  })(
                      <DatePicker placeholder={'请选择违章日期'}/>
                  )}
             </FormItem>
              <FormItem
                  label="违章地点"
                  {...formItemLayout}
              >
                  {getFieldDecorator('illegalAddress', {
                      rules: [
                          {
                              required: true, message: '请输入违章地点',
                          }
                      ],
                  })(
                      <Input placeholder="请输入违章地点" maxLength={20}/>
                  )}
              </FormItem>
              <FormItem
                  label="违章扣分"
                  {...formItemLayout}
              >
                  {getFieldDecorator('illegalScore', {
                      rules: [ {
                          required: true, message: '请输入违章扣分',
                      }],
                  })(
                      <Input placeholder="请输入违章扣分" maxLength={20}/>
                  )}
              </FormItem>
              <FormItem
                  label="违章罚款"
                  {...formItemLayout}
              >
                  {getFieldDecorator('illegalMoney', {
                      rules: [ {
                          required: true, message: '请输入违章罚款',
                      }],
                  })(
                      <Input placeholder="请输入违章罚款" maxLength={20}/>
                  )}
              </FormItem>
              <FormItem
                  {...formItemLayout}
                  label="违章状态"
                  style={{marginBottom: 10}}
              >
                  {getFieldDecorator('status', {
                      rules: [
                          { required: true, message: '请选择违章状态', whitespace: true }
                          ],
                  })(
                      <Select  dropdownMatchSelectWidth={false} allowClear={true} placeholder="违章状态">
                          {status.map((item,index)=>
                              <Option value={item.value} key={index}>{item.name}</Option>
                          )}
                      </Select>
                  )}
              </FormItem>
              <FormItem
                  label="违章详情"
                  {...formItemLayout}
              >
                  {getFieldDecorator('illegalContent', {
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
const status = [
    {value:'0',name:'未处理'},
    {value:'1',name:'已处理'}
]

export default  Form.create()(CarIllegalRecord)
