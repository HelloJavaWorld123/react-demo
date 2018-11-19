import React from 'react';
import {Button, Form, Message, Modal,Input,Select,Divider,Row,Col,Tabs,Card} from 'antd';
import {fetch} from '../../api/tools'
import {fetchData, receiveData} from '@/action';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import  UnVerified  from './UnVerified'
import  Verified  from './Verified'
import ContractPaymentRecordList from './ContractPaymentRecordList'
import PlanPaymentRecordList from './PlanPaymentRecordList'
import ContractCarDetail from './ContractCarDetail'

const TabPane = Tabs.TabPane;

class ContractRiskDetail extends React.Component {
    state = {
        activeIndex: 0,
        contractInfo: {},
        contractFirstPayment: {},
        contractCashPledge: {},
        contractOtherFeeList: [],
        contractRepaymentRecord: {},
    };


    updateOnChange = () => {

    }

    callback = () => {

    }


    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {pageNum, pageSize} = this.state;
                this.onChange(pageNum, pageSize, values);
            }
        });
    };

    verificationSubmit = (url, params) => {
        const {contractInfo} = this.state;
        params.contractCode = contractInfo.contractCode;
        console.log("提交了");
        console.log(params);
        fetch('post', url, params).then(res => {
            if (res.code === 2000) {
                Message.success('提交成功')
                this.findOne();
            }
        })
    }


    findOne = () => {
        const id = this.props.match.params.id;
        fetch('get', 'chedui/contract/risk/' + id).then(res => {
            if (res.code === 2000) {
                console.log('_____________________', res)
                // let { contractIdCardVerification}=res.data


                this.setState({
                    contractInfo: res.data.contractInfo,
                    contractFirstPayment: res.data.contractFirstPayment === null ? {} : res.data.contractFirstPayment,
                    contractCashPledge: res.data.contractCashPledge === null ? {} : res.data.contractCashPledge,
                    contractRepaymentRecord: res.data.contractRepaymentRecord === null ? {} : res.data.contractRepaymentRecord,
                    contractOtherFeeList: res.data.contractOtherFeeList === null ? [] : res.data.contractOtherFeeList,
                    contractPhoneVerification: res.data.contractPhoneVerification,
                    contractIdCardVerification: res.data.contractIdCardVerification,
                    blacklistRecord: res.data.blacklistRecord,
                    contractDiscreditRecord: res.data.contractDiscreditRecord,
                })
            }
        })

    }


    componentDidMount() {
        this.findOne();
    }


    render() {

        let payTypeStatus = {
            0:'月付',
            1:'年付',
            2:'一次性付'
        }


        let feeTypeStatus = {
            0:'首付款',
            1:'押金',
            2:'租金',
            3:'管理费',
            4:'其他'
        }

        const {
            contractInfo, contractFirstPayment, contractCashPledge,
            contractRepaymentRecord, contractOtherFeeList,
            contractPhoneVerification, contractIdCardVerification,
            blacklistRecord, contractDiscreditRecord
        } = this.state;
        let contractInfos = [
            {line: [{title: '车牌号', value: contractInfo.carNumber}, {title: '车型', value: contractInfo.carModelType}]},
            {
                line: [{title: '承租司机', value: contractInfo.rentalUserName}, {
                    title: '承租人手机',
                    value: contractInfo.rentalUserPhone
                }]
            },
            {
                line: [{title: '合同总金额', value: contractInfo.totalAmount}, {
                    title: '缴款日',
                    value: contractInfo.paymentTime
                }]
            },
            {line: [{title: '担保人', value: contractInfo.guarantor}, {title: '担保人手机号', value: contractInfo.phone}]},
            {line: [{title: '担保人身份证', value: contractInfo.idCard}, {title: '开始时间', value: contractInfo.beginTime}]},
            {line: [{title: '结束时间', value: contractInfo.endTime}, {title: '业务人', value: contractInfo.createBy}]},
            {
                line: [{title: '提车日期', value: contractInfo.deliveryTime}, {
                    title: '备注',
                    value: contractInfo.remark
                }, {title: '', value: ""}]
            },
        ];
        let contractFirstPayments = [
            {title: '金额', value: contractFirstPayment.money},
            {title: '支付日期', value: contractFirstPayment.payTime},
        ];
        let contractCashPledges = [
            {title: '金额', value: contractCashPledge.money},
            {title: '支付日期', value: contractCashPledge.payTime},
        ];
        let contractRepaymentRecords = [
            {title: '金额', value: contractRepaymentRecord.money},
            {title: '支付类别', value: payTypeStatus[contractRepaymentRecord.paymentType]},
            {title: '总期数', value: contractRepaymentRecord.totalPeriods},
        ];


        let contractOtherFeeLists = [];
        for (let contractOtherFee of contractOtherFeeList) {
            let contractOtherFees = [
                {title: '费用类型', value: feeTypeStatus[contractOtherFee.feeType]},
                {title: '金额', value: contractOtherFee.money},
                {title: '支付类别', value: payTypeStatus[contractOtherFee.payType]},
                {title: '总期数', value: contractOtherFee.totalPeriods}
            ]
            contractOtherFeeLists.push(contractOtherFees);
        }

        let statusObject = {
            '0': '不通过',
            '1': '通过',
            '2': '核查中'
        };



        const cardStyle = {background: 'white', margin: '10px 0px'}

        return (

            <div>
                <div style={{background: 'white', padding: '26px 16px 16px', margin: '20px 0px'}}>
                    <Row><h1 style={{fontSize: '20px'}}>合同编号: {contractInfo.contractCode}</h1></Row>
                    <Divider style={{margin: '10px 0'}}></Divider>
                    {contractInfos.map((item, index) =>
                        <Row key={index} style={{padding: '10px'}}>
                            <div>
                                <Col span={12} style={{textAlign: 'left'}}>
                                    <span style={{
                                        fontSize: '15px',
                                        fontWeight: '500'
                                    }}>{item.line[0].title + ' : '}</span>
                                    <span style={{fontSize: '15px'}}>{item.line[0].value}</span>
                                </Col>
                                <Col span={12}>
                                    <span style={{
                                        fontSize: '15px',
                                        fontWeight: '500'
                                    }}>{item.line[1].title + ' : '}</span>
                                    <span style={{fontSize: '15px'}}>{item.line[1].value}</span>
                                </Col>
                            </div>


                            {/*{index>=2 && <div>
                        <Col span={12} style={{textAlign: 'left'}}>
                            <p style={{fontSize:'15px'}}>{item.line[0].title+' : '+item.line[0].value}</p>
                        </Col>
                        <Col span={12}>
                            <p style={{fontSize:'15px'}}>{item.line[1].title+' : '+item.line[1].value}</p>
                        </Col>
                    </div>}*/}
                        </Row>
                    )}
                </div>

                <Tabs defaultActiveKey="1" onChange={this.callback} type='card'>
                    <TabPane tab="财务约定" key="1">
                        <Card title={<h3>首付款</h3>} bordered={false} style={cardStyle}>
                            <Row>
                                {contractFirstPayments.map((item, index) =>
                                    <Col span={5}>
                                        <p style={{fontSize: '15px'}}>{item.title + " : " + item.value}</p>
                                    </Col>
                                )}
                            </Row>
                        </Card>
                        <Card title={<h3>押金</h3>} bordered={false} style={cardStyle}>
                            <Row>
                                {contractCashPledges.map((item, index) =>
                                    <Col span={5}>
                                        <p style={{fontSize: '15px'}}>{item.title + " : " + item.value}</p>
                                    </Col>
                                )}
                            </Row>
                        </Card>
                        <Card title={<h3>月还款</h3>} bordered={false} style={cardStyle}>
                            <Row>
                                {contractRepaymentRecords.map((item, index) =>
                                    <Col span={5}>
                                        <p style={{fontSize: '15px'}}>{item.title + " : " + item.value}</p>
                                    </Col>
                                )}
                            </Row>
                        </Card>
                        {contractOtherFeeLists.map((contractOtherFees, index) =>
                            <Card title={<h3>其他费用</h3>} key={index} bordered={false} style={cardStyle}>
                                <Row>
                                    {contractOtherFees.map((item, index) =>
                                        <Col span={5} key={index}>
                                            <p style={{fontSize: '15px'}}>{item.title + " : " + item.value}</p>
                                        </Col>
                                    )}
                                </Row>
                            </Card>
                        )}
                    </TabPane>
                    <TabPane tab="付款计划" key="2" style={cardStyle}>
                        <PlanPaymentRecordList contractCode={contractInfo.contractCode}/>
                    </TabPane>
                    <TabPane tab="应收账单" key="3" style={cardStyle}>
                        <ContractPaymentRecordList carNumber={contractInfo.carNumber}
                                                   contractCode={contractInfo.contractCode}
                                                   userName={contractInfo.rentalUserName}/>
                    </TabPane>
                    <TabPane tab="车辆信息" key="4">
                        <ContractCarDetail carNumber={contractInfo.carNumber}/>
                    </TabPane>
                </Tabs>
                {contractIdCardVerification == null ?
                    <UnVerified cardStyle={cardStyle} verificationSubmit={this.verificationSubmit} _this={this}
                                url={'chedui/contract/risk/idCardVerification'} title={'身份证真假核实(待核实)'}/> :
                    <Verified cardStyle={cardStyle} verification={contractIdCardVerification}
                              title={`身份证真假核实(${statusObject[contractIdCardVerification.checkStatus]})`}/>}
                {contractPhoneVerification == null ?
                    <UnVerified cardStyle={cardStyle} verificationSubmit={this.verificationSubmit}
                                url={'chedui/contract/risk/phoneVerification'} title={'手机实名(待核实)'}/> :
                    <Verified cardStyle={cardStyle} verification={contractPhoneVerification}
                              title={`手机实名(${statusObject[contractPhoneVerification.checkStatus]})`}/>}
                {contractDiscreditRecord == null ?
                    <UnVerified cardStyle={cardStyle} verificationSubmit={this.verificationSubmit}
                                url={'chedui/contract/risk/discredit'} title={'公民失信记录(待核实)'}/> :
                    <Verified cardStyle={cardStyle} verification={contractDiscreditRecord}
                              title={`公民失信记录(${statusObject[contractDiscreditRecord.checkStatus]})`}/>}
                {blacklistRecord == null ?
                    <UnVerified cardStyle={cardStyle} verificationSubmit={this.verificationSubmit}
                                url={'chedui/contract/risk/blacklist'} title={'租车黑名单记录(待核实)'}/> :
                    <Verified cardStyle={cardStyle} verification={blacklistRecord}
                              title={`租车黑名单记录(${statusObject[blacklistRecord.checkStatus]})`}/>}
            </div>


        );
    }
}
const mapStateToProps = state => {
    const { usersWallet = {data: {}} , userInfo = {data: {}}} = state.httpData;
    return {usersWallet, userInfo};
};



const mapDispatchToProps = dispatch => ({
    fetchData: bindActionCreators(fetchData, dispatch),
});



/*export default Form.create()(ContractRiskDetail);*/
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ContractRiskDetail))