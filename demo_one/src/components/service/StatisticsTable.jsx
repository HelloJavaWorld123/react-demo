/**
 * Created by hao.cheng on 2017/4/15.
 */
import React from 'react';
import { Table, Icon } from 'antd';
import {fetch} from '../../api/tools'



class StatisticsTable extends React.Component {

  componentDidMount(){

  }





  render() {
    return (
        <Table columns={columns}  dataSource={this.props.statisticsData} pagination={false} bordered />
    )
  }
}



export default StatisticsTable;

const columns = [{
  title: '查询总次数',
  dataIndex: 'totalCount',
  key: 'totalCount',
  align: 'center'
}, {
  title: '有效次数',
  dataIndex: 'validCount',
  key: 'validCount',
  align: 'center'
},
//   {
//   title: '成功次数',
//   dataIndex: 'succCount',
//   key: 'succCount',
//   align: 'center'
// },
  {
  title: '查询成功率',
  dataIndex: 'searchSuccessRate',
  key: '1',
  align: 'center'
}];

const data = [{
  key: '1',
  name: '19000',
  age: 1800,
  address: '1000',
  rate: '80%'
}];