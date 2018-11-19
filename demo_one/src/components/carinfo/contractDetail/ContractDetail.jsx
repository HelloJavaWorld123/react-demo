/**
 *@author: RXK
 *@date:2018/11/3 15:52
 *@version: V1.0.0
 *@Des: 合同详情
 **/

import React from 'react'
import { Form, Input, Button, Select, Card, InputNumber, DatePicker, message, AutoComplete } from 'antd'
import { fetch } from "../../../api/tools";
import monent from 'moment'
import style from './index.less'

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

class ContractDetail extends React.Component {
    state = {
        sourceType: 0,
        carInfoData: [],
        userInfoData: [],
    };


    upDetailMessage = (e) => {
        this.props.form.validateFieldsAndScroll((err, filedValues) => {
            if (!err) {
                if (this.props.match.params.source == 1) {
                    this.add(filedValues);
                } else {
                    this.recordUpdate(filedValues);
                }
            }
        });
    };

    recordUpdate = (filedValues) => {
        let param = {
            "id": this.props.match.params.id,
            "contractCode": filedValues.contractCode,
            "contractType": filedValues.contractType,
            "carNumber": filedValues.carInfo.substring(0, filedValues.carInfo.indexOf("/")),
            "carModelType": filedValues.carInfo.substr(filedValues.carInfo.indexOf("/") + 1, filedValues.carInfo.length),
            "rentalUserInfo": filedValues.rentalUserInfo,
            "guarantor": filedValues.guarantor,
            "phone": filedValues.phone,
            "idCard": filedValues.idCard,
            "totalAmount": filedValues.totalAmount,
            "beginTime": filedValues.beginTime.format("YYYY-MM-DD HH:mm:ss"),
            "endTime": filedValues.endTime.format("YYYY-MM-DD HH:mm:ss"),
            "paymentTime": filedValues.paymentTime.format("D"),
            "salesMan": filedValues.salesMan,
            "remark": filedValues.remark,
            "firstPaymentMoney": filedValues.firstPaymentMoney,
            "firstPaymentPayTime": filedValues.firstPaymentPayTime.format("YYYY-MM-DD"),
            "cashPledgeMoney": filedValues.cashPledgeMoney,
            "cashPledgePayTime": filedValues.cashPledgePayTime.format("YYYY-MM-DD"),
            "repaymentMoney": filedValues.repaymentMoney,
            "repaymentType": filedValues.repaymentType,
            "repaymentTotalPeriodes": filedValues.repaymentTotalPeriodes,
            "feeType": filedValues.feeType,
            "otherFeePayType": filedValues.otherFeePayType,
            "otherFeeMoney": filedValues.otherFeeMoney,
            "otherFeeTotalPeriodes": filedValues.otherFeeTotalPeriodes
        };
        fetch('post', '/api/contract/info/update', param).then(res => {
            if (res.code == 2000) {
                this.props.history.push(`/app/system/contractListInfo`);
            } else {
                message.destroy();
                message.error(res.msg);
            }
        });
    };


    add = (filedValues) => {
        let param = {
            "contractCode": filedValues.contractCode,
            "contractType": filedValues.contractType,
            "carNumber": filedValues.carInfo.substring(0, filedValues.carInfo.indexOf("/")),
            "carModelType": filedValues.carInfo.substr(filedValues.carInfo.indexOf("/") + 1, filedValues.carInfo.length),
            "rentalUserName": filedValues.rentalUserInfo.substr(0, filedValues.rentalUserInfo.indexOf("/")),
            "rentalUserPhone": filedValues.rentalUserInfo.substr(filedValues.rentalUserInfo.indexOf("/") + 1, filedValues.rentalUserInfo.length),
            "rentalUserInfo": filedValues.rentalUserInfo,
            "guarantor": filedValues.guarantor,
            "phone": filedValues.phone,
            "idCard": filedValues.idCard,
            "totalAmount": filedValues.totalAmount,
            "beginTime": filedValues.beginTime.format("YYYY-MM-DD HH:mm:ss"),
            "endTime": filedValues.endTime.format("YYYY-MM-DD HH:mm:ss"),
            "paymentTime": filedValues.paymentTime.format("D"),
            "salesMan": filedValues.salesMan,
            "remark": filedValues.remark,
            "firstPaymentMoney": filedValues.firstPaymentMoney,
            "firstPaymentPayTime": filedValues.firstPaymentPayTime.format("YYYY-MM-DD"),
            "cashPledgeMoney": filedValues.cashPledgeMoney,
            "cashPledgePayTime": filedValues.cashPledgePayTime.format("YYYY-MM-DD"),
            "repaymentMoney": filedValues.repaymentMoney,
            "repaymentType": filedValues.repaymentType,
            "repaymentTotalPeriodes": filedValues.repaymentTotalPeriodes,
            "feeType": filedValues.feeType,
            "otherFeePayType": filedValues.otherFeePayType,
            "otherFeeMoney": filedValues.otherFeeMoney,
            "otherFeeTotalPeriodes": filedValues.otherFeeTotalPeriodes
        };
        fetch('post', '/api/contract/info/add', param).then(res => {
            if (res.code == 2000) {
                this.props.history.push(`/app/system/contractListInfo`);
            } else {
                message.destroy();
                message.error(res.msg);
            }
        });
    };

