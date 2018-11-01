import React from 'react';
import {Table, Icon, Button, Message} from 'antd';
import {fetch} from '../../api/tools'
import * as config from '../../api/config';


const bugAgain = (record) => {
    window.location.href = `${config.BASE_PATH}checkoutCounter/${record.shopServiceId}`
}

const toDetail = (record, key) => {
    // let detailName = record.serviceName + record.accessType
    let detailName = record.serviceName
    localStorage.setItem('serviceName', detailName)
    window.location.href = `#/app/service/detail/${record.appKey}?key=${key}`
}

const columns = [
    {
        title: '服务名称', key: 'serviceName', render: (record) =>
            <div onClick={() => toDetail(record, 1)} className="cursor-p c-sub-color">{record.serviceName}</div>
    },
    {title: '对接方式', dataIndex: 'accessType', key: 'accessType'},
    {title: '剩余次数', dataIndex: 'lastCount', key: 'lastCount'},
    {title: '服务类型', dataIndex: 'categoryName', key: '1'},
    {title: '购买日期', dataIndex: 'buyTime', key: '2'},
    {title: '有效期至', dataIndex: 'validEndTime', key: '3'},
    {
        title: '操作', key: '4', render: (record) =>
            <div>
                {/*查询类按钮*/}
                {record.chargeWay != 1 && record.buttonSet && record.buttonSet.indexOf('1') > -1 &&
                <Button type='primary' size='small' onClick={() => bugAgain(record)}>再次购买</Button>}
                {record.chargeWay != 1 && record.buttonSet && record.buttonSet.indexOf('2') > -1 &&
                <Button type='primary' size='small' onClick={() => toDetail(record, 2)}>数据</Button>}
                {record.chargeWay != 1 && record.buttonSet && record.buttonSet.indexOf('3') > -1 &&
                <Button type='primary' size='small' onClick={() => toDetail(record, 3)}>自助查询</Button>}
                {record.chargeWay != 1 && record.buttonSet && record.buttonSet.indexOf('4') > -1 &&
                <Button type='primary' size='small' onClick={() => toDetail(record, 4)}>测试车牌</Button>}
                {/*代办类按钮*/}
                {record.chargeWay == 1 && record.buttonSet && record.buttonSet.indexOf('1') > -1 &&
                <Button type='primary' size='small' onClick={() => bugAgain(record)}>服务充值</Button>}
                {record.chargeWay == 1 && record.buttonSet && record.buttonSet.indexOf('2') > -1 &&
                <Button type='primary' size='small' onClick={() => toDetail(record, 2)}>数据</Button>}
                {record.chargeWay == 1 && record.buttonSet && record.buttonSet.indexOf('3') > -1 &&
                <Button type='primary' size='small' onClick={() => toDetail(record, 1)}>预付款清零</Button>}
                {record.chargeWay == 1 && record.buttonSet && record.buttonSet.indexOf('4') > -1 &&
                <Button type='primary' size='small' onClick={() => toDetail(record, 7)}>预付款流水</Button>}
                {record.chargeWay == 1 && record.buttonSet && record.buttonSet.indexOf('5') > -1 &&
                <Button type='primary' size='small' onClick={() => toDetail(record, 5)}>订单对账</Button>}
                {record.chargeWay == 1 && record.buttonSet && record.buttonSet.indexOf('6') > -1 &&
                <Button type='primary' size='small' onClick={() => toDetail(record, 3)}>自助查询</Button>}
                {record.chargeWay == 1 && record.buttonSet && record.buttonSet.indexOf('7') > -1 &&
                <Button type='primary' size='small' onClick={() => toDetail(record, 4)}>测试车牌</Button>}
            </div>
    },
];


const column1 = [{
    title: '序号',
}, {
    title: '购买日期',
}, {
    title: '有效期至',
}, {
    title: '总次数',
}, {
    title: '使用次数',
}, {
    title: '剩余次数',
}, {
    title: '价格',
}, {
    title: '属性',
}, {
    title: '状态',
}, {
    title: '备注',
}];


const SubTable = (props) =>
    <table style={{color: '#ababab'}}>
        {props.chargeWay != 1 && <tr>
            {column1.map((item, index) =>
                <th key={index}>{item.title}</th>
            )}
        </tr>}
        {props.data.map((item, index) =>
            <tr key={index} className='self-table'>
                {props.chargeWay != 1 && <td>{index + 1}</td>}
                {props.chargeWay == 1 && <td>{item.id}</td>}
                <td>{item.buyTime}</td>
                <td>{item.validEndTime}</td>
                <td>{item.totalCount}</td>
                <td>{item.usedCount}</td>
                <td>{item.lastCount}</td>
                <td>{item.price}</td>
                <td>{item.attributes}</td>
                <td>{item.status}</td>
                <td>{item.remarks}</td>
            </tr>
        )}
    </table>


class ExpandedTable extends React.Component {

    state = {
        serviceInfo: []
    }

    componentDidMount() {
        // let path = this.props.type == 1 ? '/usercenter/dataService/userService' : '/usercenter/dataService/listUserService?current=1&size=10'
        // fetch('get', path).then(res => {
        //     if (res.code == 0) {
        //         let serviceInfo = [];
        //         this.props.type == 1 && res.data && serviceInfo.push(res.data);
        //         this.props.type != 1 && res.data && (serviceInfo = res.data);
        //         this.setState({serviceInfo: serviceInfo, isRender: true})
        //     } else {
        //         this.setState({serviceInfo: [], isRender: true})
        //         Message.destroy()
        //         Message.error(res.msg)
        //     }
        // })
    }

    render() {
        return (
            <div>
                {this.state.isRender && <Table
                    defaultExpandAllRows={true}
                    pagination={false}
                    columns={columns}
                    expandedRowRender={record =>
                        <SubTable data={record.packages} chargeWay={record.chargeWay}/>
                    }
                    dataSource={this.state.serviceInfo}

                />}
            </div>
        )
    }
}


// onRow={(record) => {
//   return {
//     onClick: () => {this.props.goDetail(record)},       // 点击行
//   };
// }}

export default ExpandedTable
