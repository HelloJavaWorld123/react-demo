/**
 *@author: RXK
 *@date:2018/10/26 17:57
 *@version: V1.0.0
 *@Des: 车辆维修记录详情页 以及 新增页
 **/

import React from 'react'
import {Form, Input, Button, DatePicker, Row, Col, Select, Card, Message} from 'antd'
import monent from 'moment'
import {fetch} from '../../api/tools';
import UpLoadImg from '../system/UploadImg'

const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;

class CarMaintainRecordDetail extends React.Component {

    constructor() {
        super();
        this.state = {
            carNumber: null,
            formLayout: 'horizontal',
            carMaintainRecordDetail: [],
        };
    }

    getImgUrl = (type, url) => {
        console.log("图片的信息是：", url);
        this.setState({[type]: url}, () => {
            this.updateDetail()
        })
    };

    componentDidMount() {
        console.log("从连接里面获取到的车牌号是：", this.props.match.params.id);
        console.log("从连接里面获取到的index是：", this.props.match.params.index);



        if (this.props.match.params.index != 0) {
            let params = {
                maintainId: this.props.match.params.maintainId,
            };
            console.log("获取该车维修的详细记录：", params);
            fetch('post', '/api/car/maintain/detail', params).then(res => {
                if (res.code == 2000) {
                    this.setState({carMaintainRecordDetail: res.data}, () => {
                        this.props.form.setFieldsValue({
                            carNumber: this.props.match.params.id,
                            maintainPicture: this.state.carMaintainRecordDetail.maintainPicture,
                            remark: this.state.carMaintainRecordDetail.remark,
                            delayDays: this.state.carMaintainRecordDetail.delayDays,
                            maintainCount: this.state.carMaintainRecordDetail.maintainCount,
                            maintainStatus: this.state.carMaintainRecordDetail.maintainStatus,
                            orderStatus: this.state.carMaintainRecordDetail.orderStatus,
                            carStatus: this.state.carMaintainRecordDetail.carStatus,
                            endTime: monent(this.state.carMaintainRecordDetail.endTime),
                            beginTime: monent(this.state.carMaintainRecordDetail.beginTime),
                            userName: this.state.carMaintainRecordDetail.userName,
                            maintainAddress: this.state.carMaintainRecordDetail.maintainAddress,
                            maintainMoney: this.state.carMaintainRecordDetail.maintainMoney,
                            carType: this.state.carMaintainRecordDetail.carType
                        });
                    });
                } else {
                    Message.destroy();
                    Message.error(res.msg);
                }
            });
        }

        this.props.form.setFieldsValue({
            carNumber: this.props.match.params.id,
        });
    }

