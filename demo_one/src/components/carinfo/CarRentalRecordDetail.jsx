/**
*@author: RXK
*@date:2018/10/29 15:45
*@version: V1.0.0
*@Des: 合同记录 新增以及 详细页面
 **/

import React from 'react'
import {Button, Card, Col, DatePicker, Form, Input, Row, Select,Message} from 'antd'
import {fetch} from "../../api/tools";

const FormItem = Form.Item;
const Option = Select.Option;

class CarRentalRecordDetail  extends React.Component{

    state = {
        carNumber: null,
    };

    componentDidMount(){
        console.log("从连接中获取到的车牌号是：", this.props.match.params.carNumber);
        this.setState({carNumber:this.props.match.params.carNumber});
        this.props.form.setFieldsValue({carNumber:this.props.match.params.carNumber})
    };





    createNew = (e)=>{
        e.preventDefault();
        this.props.form.validateFields((err,fieldValues) =>{
            if(!err){
                console.log("提交的数据时：",fieldValues);
                let params = {
                    carNumber:fieldValues.carNumber,
                    carType:fieldValues.carType,
                    type:fieldValues.type,
                    contractCode:fieldValues.contractCode,
                    deliveryTime:fieldValues.deliveryTime,
                    refundTime:fieldValues.refundTime,
                    status:fieldValues.status,
                    cashPledgeStatus:fieldValues.cashPledgeStatus,
                    rentalMoney:fieldValues.rentalMoney,
                    cashPledge:fieldValues.cashPledge,
                    beginTime:fieldValues.beginTime,
                    endTime:fieldValues.endTime,
                    nextMouthRentalMoney:fieldValues.nextMouthRentalMoney,
                    manageMoney:fieldValues.manageMoney,
                    userName:fieldValues.userName,
                    remark:fieldValues.remark
                };

                fetch('post', '/api/car/rental/add', params).then(res => {
                    if(res.code == 2000){
                        //TODO 跳转到 列表页面
                        this.props.history.push(`/app/system/rental/record`);
                    }else{
                        Message.destroy();
                        Message.error(res.msg);
                    }
                });


            }
        });
    };