    componentDidMount() {
        if (this.props.match.params.source != 1) {
            this.getRecordDetail();
        }

    };


    getRecordDetail = () => {
        let param = {
            id: this.props.match.params.id
        };
        fetch('post', '/api/contract/info/detail', param).then(res => {
            if (res.code == 2000) {
                console.log(res.data.paymentTime)

                this.props.form.setFieldsValue({
                    contractCode: res.data.contractCode,
                    contractType: res.data.contractType,
                    guarantor: res.data.guarantor,
                    totalAmount: res.data.totalAmount,
                    carInfo: res.data.carNumber + '/' + res.data.carModelType,
                    phone: res.data.phone,
                    beginTime: monent(res.data.beginTime),
                    endTime: monent(res.data.endTime),
                    paymentTime: monent(res.data.paymentTime, 'D'),
                    rentalUserInfo: res.data.rentalUserName + '/' + res.data.rentalUserPhone,
                    idCard: res.data.idCard,
                    salesMan: res.data.salesMan,
                    remark: res.data.remark,
                    firstPaymentMoney: res.data.firstPaymentMoney,
                    firstPaymentPayTime: monent(res.data.firstPaymentPayTime),
                    cashPledgeMoney: res.data.cashPledgeMoney,
                    cashPledgePayTime: monent(res.data.cashPledgePayTime),
                    repaymentMoney: res.data.repaymentMoney,
                    repaymentType: res.data.repaymentType,
                    repaymentTotalPeriodes: res.data.repaymentTotalPeriodes,
                    feeType: res.data.feeType,
                    otherFeePayType: res.data.otherFeePayType,
                    otherFeeTotalPeriodes: res.data.otherFeeTotalPeriodes,
                    otherFeeMoney: res.data.otherFeeMoney,
                });
            } else {
                message.destroy();
                message.error(res.msg);
            }
        });
    };

    getUserInfo = () => {
        this.setState({ userInfoData: ['张三/123456789', '李四/32654187'] })
    };

    getCarInfo = () => {
        let param = {
            type: 2,
        };
        fetch('post', '/api/car/info/carNumber', param).then(res => {
            if (res.code == 2000) {
                this.setState({ carInfoData: res.data });
            }
        });
    };


    checkNumber = (rule, value, callback) => {
        if (value && !(/^[1-9]+$|^[1-9]+[0-9]+$/.test(value))) {
            callback("请输入正确的数字");
        } else {
            callback();
        }
    };


