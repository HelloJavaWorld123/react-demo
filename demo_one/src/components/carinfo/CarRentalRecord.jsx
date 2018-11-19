/**
 *@author: RXK
 *@date:2018/10/29 13:56
 *@version: V1.0.0
 *@Des: 车辆合同记录
 **/
import React from 'react'
import {Button, Divider, Icon, Popconfirm, Table,Message} from 'antd'
import {fetch} from "../../api/tools";


class CarRentalRecord extends React.Component {

    state = {
        carNumber:null,
        insuranceFileList: [],
    };

    componentDidMount(){
        console.log(234567)
        console.log("从父级页面传入的车牌号是：",this.props.recordParam);
        this.setState({carNumber:this.props.recordParam});
        this.fetchRecordList(0, 10, this.props.recordParam);
    };

    deleteRentalRecord = (params) =>{
        console.log("要删除的记录是：", params);
        let param ={
            rentalId:params,
        };
        fetch('post', '/api/car/rental/del', param).then(res =>{
            if(res.code == 2000){
                Message.success(res.msg);
            }else{
                Message.destroy();
                Message.error(res.msg);
            }
        });
    };


    fetchRecordList = (page, pageSize, carNumber) => {
        let params = {
            pageNum:page,
            pageSize:pageSize,
            carNumber:carNumber
        };
        fetch('post', '/api/car/rental/list', params).then(res =>{
            if(res.code == 2000){
                console.log("从后台获取数据成功", res.data);
                this.setState({insuranceFileList:res.data});
            }else{
                Message.destroy();
                Message.error(res.msg);
            }
        });
    };

    render() {
        const {insuranceFileList,carNumber} = this.state;
        let recordList = [
            {title: '车牌号', dataIndex: 'carNumber'},
            {title: '车型', dataIndex: 'carType'},
            {title: '类型', dataIndex: 'strType'},
            {title: '客户姓名', dataIndex: 'userName'},
            {title: '手机号', dataIndex: 'userTelephone'},
            {title: '合同开始时间', dataIndex: 'strBeginTime'},
            {title: '合同结束时间', dataIndex: 'strEndTime'},
            {title: '租金', dataIndex: 'rentalMoney'},
            {title: '押金', dataIndex: 'cashPledge'},
            {title: '提车时间', dataIndex: 'strDeliveryTime'},
            {title: '还车时间', dataIndex: 'strRefundTime'},
            {
                title: '操作',
                render: (record) => (
                    record != null &&
                    <span>
                        <Button type="primary" size="small"
                                onClick={() => this.props.history.push(`/app/system/rental/add/${carNumber}/1`)}>详情</Button>
                        <Divider type="vertical"/>
                        <Button type="primary" size="small"
                                onClick={() => this.props.history.push(`/app/system/rental/add/${carNumber}/0`)}>编辑</Button>
                        <Divider type="vertical"/>
                        <Popconfirm
                            title="确定要删除吗？"
                            icon={<Icon type="question-circle-o" style={{color: 'red'}}/>}
                            onConfirm={() => this.deleteRentalRecord(record.id)}
                            onCancel={() => this.fetchRecordList(0, 10,carNumber)}
                        >
                        <Button type="danger" size="small">删除</Button>
                        </Popconfirm>
                    </span>
                ),
            }
        ];

        return (
            <div style={{background:'#fff'}}>
                <Button type="primary" size="small"
                onClick={() => this.props.history.push(`/app/system/rental/add/${carNumber}`)}
                >新增合同记录</Button>
                <Table
                    dataSource={insuranceFileList}
                    columns={recordList}
                />
            </div>
        );
    }

}

export default CarRentalRecord