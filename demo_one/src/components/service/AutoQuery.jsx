
import React from 'react';
import { Row, Col,Card, Button, Icon, Divider, Message, Form, Select, Input, Cascader, Table} from 'antd';
import {provinces, cities} from '../../constants/Area'
import {fetch} from '../../api/tools'

const FormItem = Form.Item;
const Option = Select.Option;

const carType = [
  {key:'02',name:'小车'},
  {key:'01',name:'大车'},
  {key:'52',name:'新能源小车'},
  {key:'51',name:'新能源大车'},
  {key:'03',name:'使馆车'},
  {key:'04',name:'领馆车'},
  {key:'05',name:'境外汽车'},
  {key:'06',name:'外籍汽车'},
  {key:'07',name:'两三轮摩托车'},
  {key:'15',name:'挂车'},
  {key:'16',name:'教练汽车'},
  {key:'26',name:'香港入境车'},
  {key:'27',name:'澳门入境车'},
]

const columns = [
  { title: '已处理', width: 100, dataIndex: '', key: '', fixed: 'left' },
  { title: '违章编码', width: 100, dataIndex: 'archive', key: 'archive', fixed: 'left' },
  { title: '可代办', dataIndex: 'cooperPoundge', key: '1' },
  { title: '违章时间', dataIndex: 'time', key: '2' },
  { title: '入库时间', dataIndex: '', key: '3' },
  { title: '违章地编码', dataIndex: '', key: '4' },
  { title: '违章城市', dataIndex: 'locationName', key: '5' },
  { title: '罚金', dataIndex: '', key: '6' },
  { title: '手续费', dataIndex: 'cooperPoundge', key: '7' },
  { title: '扣分', dataIndex: '', key: '8' },
  { title: '执行扣分', dataIndex: '', key: '9' },
  { title: '违章代码', dataIndex: '', key: '10' },
  { title: '违章地点', dataIndex: 'locationName', key: '11' },
  { title: '文书号', dataIndex: '', key: '12' },
  { title: '违章分类', dataIndex: '', key: '13' },
  { title: '违章原因', dataIndex: 'reason', key: '14' },
  { title: '采集机构', dataIndex: 'department', key: '15' },
  { title: '执行机关', dataIndex: 'excutedepartment', key: '16' },
  { title: '不可代办原因', dataIndex: 'canprocessMsg', key: '17' },
  { title: '数据源ID', dataIndex: '', key: '18' },
  { title: '驾驶证后六位 ', dataIndex: '', key: '19' },
  { title: '处理时间', key: '', fixed: 'right', width: 100,},
];



class AutoQuery extends React.Component {
  state = {
    activeIndex: 0,
    list:[],
    total:0,
    current: 1
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {provinceId, cityId} = this.state
        this.setState({carCode: values.carCode, carDriver: values.carDriver, carNumber: values.carNumber, carType:values.carType, provinceId: provinceId, cityId: cityId})
        this.fetchList(1,values.carCode,values.carDriver,values.carNumber,values.carType, provinceId,cityId,1)
      }
    });
  };

  onChange = (value) =>{
    this.setState({provinceId:value[0],cityId: value[1]})
  }

  componentDidMount(){
    cities.forEach(city => {
      const matchProvince = provinces.filter(
          province => province.code === city.provinceCode
      )[0];
      if (matchProvince) {
        matchProvince.children = matchProvince.children || [];
        matchProvince.children.push({
          label: city.name,
          value: city.code,
        });
      }
    });

    const options = provinces.map(province => ({
      label: province.name,
      value: province.code,
      children: province.children
    }));

    this.setState({options: options})
  }

  fetchList = (current,carCode='',carDriver='',carNumber='',carType='', provinceId='', cityId='', searchType=0) => {
    fetch('get',`/usercenter/violation/query?current=${current}&carCode=${carCode}&carDriver=${carDriver}&carNumber=${carNumber}&carType=${carType}&provinceId=${provinceId}&cityId=${cityId}&appKey=${this.props.appKey}&searchType=${searchType}`).then(res=>{
      if(res.code == 0){
        let list = res.data.records
        // list = this.state.list.concat(list);
        list.forEach((item,index)=>{
          // let type = item.type
          item.number = index+1;
          // switch (type){
          //   case '10':
          //     item.typeName = '新增'
          //     break
          //   case '11':
          //     item.typeName = '修改';
          //     break
          //   case '12':
          //     item.typeName = '删除';
          //     break
          // }
        })
        this.setState({list: list, total: res.data.total, current: current})
      }else{
        Message.destroy()
        Message.error(res.msg)
      }
    })
  }

  fetchMore = (page,pageSize) =>{
    this.fetchList(page.current, this.state.carCode, this.state.carDriver,this.state.carNumber,this.state.carType,this.state.provinceId,this.state.cityId)
  }


  render() {
    const { getFieldDecorator} = this.props.form;
    const { list, current, total } = this.state
    return (
        <div>
          <Row type="flex" justify="space-between">
            <Col span={18} style={{fontSize: 14, fontWeight: 500, marginBottom: 30}}>自助查询会扣取相应服务的剩余次数</Col>
            {/*<Col span={6} style={{textAlign: 'right'}}>*/}
              {/*<Button style={{marginLeft: 30}} type='primary' >返回</Button>*/}
            {/*</Col>*/}
          </Row>
          <Form layout="inline" onSubmit={this.handleSubmit} >
            <FormItem>
              {getFieldDecorator('carNumber', {
                rules: [],
              })(
                  <Input style={{width: '150px'}} placeholder="请输入车牌" maxLength={7} />
              )}

            </FormItem>
            <FormItem>
              {getFieldDecorator('carCode', {
                rules: [],
              })(
                  <Input style={{width: '150px'}} placeholder="请输入车架号" />
              )}

            </FormItem>
            <FormItem>
              {getFieldDecorator('carDriver', {
                rules: [],
              })(
                  <Input style={{width: '150px'}} placeholder="请输入发动机号" />
              )}

            </FormItem>
            <FormItem>
              {getFieldDecorator('carType', {
                rules: [],
              })(
                  <Select  dropdownMatchSelectWidth={false} allowClear={true} placeholder="请选择汽车类型">
                    {carType.map((item,index)=>
                        <Option value={item.key} key={index}>{item.name}</Option>
                    )}
                  </Select>
              )}
            </FormItem>

            <FormItem>
              <Cascader
                  options={this.state.options}
                  expandTrigger="hover"
                  onChange={this.onChange}
                  style={{ width: 150 }}
                  placeholder="请选择地址"
              />
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
          <Table className='mt15'
                 columns={columns}
                 dataSource={list}
                 scroll={{ x: 3000 }}
                 pagination={{total: total, current: current}}
                 onChange={(page,pageSize)=>{this.fetchMore(page,pageSize)}}
          />
        </div>

    );
  }
}



export default Form.create()(AutoQuery);