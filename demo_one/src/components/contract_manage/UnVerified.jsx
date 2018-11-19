// import React from 'react';
import React, {Component}from 'react';
import { Button, Form, Message, Modal, Input, Select, Divider, Row, Col, Tabs, Card, DatePicker } from 'antd';
import { fetch } from '../../api/tools'
import { fetchData, receiveData } from '@/action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import UpLoadImg from "../system/UploadImg";
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;


class UnVerified extends React.Component {
    state = {
        checkImg:[]
    };

    getImgUrl = (type, url) => {
        //console.log(type,url)
        let {checkImg}=this.state
        checkImg.push(url);
        this.setState({ [type]: checkImg },()=>{
           // console.log(this.state.checkImg)
        })
    };


    updateOnChange = () => {

    }

    callback = () => {

    }




    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { checkImg } = this.state;
                //console.log(checkImg)
                const filesValue = {
                    ...values,
                    'checkTime': moment(values['checkTime']).format('YYYY-MM-DD HH:mm:ss')
                };
                filesValue.checkImgs = checkImg;
                this.props.verificationSubmit(this.props.url, filesValue)
            }
        });
    };



    componentDidMount() {

    }




    render() {
        const { getFieldDecorator } = this.props.form;
        const { title,cardStyle} = this.props;
        return (
            <div>
                <Form onSubmit={this.handleSubmit} layout='inline'>
                    <Card title={<div><Col span={22}><h3>{title}</h3></Col><Col span={2}><FormItem><Button type='primary' ghost size='large' htmlType="submit">提交核查</Button></FormItem></Col></div>} bordered={false} style={cardStyle}>
                        <FormItem
                            label="核查日期"
                        >
                            {getFieldDecorator('checkTime', {
                                rules: [],
                            })(
                                <DatePicker placeholder={'请选择核查日期'} />
                            )}
                        </FormItem>
                        <FormItem

                            label="核查方式"
                        >
                            {getFieldDecorator('checkWay', {
                                rules: [],
                            })(
                                <Select dropdownMatchSelectWidth={false} allowClear={true} placeholder='核查方式'>
                                    {checkWay.map((item, index) =>
                                        <Option value={item.value} key={index}>{item.name}</Option>
                                    )}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem

                            label="核查人"
                        >
                            {getFieldDecorator('checkBy', {
                                rules: [],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            label='核查截图'
                        >
                            {getFieldDecorator('checkImg', {
                                rules: [
                                ],
                            })(
                                <UpLoadImg
                                    type={'checkImg'}
                                    url={this.state.checkImg}
                                    getImgUrl={this.getImgUrl}
                                />
                            )}
                        </FormItem>
                    </Card>
                </Form>
            </div>



        );
    }
}
const mapStateToProps = state => {
    const { usersWallet = { data: {} }, userInfo = { data: {} } } = state.httpData;
    return { usersWallet, userInfo };
};

const checkWay = [
    { name: '胡椒核查小程序', value: '0' },
    { name: '其他', value: '1' }
]




const mapDispatchToProps = dispatch => ({
    fetchData: bindActionCreators(fetchData, dispatch),
});



/*export default Form.create()(UnVerified);*/
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(UnVerified))