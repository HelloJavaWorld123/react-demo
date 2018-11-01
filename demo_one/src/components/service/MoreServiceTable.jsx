/**
 * Created by hao.cheng on 2017/4/15.
 */
import React from 'react';
import { Table, Icon, Button, Message} from 'antd';
import {fetch} from '../../api/tools'
import * as config from '../../api/config';



const goDetail = (record) =>{
  window.location.href = `${config.BASE_PATH}service/${record.shopServiceId}`
}

const goApply = (record) => {
  window.location.href = `${config.BASE_PATH}checkoutCounter/${record.shopServiceId}`

}

const columns = [{
  title: '服务名称',
  dataIndex: 'serviceName',
  key: 'serviceName',
}, {
  title: '对接方式',
  dataIndex: 'accessType',
  key: 'accessType',
  width: 100,
},  {
  title: '服务类型',
  dataIndex: 'categoryName',
  key: '1',
},
  {
    title: '价格',
    dataIndex: 'price',
    key: '2',
  },
  {
    title: '简述',
    dataIndex: 'remarks',
    key: '3',
  },{
  title: '操作',
  key: 'action',
  width: 200,
  render: (text, record) => (
      <div>
       <Button type='primary' onClick={()=>goDetail(record)}>详情</Button>
       <Button type='primary' onClick={()=>goApply(record)}>申请</Button>
    </div>
  ),
}];


class MoreServiceTable extends React.Component {
  state={
    shopServices: [],
    total: 0,
    current: 1,
  }

  componentDidMount(){
    this.fetchData(1)
  }

  fetchData = (current) =>{
    fetch('get',`/usercenter/dataService/shopServices?current=${current}&size=10`).then(res=>{
      if(res.code == 0){
        this.setState({shopServices: res.data.records, total: res.data.total, current: current})
      }else{
        Message.destroy()
        Message.error(res.msg)
      }
    })
  }




  fetchMore = (page,pageSize) =>{
    this.fetchData(page.current)
  }


  render() {
    let {total, current } = this.state
    return (
        <Table
            columns={columns}
            dataSource={this.state.shopServices}
            pagination={{total: total, current: current}}
            onChange={(page,pageSize)=>{this.fetchMore(page,pageSize)}}
        />
    )
  }

}

export default MoreServiceTable;