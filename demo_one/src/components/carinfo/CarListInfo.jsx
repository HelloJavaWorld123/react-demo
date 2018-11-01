/**
 *@author: RXK
 *@date:2018/10/20 21:10
 *@version: V1.0.0
 *@Des: 车辆管理列表页面
 **/
import React from 'react'
import {Button, Card, Table, Message, Input, Divider, Popconfirm, Icon} from 'antd'
import {fetch} from "../../api/tools";

const Search = Input.Search;

class CarListInfo extends React.Component {

    state = {
        activeIndex: 0,
        rechargeTotal: 0,
        rechargeCurrent: 0,
        carListInfo: [], //车辆基本信息
        carTitleName: [],
        dataInfo: [],
        carNumberList:[],
    };

    onChange = (item) => {
        console.log("点击的按钮的数量是：", item.index);
        console.log("点击的按钮的标题是：", item.title);
        this.setState({
            activeIndex: item.index,
            carTitleName: item,
        });
        this.fetchDetail(0, 10, null, item.index)
    };
    deleteRecord = (params) => {
        console.log("要删除的记录id是：", params);
        let param = {
            id: params,
        };
        fetch('post', '/api/car/info/delete', param).then(res => {
            if (res.code == 2000) {
                Message.destroy();
                Message.success(res.msg);
                this.fetchDetail(0, null, null, 0)
            } else {
                Message.destroy();
                Message.error(res.msg);
            }
        });
    };

    fetchDetail = (current, pageSize, carNumber, itemIndex) => {
        let listParam = {
            pageNum: current == null ? 0 : current,
            pageSize: pageSize == null ? 10 : pageSize,
            carNumber: carNumber,
            type: itemIndex,
        };
        fetch('post', '/api/car/info/list', listParam).then(res => {
            if (res.code == 2000) {
                console.log("从后台获取到的数据是：", res);
                this.setState({
                    carListInfo: res.data,
                    rechargeTotal: res.total,
                    rechargeCurrent: current,
                });
            } else {
                this.setState({carListInfo: null});
                Message.destroy();
                Message.error(res.msg);
            }
        })
    };

    searchByCarNumber = (e) => {
        console.log("输出框中输入的内容是：", e);
        let params = {
            carNumber: e.target.value,
        };
        fetch('post', `/api/car/info/carNumber`,params).then(res => {
            if(res.code == 2000){
                this.setState({carNumberList: res.data});
            }
        });
    };


    componentDidMount() {
        this.fetchDetail(0, 10, null, 0);
        this.fetchAllData();
    };

    fetchAllData() {
        console.log("开始获取数据");
        fetch('get', '/api/car/info/data').then(res => {
            if (res.code == 2000) {
                console.log("获取到的数据时：", res.data);
                this.setState({dataInfo: res.data});
            }
        });
    };


    render() {
        let {carListInfo, rechargeTotal, rechargeCurrent, carTitleName, dataInfo,carNumberList} = this.state;
        console.log("统计的数据信息是：", dataInfo);
        let CAR_LIST = [
            {title: '车牌号', dataIndex: 'carNumber', key: 'carNumber'},
            {title: '车架号', dataIndex: 'carFrameNumber', key: 'carFrameNumber'},
            {title: '型号', dataIndex: 'carModelType', key: 'carModelType'},
            {title: '引擎号码', dataIndex: 'carEngineNumber', key: 'carEngineNumber'},
            {title: '所属公司', dataIndex: 'carCompany', key: 'carCompany'},
            {title: '车身颜色', dataIndex: 'strCarBodyColor', key: 'carBodyColor'},
            {title: '采购时间', dataIndex: 'buyTime', key: 'buyTime'},
            {title: '入库时间', dataIndex: 'incomingTime', key: 'incomingTime'},
            {title: '更新时间', dataIndex: 'updateTime', key: 'updateTime'},
            {
                title: '操作', key: 'action',
                render: (text, record) => (
                    record != null &&
                    <span>
                        <Button type="primary" size="small"
                                onClick={() => this.props.history.push(`/app/system/carAdd/${record.id}/1`)}>详情</Button>
                        <Divider type="vertical"/>
                        <Button type="primary" size="small"
                                onClick={() => this.props.history.push(`/app/system/carAdd/${record.id}/2`)}>编辑</Button>
                        <Divider type="vertical"/>
                        <Popconfirm
                            title="确定要删除吗？"
                            icon={<Icon type="question-circle-o" style={{color: 'red'}}/>}
                            onConfirm={() => this.deleteRecord(record.id)}
                            onCancel={() => this.fetchDetail(0, 10, null, 0)}
                        >
                        <Button type="danger" size="small">删除</Button>
                        </Popconfirm>
                    </span>
                ),
            },
        ];
        if (dataInfo != null) {
            BUTTON_TOP.map((item, index) => {
                item.value = dataInfo[index];
            });

            BUTTON_DOWN.map((item) => {
                item.value = dataInfo[item.index];
            });
        }
        return (
            <div>
                <div style={{background: 'rgb(190, 200, 200)', padding: '26px 16px 16px'}}>
                    {BUTTON_TOP.map((item) =>
                        <Button type="primary" ghost className="button-list" onClick={() => this.onChange(item)}>
                            <p>{item.title}</p><p>{item.value}</p>
                        </Button>
                    )}
                </div>
                <br/>
                <div style={{background: 'rgb(190, 200, 200)', padding: '26px 16px 16px'}}>
                    {BUTTON_DOWN.map((item) =>
                        <Button type="primary" ghost className="button-list" onClick={() => this.onChange(item)}>
                            <p>{item.title}</p><p>{item.value}</p>
                        </Button>
                    )}
                </div>
                <br/>
                <div style={{marginLeft: '200'}}>
                    <Search
                        placeholder="车牌号"
                        enterButton="搜索"
                        style={{width: 200}}
                        onSearch={value => this.fetchDetail(0, 10, value, 0)}
                    />
                    <span style={{marginLeft: '450'}}>
                        <Button type="primary"
                                onClick={() => this.props.history.push(`/app/system/carAdd/null/3`)}>增加车辆</Button>
                    </span>
                </div>
                <br/>
                <Card title={(carTitleName.title) == null ? "车辆列表" : (carTitleName.title)}>
                    <Table
                        dataSource={carListInfo}
                        pagination={{total: rechargeTotal, current: rechargeCurrent}}
                        columns={CAR_LIST}
                        onChange={(page) => {
                            console.log("page是：", page);
                            this.fetchDetail(page.current, page.pageSize, null, 0)
                        }}
                    />
                </Card>
            </div>
        );
    }
}


const BUTTON_DOWN = [
    {title: '出险车辆', value: 1800, index: '6'},
    {title: '违章车辆', value: 1800, index: '7'},
    {title: '需年检车辆', value: 1800, index: '8'},
    {title: '需续保车辆', value: 1800, index: '9'},
    {title: 'GPS离线车辆', value: 1800, index: '10'},
    {title: '租约到期车辆', value: 1800, index: '11'},
];

const BUTTON_TOP = [
    {title: '全部车辆', value: 2000, index: '0'},
    {title: '待租车辆', value: 2000, index: '1'},
    {title: '需维修车辆', value: 2000, index: '2'},
    {title: '已直租车辆', value: 2000, index: '3'},
    {title: '已直购车辆', value: 2000, index: '4'},
    {title: '退出运营车辆', value: 2000, index: '5'},
];

export default CarListInfo