    render() {
        const { carInfoData, userInfoData } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 15 },
        };

        const buttonItemLayout = {
            wrapperCol: { span: 14, offset: 4 },
        };

        return (
            <div className={'contractDetail'}>
                <Card title="合同编号">
                    <Form onSubmit={this.upDetailMessage}>
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <FormItem
                                    label="合同编号"
                                    hasFeedback
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator('contractCode', {
                                            rules: [{ required: true, message: '请填写合同编号' }], validateTrigger: 'onBlur'
                                        })(
                                            <Input />
                                        )
                                    }
                                </FormItem>
                                <FormItem
                                    label="类型"
                                    hasFeedback
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator('contractType', {
                                            rules: [{ required: true, message: '请选择合同的类型' }], validateTrigger: 'onBlur'
                                        })(
                                            <Select defaultValue={0}>
                                                <Option value={0}>直租</Option>
                                                <Option value={1}>已租代购</Option>
                                            </Select>
                                        )
                                    }
                                </FormItem>
                                <FormItem
                                    label="担保人"
                                    hasFeedback
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator('guarantor', {
                                            rules: [{ required: true, message: '请输出担保人名称' }]
                                        }, {})(
                                            <Input />
                                        )
                                    }
                                </FormItem>
                                <FormItem
                                    label="总金额"
                                    hasFeedback
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator('totalAmount', {
                                            rules: [{ required: true, message: '请输入合同金额' }]
                                        }, {})(
                                            <InputNumber min={1} placeholder="请输入金额" style={{width:'157px'}}/>
                                        )
                                    }
                                </FormItem>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>

                                <FormItem
                                    label="车辆"
                                    hasFeedback
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator('carInfo', {
                                            rules: [{ required: true, message: '请输入车辆信息', type: 'string' },],
                                            initialValue: this.state.carInfoData
                                        })(
                                            <AutoComplete
                                                placeholder="请输入车辆信息"
                                                filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                                                onChange={this.getCarInfo}
                                                dataSource={carInfoData}
                                            />
                                        )
                                    }
                                </FormItem>
                                <FormItem
                                    label="担保人手机"
                                    hasFeedback
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator('phone', {
                                            rules: [{ required: true, message: '请输出担保人手机号码' }]
                                        }, {})(
                                            <Input />
                                        )
                                    }
                                </FormItem>
                                <FormItem
                                    label="开始日期"
                                    hasFeedback
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator('beginTime', {
                                            rules: [{ required: true, message: '选择开始时间' }]
                                        }, {})(

                                            <DatePicker
                                                placeholder="选择开始时间"
                                                showTime
                                                format="YYYY-MM-DD HH:mm:ss"
                                            />
                                        )
                                    }
                                </FormItem>
                                <FormItem
                                    hasFeedback
                                    label="交款日"
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator('paymentTime', {
                                            rules: [{ required: true, message: '请选择每月的缴款日期' }]
                                        }, )(
                                            <DatePicker
                                                placeholder="每月交款日"
                                                format="D"
                                            />
                                        )
                                    }
                                </FormItem>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <FormItem
                                    label="承租司机"
                                    hasFeedback
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator('rentalUserInfo', {
                                            rules: [{ required: true, message: '请选择承租人的信息' }]
                                        }, )(
                                            <AutoComplete
                                                onChange={this.getUserInfo}
                                                dataSource={userInfoData}
                                            />
                                        )
                                    }
                                </FormItem>
                                <FormItem
                                    label="担保人身份证"
                                    hasFeedback
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator('idCard', {
                                            rules: [{ required: true, message: '请输出担保人省份证号码' }]
                                        }, {})(
                                            <Input />
                                        )
                                    }
                                </FormItem>
                                <FormItem
                                    label="结束日期"
                                    hasFeedback
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator('endTime', {
                                            rules: [{ required: true, message: '选择结束日期' }]
                                        }, {})(
                                            <DatePicker
                                                placeholder="选择结束时间"
                                                showTime
                                                format="YYYY-MM-DD HH:mm:ss"
                                            />
                                        )
                                    }
                                </FormItem>
                                <FormItem
                                    label="业务员"
                                    hasFeedback
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator('salesMan', {}, {})(
                                            <Input />
                                        )
                                    }
                                </FormItem>
                            </div>
                        </div>
                        <div>
                            <FormItem
                                label="备注"
                                labelCol={{ span: '3' }}
                                wrapperCol={{ span: '11' }}
                            >
                                {
                                    getFieldDecorator('remark')(
                                        <TextArea />
                                    )
                                }
                            </FormItem>
                        </div>
                        <Card title="首付款">
                            <p>
                                <FormItem
                                    hasFeedback
                                    label="金额"
                                    {...formItemLayout}
                                    style={{ display: 'inline-block', marginLeft: '50px' }}
                                >
                                    {
                                        getFieldDecorator('firstPaymentMoney', {
                                            rules: [{ required: true, message: '请输入金额' }]
                                        })(
                                            <Input />
                                        )
                                    }
                                </FormItem>
                                <FormItem
                                    hasFeedback
                                    label="支付日期"
                                    {...formItemLayout}
                                    style={{ display: 'inline-block', marginLeft: '200px' }}
                                >
                                    {
                                        getFieldDecorator('firstPaymentPayTime', {
                                            rules: [{ required: true, message: '请选择' }]
                                        })(
                                            <DatePicker
                                                format="YYYY-MM-DD"
                                            />
                                        )
                                    }
                                </FormItem>
                            </p>
                        </Card>
                        <Card title="押金" style={{ marginTop: '10px' }}>
                            <FormItem
                                hasFeedback
                                label="金额"
                                {...formItemLayout}
                                style={{ display: 'inline-block', marginLeft: '50px' }}
                            >
                                {
                                    getFieldDecorator('cashPledgeMoney', {
                                        rules: [{ required: true, message: '请输入金额' }]
                                    })(
                                        <Input />
                                    )
                                }
                            </FormItem>
                            <FormItem
                                hasFeedback
                                label="支付日期"
                                {...formItemLayout}
                                style={{ display: 'inline-block', marginLeft: '200px' }}
                            >
                                {
                                    getFieldDecorator('cashPledgePayTime', {
                                        rules: [{ required: true, message: '请选择' }]
                                    })(
                                        <DatePicker
                                            format="YYYY-MM-DD"
                                        />
                                    )
                                }
                            </FormItem>
                        </Card>
                        <Card title="月还款" style={{ marginTop: '10px' }}>
                            <FormItem
                                hasFeedback
                                label="金额"
                                {...formItemLayout}
                                style={{ display: 'inline-block',marginLeft:'10%'}}
                            >
                                {
                                    getFieldDecorator('repaymentMoney', {
                                        rules: [{ required: true, message: '请输入金额' }]
                                    })(
                                        <InputNumber style={{ width: '140px',marginRight:"40px"}} />
                                    )
                                }
                            </FormItem>
                            <FormItem
                                hasFeedback
                                label="支付方式"
                                {...formItemLayout}
                                style={{ display: 'inline-block', marginLeft: '10%' }}
                            >
                                {
                                    getFieldDecorator('repaymentType', {
                                        rules: [{ required: true, message: '请选择' }]
                                    })(
                                        <Select defaultValue={0} style={{width:'160px',marginRight:'26px'}}>
                                            <Option value={0}>月付</Option>
                                            <Option value={1}>年付</Option>
                                            <Option value={2}>一次性付</Option>
                                        </Select>
                                    )
                                }
                            </FormItem>
                            <FormItem
                                hasFeedback
                                label="总期数"
                                {...formItemLayout}
                                style={{ display: 'inline-block', marginLeft: '10%'}}
                            >
                                {
                                    getFieldDecorator('repaymentTotalPeriodes', {
                                        rules: [{ required: true, message: '请填写' }, { validator: this.checkNumber }],
                                        validateTrigger: 'onBlur'
                                    })(
                                        <Input suffix="期" style={{marginRight:'10px'}}/>
                                    )
                                }
                            </FormItem>
                        </Card>
                        <Card title="其他费用" style={{ marginTop: '10px' }}>
                            <FormItem
                                hasFeedback
                                label="费用类别"
                                {...formItemLayout}
                                style={{ display: 'inline-block', marginLeft: '10%' }}
                            >
                                {
                                    getFieldDecorator('feeType', {
                                        rules: [{ required: true, message: '请选择费用类别' }]
                                    })(
                                        <Select defaultValue={0} style={{marginRight:'30px'}}>
                                            <Option value={0}>直租</Option>
                                            <Option value={1}>管理费</Option>
                                            <Option value={2}>其他</Option>
                                        </Select>
                                    )
                                }
                            </FormItem>
                            <FormItem
                                hasFeedback
                                label="支付方式"
                                {...formItemLayout}
                                style={{ display: 'inline-block', marginLeft: '10%' }}
                            >
                                {
                                    getFieldDecorator('otherFeePayType', {
                                        rules: [{ required: true, message: '请选择支付方式' }]
                                    })(
                                        <Select defaultValue={0} style={{marginRight:'30px'}}>
                                            <Option value={0}>月付</Option>
                                            <Option value={1}>年付</Option>
                                            <Option value={2}>一次性付</Option>
                                        </Select>
                                    )
                                }
                            </FormItem>
                            <FormItem
                                hasFeedback
                                label="总期数"
                                {...formItemLayout}
                                style={{ display: 'inline-block', marginLeft: '10%' }}
                            >
                                {
                                    getFieldDecorator('otherFeeTotalPeriodes', {
                                        rules: [{ required: true, message: '请填写' }, { validator: this.checkNumber }],
                                        validateTrigger: 'onBlur'
                                    })(
                                        <Input suffix="期" />
                                    )
                                }
                            </FormItem>
                            <FormItem
                                hasFeedback
                                label="金额"
                                {...formItemLayout}
                                style={{ display: 'inline-block', marginLeft: '10%' }}
                            >
                                {
                                    getFieldDecorator('otherFeeMoney', {
                                        rules: [{ required: true, message: '请填写' }]
                                    })(
                                        <InputNumber style={{ width: '150px',marginRight:'44px'}} />
                                    )
                                }
                            </FormItem>
                        </Card>
                        {
                            this.props.match.params.source != '3ssss' && <div style={{ textAlign: 'center', paddingTop: '40px', fontSize: '16px' }}>
                                {
                                    this.props.match.params.source != 0 ?
                                        <FormItem {...buttonItemLayout}>
                                            <Button type="primary" size="small" htmlType="submit"
                                                style={{ width: '40%', height: '40px', fontSize: '16px' }}>提交</Button>
                                            <Button type="primary" size="small" htmlType="button"
                                                style={{ width: '40%', height: '40px', fontSize: '16px' }}
                                                onClick={() => this.props.history.push(`/app/system/contractListInfo`)}>取消</Button>
                                        </FormItem>
                                        :
                                        <FormItem {...buttonItemLayout}>
                                            <Button type="primary" size="default" htmlType="button"
                                                style={{ width: '80%', height: '40px', fontSize: '16px' }}
                                                onClick={() => this.props.history.push(`/app/system/contractListInfo`)}>取消</Button>
                                        </FormItem>
                                }
                            </div>
                        }

                    </Form>
                </Card>
            </div>
        );
    };
}

export default Form.create()(ContractDetail)