    updateDetail = (e) => {
        e.preventDefault();
        this.props.form.setFieldsValue({
            maintainPicture: this.state.maintainPicture,
        });
        this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
            if (!err) {
                console.log("提交数据", fieldsValue);
                if (this.props.match.params.maintainId == null) {
                    this.addRecord(fieldsValue);
                } else {
                    this.updateRecord(fieldsValue);
                }
            }
        })
    };

    updateRecord = (fieldsValue) => {
        let params = {
            maintainId: this.props.match.params.maintainId,
            carNumber: this.props.match.params.id,
            carType: fieldsValue.carType,
            beginTime: fieldsValue.beginTime.format("YYYY-MM-DD HH:mm:ss"),
            endTime: fieldsValue.endTime.format("YYYY-MM-DD HH:mm:ss"),
            maintainAddress: fieldsValue.maintainAddress,
            maintainMoney: fieldsValue.maintainMoney,
            carStatus: fieldsValue.carStatus,
            orderStatus: fieldsValue.orderStatus,
            maintainStatus: fieldsValue.maintainStatus,
            maintainCount: fieldsValue.maintainCount,
            delayDays: fieldsValue.delayDays,
            remark: fieldsValue.remark,
            maintainPicture: this.state.maintainPicture,
            userName: fieldsValue.userName,
        };
        fetch('post', '/api/car/maintain/update', params).then(res => {
            if (res.code == 2000) {
                this.props.history.push(`/app/system/carMaintainList/${params.carNumber}`);
            } else {
                Message.destroy();
                Message.error(res.msg);
            }
        });
    };


    addRecord = (fieldsValue) => {
        console.log("提交的数据时：", fieldsValue);
        let params = {
            carNumber: this.props.match.params.id,
            carType: fieldsValue.carType,
            beginTime: fieldsValue.beginTime.format("YYYY-MM-DD HH:mm:ss"),
            endTime: fieldsValue.endTime.format("YYYY-MM-DD HH:mm:ss"),
            maintainAddress: fieldsValue.maintainAddress,
            maintainMoney: fieldsValue.maintainMoney,
            carStatus: fieldsValue.carStatus,
            orderStatus: fieldsValue.orderStatus,
            maintainStatus: fieldsValue.maintainStatus,
            maintainCount: fieldsValue.maintainCount,
            delayDays: fieldsValue.delayDays,
            remark: fieldsValue.remark,
            maintainPicture: this.state.maintainPicture,
            userName: fieldsValue.userName,
        };
        fetch('post', '/api/car/maintain/add', params).then(res => {
            if (res.code == 2000) {
                this.props.history.push(`/app/system/carMaintainList/${params.carNumber}`);
            } else {
                Message.destroy();
                Message.error(res.msg);
            }
        });
    };


    render() {

        const {formLayout} = this.state;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 8},
        };


        const buttonItemLayout = formLayout === 'horizontal' ? {
            wrapperCol: {span: 14, offset: 4},
        } : null;

        const config = {
            rules: [{type: 'object', required: true, message: '请选择正确的时间'}],
        };

        return (
            <div>
                <Card title="新增维修记录">
                    <Form onSubmit={this.updateDetail} style={{display: 'flex'}}>
                        <div style={{flex: '10', flexDirection: 'column'}}>
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
                            <FormItem
                                label="总金额"
                                hasFeedback
                                {...formItemLayout}
                            >
                                {
                                    getFieldDecorator('maintainMoney', {
                                        rules: [{required: true, message: '请输入维修总金额'}],
                                        validateTrigger: 'onBlur'
                                    })
                                    (
                                        <Input placeholder="维修总金额"/>
                                    )}
                            </FormItem>
                            <FormItem
                                label="订单状态"
                                hasFeedback
                                {...formItemLayout}
                            >
                                {
                                    getFieldDecorator('orderStatus', {
                                        rules: [{required: true, message: '订单状态'}],
                                        validateTrigger: 'onBlur'
                                    })(
                                        <Select defaultValue={0}>
                                            <Option value={0}>未结算</Option>
                                            <Option value={1}>已结算</Option>
                                            <Option value={2}>已确认</Option>
                                        </Select>
                                    )
                                }
                            </FormItem>
                            <FormItem
                                label="提车转态"
                                hasFeedback
                                {...formItemLayout}
                            >
                                {
                                    getFieldDecorator('carStatus', {
                                        rules: [{required: true, message: '请选择提车状态'}],
                                        validateTrigger: 'onBlur'
                                    })
                                    (
                                        <Select defaultValue={0}>
                                            <Option value={0}>未提车</Option>
                                            <Option value={1}>已提车</Option>
                                        </Select>
                                    )}
                            </FormItem>
                            <FormItem
                                label="维修状态"
                                {...formItemLayout}
                            >
                                {
                                    getFieldDecorator('maintainStatus', {
                                        rules: [{required: true, message: '请选择车辆维修状态'}],
                                        validateTrigger: 'onBlur'
                                    })(
                                        <Select defaultValue={0}>
                                            <Option value={0}>修理中</Option>
                                            <Option value={1}>已修好</Option>
                                        </Select>
                                    )
                                }
                            </FormItem>
                            <FormItem
                                label="延期天数"
                                {...formItemLayout}
                            >
                                {
                                    getFieldDecorator('delayDays', {
                                        rules: [{required: true, message: '输入延期天数'}],
                                        validateTrigger: 'onBlur'
                                    })
                                    (
                                        <Input placeholder="延期天数"/>
                                    )}
                            </FormItem>
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
                            <FormItem
                                label="维修地址"
                                hasFeedback
                                {...formItemLayout}
                            >
                                {
                                    getFieldDecorator('maintainAddress', {
                                        rules: [{required: true, message: '请输入详细的维修厂的地址'}],
                                        validateTrigger: 'onBlur'
                                    })(
                                        <Input/>
                                    )
                                }
                            </FormItem>
                        </div>
                        <div style={{flex: '10', flexDirection: 'column'}}>
                            <FormItem
                                label="维修内容"
                                hasFeedback
                                {...formItemLayout}
                            >
                                {
                                    getFieldDecorator('maintainCount', {
                                        rules: [{required: true, message: '维修内容'}],
                                        validateTrigger: 'onBlur'
                                    })(
                                        <Input/>
                                    )
                                }
                            </FormItem>
                            <FormItem
                                label="进厂时间"
                                hasFeedback
                                {...formItemLayout}
                            >
                                {
                                    getFieldDecorator('beginTime', config)(
                                        <DatePicker
                                            placeholder="选择进厂维修时间"
                                            showTime
                                            format="YYYY-MM-DD HH:mm:ss"/>
                                    )
                                }
                            </FormItem>
                            <FormItem
                                label="出厂时间"
                                hasFeedback
                                {...formItemLayout}
                            >
                                {
                                    getFieldDecorator('endTime', config)(
                                        <DatePicker
                                            placeholder="请选择出厂维修时间"
                                            showTime
                                            format="YYYY-MM-DD HH:mm:ss"/>
                                    )
                                }
                            </FormItem>
                            <FormItem
                                label="维修图片"
                                {...formItemLayout}
                            >
                                {
                                    getFieldDecorator('maintainPicture', {
                                        rules: [{required: true, message: '输入维修图片'},]
                                    })(
                                        <UpLoadImg
                                            type={'maintainPicture'}
                                            url={this.state.maintainPicture}
                                            getImgUrl={this.getImgUrl}
                                        />
                                    )}
                            </FormItem>
                            <FormItem
                                label="备注"
                                {...formItemLayout}
                            >
                                {
                                    getFieldDecorator('remark',)
                                    (
                                        <TextArea rows={5} autosize="true"/>
                                    )}
                            </FormItem>
                            {
                                this.props.match.params.index != 1 &&
                                <FormItem {...buttonItemLayout}>
                                    <Button type="primary" htmlType="submit" style={{width: '80'}}>确定</Button>
                                    <Button type="primary" ghost htmlType="button" style={{width: '80'}}
                                            onClick={() => this.props.history.push(`/app/system/carMaintainList/${this.props.match.params.id}`)}>返回</Button>
                                </FormItem>
                                ||
                                <FormItem {...buttonItemLayout}>
                                    <Button type="primary" htmlType="button" style={{width: '200'}}
                                            onClick={() => this.props.history.push(`/app/system/carMaintainList/${this.props.match.params.id}`)}>返回</Button>
                                </FormItem>

                            }
                        </div>
                    </Form>
                </Card>
            </div>
        );
    }
}

export default Form.create()(CarMaintainRecordDetail)



