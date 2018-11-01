
import React from 'react';
import { Row, Col,Card, Button, Icon,  Divider, Message,  Table, Form, Select, Input, DatePicker} from 'antd';
import {fetch} from '../../api/tools'

const FormItem = Form.Item;
const Option = Select.Option;

class OperationLog extends React.Component {
  state = {
    logs: [],
    total:0,
    type: 0,
    current: 1,
    module: 0,
    startDate:'',
    endDate:''
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let startDate = values.startDate && values.startDate.format('YYYY-MM-DD')||''
        let endDate = values.endDate && values.endDate.format('YYYY-MM-DD')||''
        let type = values.type || 0
        let module = values.module || 0
        let current = 1
        this.setState({current: current,logs:[], startDate: startDate, endDate: endDate, type: type, module: module},()=>{
          this.fetchLog(current,type,module,startDate,endDate)
        })
      }
    });
  };

  componentDidMount(){
   this.fetchLog(1, 0, 0,'','')
  }

  fetchLog = (current,type,module,startDate,endDate) => {
    fetch('get',`/admin/log/list?current=${current}&type=${type}&module=${module}&startDate=${startDate}&endDate=${endDate}`).then(res=>{
      if(res.code == 0){
        let logs = res.data.records
        // logs = this.state.logs.concat(logs);
        logs.forEach((item,index)=>{
          let type = item.type
          item.number = (current-1)*10+index+1;
          switch (type){
            case '10':
              item.typeName = '新增'
              break
            case '11':
              item.typeName = '修改';
              break
            case '12':
              item.typeName = '删除';
              break
          }
        })
        this.setState({logs: logs, total: res.data.total, current: current})
      }else{
        Message.destroy()
        Message.error(res.msg)
      }
    })
  }

  fetchMore = (page,pageSize) =>{
    this.fetchLog(page.current, this.state.type, this.state.module,this.state.startDate,this.state.endDate)
  }


  render() {
    const { getFieldDecorator} = this.props.form;
    let { logs, total, current } = this.state


    return (
        <div className="gutter-example">
          <Card>
            <Form layout="inline" className="mb15" onSubmit={this.handleSubmit} >
              <FormItem>
                {getFieldDecorator('type', {
                  rules: [],
                })(
                    <Select  dropdownMatchSelectWidth={false} allowClear={true} placeholder="请选择操作类型">
                      {operateType.map((item,index)=>
                          <Option value={item.key} key={index}>{item.name}</Option>
                      )}
                    </Select>
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('module', {
                  rules: [],
                })(
                    <Select  dropdownMatchSelectWidth={false} allowClear={true} placeholder="请选择操作模块">
                      {operateModual.map((item,index)=>
                          <Option value={item.key} key={index}>{item.name}</Option>
                      )}
                    </Select>
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('startDate', {
                  rules: [],
                })(
                    <DatePicker placeholder={'请选择操作开始日期'}/>
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('endDate', {
                  rules: [],
                })(
                    <DatePicker placeholder={'请选择操作结束日期'}/>
                )}
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
            <Table  columns={columns} dataSource={logs} pagination={{total: total, current: current}} onChange={(page,pageSize)=>{this.fetchMore(page,pageSize)}}/>
          </Card>
        </div>
    );
  }
}

const operateType = [
  {key:0,name:'全部'},
  {key:10,name:'新增'},
  {key:11,name:'修改'},
  {key:12,name:'删除'},
]

const operateModual = [
  {key:0,name:'全部'},
  {key:'服务管理',name:'服务管理'},
  {key:'样式管理',name:'样式管理'},
  {key:'账户设置',name:'账户设置'},
  {key:'限时优惠',name:'限时优惠'},
  {key:'优惠券管理',name:'优惠券管理'},
  {key:'用户管理',name:'用户管理'},
]

const columns= [
  { title: '序号', dataIndex: 'number', key: 'number' },
  { title: '时间 ', dataIndex: 'createTime', key: 'createTime' },
  { title: '操作类型', dataIndex: 'typeName', key: '1' },
  { title: '操作模块', dataIndex: 'title', key: '2' },
  { title: '操作详情', dataIndex: 'context', key: '3' },
];





export default Form.create()(OperationLog);