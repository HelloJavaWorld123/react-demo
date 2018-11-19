/**
 *@author: RXK
 *@date:2018/10/26 14:43
 *@version: V1.0.0
 *@Des: 维修记录页面
 **/


import React from 'react'
import {Form, Button, Card, Divider, Table, Message, Popconfirm, Icon} from 'antd'
import {fetch} from "../../api/tools";


class CarMaintainRecord extends React.Component {

    state = {
        carNumber: this.props.recordParam == null ? null : this.props.recordParam,
        rechargeTotal: 0,
        rechargeCurrent: 0,
        carMaintainRecordList: [],
    };

    maintainDetailRecord = (param) => {
        console.log("接收到的记录是：", param);
        this.props.history.push(`/app/system/maintain/add/${this.state.carNumber == null ? this.props.match.params.id : this.state.carNumber}/${param}/2`);
    };

    deleteMaintainRecord = (param) => {
        console.log("要删除的记录id：", param);
        let params = {
            maintainId: param,
        };
        fetch('post', '/api/car/maintain/del', params).then(res => {
            if (res.code == 2000) {
                this.fetchList(0, 10, this.state.carNumber);
            } else {
                Message.destroy();
                Message.error(res.msg);
            }
        });
    };

    componentDidMount() {
        this.fetchList(0, 10, this.state.carNumber == null ? this.props.match.params.id : this.state.carNumber);
    };

    //根据车牌号码查询维修列表
    fetchList(page, pageSize, carNumber) {
        let params = {
            pageNum: page,
            pageSize: pageSize,
            carNumber: carNumber,
        };
        fetch('post', '/api/car/maintain/list', params).then(res => {
            if (res.code == 2000) {
                console.log("请求成功返回的结果是：", res);
                console.log("从后台获取的到车牌号是L", res.data[0].carNumber);
                res.data = res.data.map((item,index)=>{
                    item.key=index
                    return item
                })
                this.setState({carMaintainRecordList: res.data,rechargeTotal:res.total,rechargeCurrent:res.pageNum,carNumber:res.data[0].carNumber});
            } else {
                Message.destroy();
                Message.error(res.msg);
            }
        });
    }

    render() {

        const {carMaintainRecordList, carNumber,rechargeCurrent,rechargeTotal} = this.state;
        console.log("车牌号是：", carNumber);

        const CAR_MAINTAIN_LIST = [
            {title: '车牌号', dataIndex: 'carNumber', index: '1'},
            {title: '维修金额', dataIndex: 'maintainMoney', index: '2'},
            {title: '维修时间', dataIndex: 'createTime', index: '3'},
            {title: '维修状态', dataIndex: 'strMaintainStatus', index: '4'},
            {title: '订单状态', dataIndex: 'strOrderStatus', index: '5'},
            {title: '车辆转态', dataIndex: 'strCarStatus', index: '6'},
            {title: '维修地址', dataIndex: 'maintainAddress', index: '7'},
            {title: '维修内容', dataIndex: 'maintainCount', index: '8'},
            {title: '延期天数', dataIndex: 'delayDays', index: '9'},
            {
                title: '操作',
                key: '10',
                render: (record) => (
                    <span>
                            <Button type="primary" size="small"
                                    onClick={() => this.maintainDetailRecord(`${record.maintainId}`)}>编辑</Button>
                            <Divider type="vertical"/>
                             <Popconfirm title="Are you sure？"
                                         icon={<Icon type="question-circle-o" style={{color: 'red'}}/>}
                                         onConfirm={() => this.deleteMaintainRecord(`${record.maintainId}`)}
                                         onCancel={() => this.fetchList(0,10,this.state.carNumber == null ? this.props.match.params.id : this.state.carNumber)}
                             >
                            <Button type="primary" size="small">删除</Button>
                             </Popconfirm>
                        </span>
                ),
            },
        ];

        
        return (
            <div style={{background:'#fff'}}>
                <Card title="维修记录表">
                    <Button size="small" type="primary"
                            onClick={() => this.props.history.push(`/app/system/maintain/add/${carNumber}/null/0`)}>
                        新增维修记录
                    </Button>
                    <Table
                        dataSource={carMaintainRecordList}
                        columns={CAR_MAINTAIN_LIST}
                        rowKey='key'
                        pagination={{total: rechargeTotal, current: rechargeCurrent}}
                        onChange={(page) =>{
                            this.fetchList(page.current,page.pageSize,this.state.carNumber)
                        }}
                    />
                </Card>
            </div>
        );
    }
}


export default Form.create()(CarMaintainRecord)