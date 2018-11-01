
import React from 'react';
import { Row, Col,Card, Button,Form, Select, } from 'antd';
import BasicTable from '../home/Table'
import MoreServiceTable from './MoreServiceTable'
import * as config from '../../api/config';

import {fetch} from '../../api/tools'


const FormItem = Form.Item;
const Option = Select.Option;



class Service extends React.Component {
  state = {
    visible: false
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log(values)
      }
    });
  };



  goDetail = (record) =>{
    // let detailName = record.serviceName + record.accessType
    let detailName = record.serviceName
    localStorage.setItem('serviceName', detailName)
    this.props.history.push(`/app/service/detail/${record.appKey}`)
  }

  toAllService = () =>{
    window.location.href = `${config.BASE_PATH}serviceList`
  }

  render() {
    const { getFieldDecorator} = this.props.form;

    return (
        <div className="gutter-example">
          <Row gutter={16}>
            <Col className="gutter-row" md={24}>
              <div className="gutter-box">
                <Card title={ `我的数据`} bordered={false}>
                  <BasicTable type={2} goDetail={this.goDetail}/>
                </Card>
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" md={24}>
              <div className="gutter-box">
                <Card bordered={false}>
                  <div className="more-service-header">
                    <p style={{marginRight: 20}}>更多数据服务</p>
                    <Button type='primary' onClick={this.toAllService}>查看所有</Button>
                    {/*<Form layout="inline" onSubmit={this.handleSubmit}>*/}
                     {/*<FormItem>*/}
                        {/*{getFieldDecorator('company', {*/}
                          {/*rules: [],*/}
                          {/*initialValue: '对接方式',*/}
                        {/*})(*/}
                            {/*<Select defaultValue="对接方式"  dropdownMatchSelectWidth={false}>*/}
                              {/*<Option value='对接方式'>对接方式</Option>*/}
                              {/*<Option value="1">H5</Option>*/}
                              {/*<Option value="2">API</Option>*/}
                            {/*</Select>*/}
                        {/*)}*/}
                      {/*</FormItem>*/}
                      {/*<FormItem>*/}
                        {/*{getFieldDecorator('cashType', {*/}
                          {/*rules: [],*/}
                          {/*initialValue: '服务类型',*/}
                        {/*})(*/}
                            {/*<Select defaultValue="服务类型" >*/}
                              {/*<Option value="服务类型">服务类型</Option>*/}
                              {/*<Option value="1">交通出行</Option>*/}
                              {/*<Option value="2">金融服务</Option>*/}
                              {/*<Option value="3">生活服务</Option>*/}
                            {/*</Select>*/}
                        {/*)}*/}
                      {/*</FormItem>*/}
                      {/*<FormItem>*/}
                        {/*<Button*/}
                            {/*type="primary"*/}
                            {/*htmlType="submit"*/}
                        {/*>*/}
                          {/*查询*/}
                        {/*</Button>*/}
                      {/*</FormItem>*/}
                    {/*</Form>*/}
                  </div>
                  <MoreServiceTable />
                </Card>
              </div>
            </Col>
          </Row>
        </div>
    );
  }
}

export default (Form.create()(Service));