    render(){

        const {formLayout} = this.state;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 9},
        };


        const buttonItemLayout = formLayout === 'horizontal' ? {
            wrapperCol: {span: 14, offset: 4},
        } : null;

        return (
            <div>
                <Card title="新增合同记录">
                    <Form onSubmit={this.createNew}>
                        <Row>
                            <Col span={10} offset={2}>
                                <FormItem
                                    label="车牌号"
                                    hasFeedback
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator('carNumber', {})(
                                            <Input disabled="true"/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={10} offset={1}>
                                <FormItem
                                    label="车型"
                                    hasFeedback
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator('carType', {
                                            rules: [{required: true, message: '请输入车辆类型'}],
                                            validateTrigger: 'onBlur'
                                        })(
                                            <Input/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10} offset={2}>
                                <FormItem
                                    label="类型"
                                    hasFeedback
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator('type', {
                                            rules: [{required: true, message: '请选择类型'}],
                                            validateTrigger: 'onBlur'
                                        })(
                                            <Select defaultValue="1">
                                                {/*1 借车2 日租 3 月租 4 以租代购*/}
                                                <Option value="1">借车</Option>
                                                <Option value="2">日租</Option>
                                                <Option value="3">月租</Option>
                                                <Option value="4">以租代购</Option>
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={10} offset={1}>
                                <FormItem
                                    label="合同编号"
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator('contractCode', {
                                            rules: [{required: true, message: '请输入合同编号'}],
                                            validateTrigger: 'onBlur'
                                        })
                                        (
                                            <Input placeholder="合同编号"/>
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10} offset={2}>
                                <FormItem
                                    label="提车时间"
                                    hasFeedback
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator('deliveryTime', {
                                            rules: [{required: true, message: '请选择提车时间'}],
                                            validateTrigger: 'onBlur'
                                        })(
                                            <DatePicker
                                                showTime
                                                format="YYYY-MM-DD HH:mm:ss"
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={10} offset={1}>
                                <FormItem
                                    label="还车时间"
                                    hasFeedback
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator('refundTime', {
                                            rules: [{required: true, message: '请选择还车时间'}],
                                            validateTrigger: 'onBlur'
                                        })
                                        (
                                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10} offset={2}>
                                <FormItem
                                    label="租车转态"
                                    hasFeedback
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator('status', {
                                            rules: [{required: true, message: '租车状态'}],
                                            validateTrigger: 'onBlur'
                                        })(
                                            <Select defaultValue="0">
                                                <Option value="0">租车</Option>
                                                <Option value="1">已退还</Option>
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={10} offset={1}>
                                <FormItem
                                    label="押金状态"
                                    hasFeedback
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator('cashPledgeStatus', {
                                            rules: [{required: true, message: '请选择押金状态'}],
                                            validateTrigger: 'onBlur'
                                        })
                                        (
                                            <Select defaultValue="0">
                                                <Option value="0">已退</Option>
                                                <Option value="1">未退</Option>
                                            </Select>
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10} offset={2}>
                                <FormItem
                                    label="租金"
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator('rentalMoney', {
                                            rules: [{required: true, message: '请输入租金'}],
                                            validateTrigger: 'onBlur'
                                        })(
                                           <Input/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={10} offset={1}>
                                <FormItem
                                    label="押金"
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator('cashPledge', {
                                            rules: [{required: true, message: '输入押金时间'}],
                                            validateTrigger: 'onBlur'
                                        })
                                        (
                                            <Input/>
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10} offset={2}>
                                <FormItem
                                    label="合同开始时间"
                                    hasFeedback
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator('beginTime', {
                                            rules: [{required: true, message: '合同开始时间', type: 'object'}],
                                        })
                                        (
                                            <DatePicker
                                                placeholder="请选择合同结束时间"
                                                showTime
                                                format="YYYY-MM-DD HH:mm:ss"/>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={10} offset={1}>
                                <FormItem
                                    label="合同结束时间"
                                    hasFeedback
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator('endTime', {
                                            rules: [{required: true, message: '合同结束时间', type: 'object'}],
                                        })
                                        (
                                            <DatePicker
                                                placeholder="请选择合同结束时间"
                                                showTime
                                                format="YYYY-MM-DD HH:mm:ss"/>
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10} offset={2}>
                                <FormItem
                                    label="下次交租时间"
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator('nextMouthRentalMoney', {
                                            rules: [{required: true, message: '请输入下次交租时间'}],
                                            validateTrigger: 'onBlur'
                                        })(
                                            <DatePicker
                                                placeholder="请选择下次交租时间"
                                                showTime
                                                format="YYYY-MM-DD HH:mm:ss"/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={10} offset={1}>
                                <FormItem
                                    label="管理费用"
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator('manageMoney', {
                                            rules: [{required: true, message: '输入管理费用'}],
                                            validateTrigger: 'onBlur'
                                        })
                                        (
                                            <Input/>
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10} offset={2}>
                                <FormItem
                                    label="用户姓名"
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator('userName', {
                                            rules: [{required: true, message: '请输入用户姓名'}],
                                            validateTrigger: 'onBlur'
                                        })
                                        (
                                            <Input/>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={10} offset={1}>
                                <FormItem
                                    label="备注"
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator('remark',)
                                        (
                                            <Input/>
                                        )}
                                </FormItem>
                            </Col>
                        </Row>

                        {
                            this.props.match.params.index != 1 &&
                            <FormItem {...buttonItemLayout}>
                                <Button type="primary" htmlType="submit"
                                        style={{width: '30%', marginLeft: '350'}}>确定</Button>
                            </FormItem>
                        }
                    </Form>
                </Card>
            </div>
        );
    };
}

export default Form.create()(CarRentalRecordDetail)