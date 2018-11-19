/**
 *@author: RXK
 *@date:2018/11/3 14:01
 *@version: V1.0.0
 *@Des: 合同管理列表页
 **/

import React from 'react'
import {Table, Button, Divider, message, Popconfirm, Icon, Card} from 'antd'
import ButtonList from '../ButtonList'
import SearchItem from '../SearchItem'
import {fetch} from "../../../api/tools";
import styles from './contractListInfo.less'
class ContractListInfo extends React.Component {
    state = {
        activeIndex: 0,
        contractListInfo: [],
        pageTotal: 0,
        currentPage: 0,
        statisticData:[],
        tabIndex:null
    };


    changeToPage = (item,index) => {
        console.log("当前的index 是：", item.index);
        this.setState({activeIndex: item.index,tabIndex:index},);
        this.postDetail(0, 10, null, item.index);
    };

    componentDidMount() {
        this.postDetail(0, 10, null, null);
        this.statisticData();
    };
    statisticData=()=>{
        fetch('get', '/api/contract/info/data').then(res =>{
            if(res.code == 2000){
                this.setState({statisticData:res.data});
            }
        });
    };

    deleteRecord = (id) => {
        console.log("要删除的记录id是：", id);
        let Id = {
            contractCode: id,
        };
        fetch('post', '/api/contract/info/del', Id).then(res => {
            if (res.code == 2000) {
                message.success(res.msg);
                this.postDetail(0,10,null,null)
            } else {
                message.destroy();
                message.error(res.msg);
            }
        });
    };

    /**
     * 请求获取数据列表详情
     * @param page ：当前页
     * @param pageSize ：当前页数据条数
     * @param param ：额外搜索数据的条件
     * @param index ：页面表头的索引
     */
    postDetail = (page, pageSize, param, index) => {
    
        let params
        if(pageSize=='manualSearch'){
            console.log('_____________________',page)
            params= {
                pageNum: 0,
                pageSize: 10,
                contractCode:page.contractCode!=''?page.contractCode:null,
                rentalUserName: page.rentalUserName? page.rentalUserName : null,
                rentalUserPhone: page.rentalUserPhone? page.rentalUserPhone : null,
                contractType:this.state.tabIndex
            };
        }else{
            params= {
                pageNum: page,
                pageSize: pageSize,
                rentalUserName: param == null ? null : param.userName,
                rentalUserPhone: param == null ? null : param.userPhone,
                contractType: index == null ? null : index,
            };
        }
        console.log(params)
        console.log("开始请求获取数据详情");
         
        fetch('post', '/api/contract/info/list', params).then(res => {
            if (res.code == 2000) {
                console.log("从后台获取到的数据是：", res.data);
                this.setState({contractListInfo: res.data, pageTotal: res.total, currentPage: res.pageNum});
            } else {
                message.destroy();
                message.error(res.msg);
            }
        });
    };


    render() {
        const {contractListInfo, pageTotal, currentPage,statisticData,tabIndex} = this.state;
        let contractList = [
            {title: '合同编号', dataIndex: 'contractCode'},
            {title: '合同状态', dataIndex: 'contractStatus'},
            {title: '合同类型', dataIndex: 'contractType'},
            {title: '车辆', dataIndex: 'carNumber'},
            {title: '承租人', dataIndex: 'rentalUserName'},
            {title: '缴款日(号/每月)', dataIndex: `paymentTime`},
            {title: '开始时间', dataIndex: 'beginTime'},
            {title: '结束时间', dataIndex: 'endTime'},
            // {title: '提车日期', dataIndex: 'deliveryTime'},
            // {title: '最后一次还款日期', dataIndex: 'latestRepaymentTime'},
            {
                title: '操作',
                render: (record) => (
                    record != null &&
                    <span>
                        <Button htmlType="button" size="small" type="pr imary"
                                onClick={() => this.props.history.push(`/app/system/contractDetail/${record.id}/3`)}>详情</Button>
                        <Divider type="vertical"/>
                        <Button htmlType="button" size="small" type="primary"
                                onClick={() => this.props.history.push(`/app/system/contractDetail/${record.id}/2`)}>编辑</Button>
                        <Divider type="vertical"/>
                         <Popconfirm
                             title="确定要删除吗？"
                             icon={<Icon type="question-circle-o" style={{color: 'red'}}/>}
                             onConfirm={() => this.deleteRecord(record.contractCode)}
                             onCancel={() => this.postDetail(0, 10, null, null)}
                         >
                        <Button type="primary" htmlType="button" size="small">删除</Button>
                         </Popconfirm>
                    </span>
                )
            },
        ];

        if(statisticData != null){
            BUTTON_TOP.concat(BUTTON_DOWN).map((item,index) => {
                item.value = statisticData[index];
            });
        }

        return (
            <div className={'contractListInfo'}>
                {/* <ButtonList data={BUTTON_TOP.concat(BUTTON_DOWN)} action={this.changeToPage}/> */}
                <div className='headerButtonBox' >
                    <div>
                        {BUTTON_TOP.concat(BUTTON_DOWN).map((item,index) =>
                            <div className={'bottonItem '+ (index==tabIndex?' activeStyles':'')} key={index+'BUTTON_TOP'}>
                                <div className="buttonList cursorPointer" onClick={() =>this.changeToPage(item,index)}>
                                    <p>{item.title}</p>
                                    <p>{item.value}</p>
                                </div>
                                <i></i>
                            </div>
                        )}
                    </div>
                </div>
                <div className={'SearchItem'}>
                    <SearchItem param={Data} action={this.postDetail} buParam={Button_Data} history={this.props.history}/>
                </div>
                <Card title={this.state.activeIndex == 0 ? "合同列表": BUTTON_TOP.concat(BUTTON_DOWN).map((item) => {
                    if (item.index == this.state.activeIndex) {
                        return item.title
                    }
                })}>
                    <Table
                        dataSource={contractListInfo}
                        columns={contractList}
                        pagination={{total: pageTotal, current: currentPage}}
                    />
                </Card>
            </div>
        );
    };
}

const Button_Data = [
    {source: '2', name: '新增合同'},
];

const Data = [
    {param: '合同编号', paramName: 'contractCode'},
    {param: '承租人姓名', paramName: 'rentalUserName'},
    {param: '承租人手机', paramName: 'rentalUserPhone'},
];

const BUTTON_TOP = [
    {title: '异常合同',value:200, index: 1},
    {title: '执行中合同',value:200, index: 2},
    {title: '快到期合同', value:200,index: 3},
    {title: '还款逾期合同', value:200,index: 4},
];

const BUTTON_DOWN = [
    {title: '待审核合同', value:200,index: 5},
    {title: '待签约合同', value:200,index: 6},
    {title: '待交车合同', value:200,index: 7},
    {title: '首款待付合同',value:200, index: 8},
];


export default ContractListInfo