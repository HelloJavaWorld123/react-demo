

import React from 'react';
import { Table, Icon } from 'antd';

const columns = [{
  title: '序号',
  dataIndex: 'id',
  key: 'id',
}, {
  title: '购买日期',
  dataIndex: 'buyTime',
  key: 'buyTime',
}, {
  title: '有效期至',
  dataIndex: 'validEndTime',
  key: 'validEndTime',
}, {
  title: '剩余次数',
  dataIndex: 'lastCount',
  key: '1',
},{
  title: '价格',
  dataIndex: 'price',
  key: '2',
},{
  title: '属性',
  dataIndex: 'attributes',
  key: '3',
},{
  title: '备注',
  dataIndex: 'remarks',
  key: '4',
}];

const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}];

const DetailTable = (props) => (
    <Table columns={columns} dataSource={props.data} />
);

export default DetailTable;