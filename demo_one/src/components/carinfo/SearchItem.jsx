/**
 *@author: RXK
 *@date:2018/11/3 11:09
 *@version: V1.0.0
 *@Des: 用于列表的表头的搜索组件
 **/

import React from 'react'
import {Form, Button, Input} from 'antd'

const FormItem = Form.Item;

class SearchItem extends React.Component {


    commitData = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldValue) => {
            if (!err) {
                let {} = fieldValue
                this.props.action(fieldValue,'manualSearch');
            }
        });
    };


    clearValue = () => {
        this.props.form.resetFields();
        this.props.action();
    };

    changeToDetail = (source) => {
        console.log("传过来的类型是：", source);
        if (source == 1) {
            this.props.history.push(`/app/system/carAdd/null/3`);
        }else if(source == 2){
            this.props.history.push(`/app/system/contractDetail/null/1`);
        }
    };


    render() {
        const {getFieldDecorator} = this.props.form;

        const buttonItemLayout = {
            wrapperCol: {
                xs: {span: '5px'},
                sm: {span: '10px'}
            },
        };

        return (

            <div style={{marginLeft: '100px', verticalAlign: 'middle', marginTop: '10px', marginBottom: '10px'}}>
               <span>
                    <Form onSubmit={this.commitData} layout="inline"
                          style={{display: 'inline-block', verticalAlign: 'middle'}}>
                        {
                            this.props.param.map((item,index) =>
                                <FormItem
                                    label={item.param}
                                    {...this.props.formItemStyle}
                                    key={index+'SearchItem'}
                                >
                                    {
                                        getFieldDecorator(`${item.paramName}`,)(
                                            <Input/>
                                        )
                                    }
                                </FormItem>
                            )
                        }
                        <FormItem {...buttonItemLayout}>
                        <Button type="primary" htmlType="submit">确定</Button>
                    </FormItem>
                    <FormItem {...buttonItemLayout}>
                        <Button type="primary" htmlType="button" onClick={this.clearValue}>重置</Button>
                    </FormItem>
                </Form>
                <Button type="primary" style={this.props.searchStyle}
                        onClick={() => this.changeToDetail(this.props.buParam[0].source)}>{this.props.buParam[0].name}</Button>
               </span>
            </div>
        );
    }
}

export default Form.create()(SearchItem)