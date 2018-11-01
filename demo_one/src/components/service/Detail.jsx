
import React from 'react';
import { Row, Col,Card, Button, Icon, Tabs, Divider, Message, Modal} from 'antd';
import DetailTable from './DetailTable'
import StatisticsTable from './StatisticsTable'
import StatisticsChart from './StatisticsChart'
import AutoQuery from './AutoQuery'
import TestCarNum from './TestCarNum'
import OrderDetail from './OrderDetail'
import OrderChecking from './OrderChecking'
import Prepayment from './Prepayment'
import {fetch} from '../../api/tools'
import * as config from '../../api/config';
import moment from 'moment'



const TabPane = Tabs.TabPane;


class Detail extends React.Component {
  state = {
    activeIndex: 0,
    serviceDetail: {},
    statisticsData:[],
    activeKey: '1',
    buttonSet:'',
    chartData:[]
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


  //复制选中的内容到剪贴板
  copyToClipboard = (id) => {
    var copyText = document.getElementById(id);
    /* Select the text field */
    copyText.select();
    /* Copy the text inside the text field */
    document.execCommand("copy");
    Message.destroy()
    Message.success('复制成功')
  };

  //切换时间段
  handlePeriod = (index) => {
    this.setState({activeIndex: index},()=>{
      this.fetchData()
    })
  }

  fetchData = () => {
    if(!this.state.apiType) return;
    let days = this.state.activeIndex;
    switch (days){
      case 0:
        days = 7
        break
      case 1:
        days = 15
        break
      case 2:
        days = 30
        break
    }
    // 表格内统计数据
    fetch('get',`/usercenter/apiGateway/stat?apiType=${this.state.apiType}&days=${days}&appKey=${this.props.match.params.id}`).then(res=>{
      if(res.code == 0){
        let statisticsData = [];
        statisticsData.push(res.data)
        this.setState({statisticsData: statisticsData})
      }else{
        Message.destroy()
        Message.error(res.msg)
      }
    })
  //  图表的统计数据
    fetch('get',`/usercenter/apiGateway/getApiDateStat?apiType=${this.state.apiType}&days=${days}&appKey=${this.props.match.params.id}`).then(res=>{
      if(res.code == 0){
        let chartData = res.data;
        chartData = this.constructChartData(chartData,days);
        this.setState({chartData: chartData})
      }else{
        Message.destroy()
        Message.error(res.msg)
      }
    })
  }

  //构造图表需要的数据格式
  constructChartData(data,days){
    let result = [];
    for(let i = 1; i<=days ; i++){
      let item = {queryDate:  moment().subtract(days-i, 'days').format('YYYY-MM-DD'), tallyCount: 0}
      result.push(item)
    }
    for(let item1 of result){
      for(let item2 of  data){
        if(item2.queryDate == item1.queryDate){
          item1.tallyCount = item2.tallyCount
        }
      }
    }
    return result
  }

  componentDidMount(){
   this.fetchDetail()
   let activeKey = window.location.hash && window.location.hash.split('?key=')[1]
    this.handleActiveKey(activeKey||'1')

  }

  //获取业务详情
  fetchDetail=()=>{
    fetch('get',`/usercenter/dataService/getVo?appKey=${this.props.match.params.id}`).then(res=>{
      if(res.code == 0 && res.data){
        let chargeWay = res.data.chargeWay;
        let accessType = res.data.accessType;
        let serviceType = 1;
        let shopServiceId = res.data.shopServiceId
        let apiType = res.data.apiType;
        // 根据buttonSet来展示不同的tabs
        let buttonSet = res.data.buttonSet
        if(chargeWay == 1){
          accessType.toUpperCase() == 'H5' && (serviceType = 3)  //违章H5代办
          accessType.toUpperCase() == 'API' && (serviceType = 4) //违章API代办
        }else{
          accessType.toUpperCase() == 'H5' && (serviceType = 1)  //违章H5查询
          accessType.toUpperCase() == 'API' && (serviceType = 2) //违章API查询
        }
        this.setState({serviceDetail: res.data, serviceType: serviceType, shopServiceId: shopServiceId, apiType: apiType, buttonSet: buttonSet},()=>{
          buttonSet.indexOf('2')>-1 && this.state.activeKey === '2' && this.fetchData()
        })
      } else if(res.code != 0) {
        Message.destroy()
        Message.error(res.msg)
      }
    })
  }

  //预付款清零
  clearAccount =()=>{
    fetch('get',`/usercenter/transaction/transfer-accounts-clear?shopServiceId=${this.state.shopServiceId}`).then(res=>{
      if(res.code ==0){
        this.fetchDetail()
        Message.destroy()
        Message.success('清零成功')
        this.setState({
          visible: false,
        });
      }else{
        Message.destroy()
        Message.error(res.msg)
      }
    })
  }

  handleActiveKey = (key) =>{
    if(key === '2') this.fetchData()
    this.setState({activeKey: key})
  }

  goRecharge = () => {
    window.location.href = `${config.BASE_PATH}checkoutCounter/${this.state.shopServiceId}`
  }








  render() {
    const operations = <Button type='primary' onClick={()=>{window.history.back()}}>返回</Button>;
    let {serviceDetail, serviceType, activeKey, buttonSet} = this.state
    return (

        <div className="gutter-example">
          <Card>
            <Tabs  tabBarExtraContent={operations} activeKey={activeKey} onChange={(activeKey)=>{this.handleActiveKey(activeKey)}}>
              <TabPane tab="服务详情" key="1">
                <div style={{marginBottom: 10}}>[AppId] <input className="copyInput" id="copyIdText" value={serviceDetail.appId}/>
                  <Button size="small" type="primary" style={{marginLeft: 30, height: 20}} onClick={()=>this.copyToClipboard('copyIdText')}>复制</Button>
                </div>
                <div style={{marginBottom: 10}}>[AppKey] <input className="copyInput" id="copyKeyText" value={serviceDetail.appKey}/>
                  <Button size="small" type="primary" style={{marginLeft: 30, height: 20}} onClick={()=>this.copyToClipboard('copyKeyText')}>复制</Button>
                </div>
                <div style={{marginBottom: 10}}>[AppSecret] <input className="copyInput" id="copySecretText" value={serviceDetail.appSecret}/>
                  <Button size="small" type="primary" style={{marginLeft: 30, height: 20}} onClick={()=>this.copyToClipboard('copySecretText')}>复制</Button>
                </div>
                <Divider/>
                [{serviceDetail.serviceName}-{serviceDetail.accessType}]
                {serviceType !=4 && <Button  size="small" type="primary" style={{marginLeft: 20}} onClick={this.goRecharge}>再次购买</Button>}
                {serviceType ==4 &&
                    <div className="inline">
                      <Button  size="small" type="primary" style={{marginLeft: 20}} onClick={this.goRecharge}>服务充值</Button>
                      {serviceDetail.balance >0 &&<Button  size="small"  type="primary"  style={{marginLeft: 20}} onClick={ this.showModal}>预付款余额清零</Button>}
                      {serviceDetail.balance ==0 &&<Button  size="small"  type="primary" disabled  style={{marginLeft: 20}}>预付款余额清零</Button>}
                      <Icon style={{marginLeft: 15, marginRight: 5, color:'#2b7fd5'}} type={'exclamation-circle-o'} />
                      <span>清零后服务预付款余额为0，该款项转入账户余额中。</span>
                    </div>
                }
                <Row style={{marginTop: 15, lineHeight: '36px'}}>
                  <Col span={4}>
                    对接方式：{serviceDetail.accessType}
                  </Col>
                  <Col span={4}>
                    服务类型：{serviceDetail.categoryName}
                  </Col>
                  <Col span={5}>
                   开始购买日期：{serviceDetail.buyTime}
                  </Col>
                  <Col span={5}>
                    有效期至：{serviceDetail.validEndTime}
                  </Col>
                  <Col span={4}>
                    剩余查询次数： {serviceDetail.lastCount}
                  </Col>
                  {serviceType ==4 && <Col span={4}>
                    预付款余额： {serviceDetail.balance}
                  </Col>}
                  {serviceType ==4 && <Col span={4}>
                    冻结金额： {serviceDetail.frozenAmount}
                  </Col>}
                </Row>
                <Divider/>
                {serviceType !=4 && <DetailTable data={serviceDetail.packages}/>}
              </TabPane>
              {buttonSet.indexOf('2')>-1 && <TabPane tab="数据" key="2">
                <Row type="flex" justify="space-between">
                  <Col span={16}>
                    <StatisticsTable statisticsData={this.state.statisticsData}/>
                  </Col>
                  <Col span={6}>
                    <Row type="flex" justify="end">
                      <div className="detail-tabs ">
                        {['近7天', '近15天', '近30天'].map((item,index)=>
                          <span
                              style={{width: '33.333%'}}
                              key={index}
                              onClick={()=>this.handlePeriod(index)}
                              className={this.state.activeIndex == index?'activeTab':''}
                          >
                            {item}
                          </span>
                        )}
                      </div>
                      {/*<Button style={{marginLeft: 30}} type='primary' >返回</Button>*/}
                    </Row>
                  </Col>
                </Row>
                {/*<Row type="flex" justify="space-between mt15" align='middle'>*/}
                  {/*<Col span={12}>*/}
                    {/*<StatisticsTable statisticsData={this.state.statisticsData}/>*/}
                  {/*</Col>*/}
                  {/*<Col span={8} style={{textAlign: 'right'}}>*/}
                    {/*<Button type="primary">查询明细数据下载</Button>*/}
                  {/*</Col>*/}
                {/*</Row>*/}
                {/*违章API查询数据图表展示*/}
                {serviceType == 2 && <Row className='mt30' style={{marginLeft: '-55px'}}>
                   <StatisticsChart chartData={this.state.chartData}/>
                </Row>}
              </TabPane>}
              {(buttonSet.indexOf('3')>-1 || buttonSet.indexOf('6')>-1)&& <TabPane tab="自助查询" key="3" >
                <AutoQuery appKey={serviceDetail.appKey}/>
              </TabPane>}
              {(buttonSet.indexOf('4')>-1 || buttonSet.indexOf('7')>-1)&& <TabPane tab="测试车牌获取" key="4">
                <TestCarNum appKey={this.props.match.params.id}/>
              </TabPane>}
              {buttonSet.indexOf('5')>-1 && <TabPane tab="订单对账(明细)" key="5">
                <OrderChecking shopServiceId={this.state.shopServiceId}/>
              </TabPane>}
              {/*<TabPane tab="订单详情" key="6">*/}
              {/*<OrderDetail/>*/}
              {/*</TabPane>*/}
              {serviceType ==4 && buttonSet.indexOf('4')>-1 && <TabPane tab="预付款流水" key="7">
                <Prepayment shopServiceId={this.state.shopServiceId} />
              </TabPane>}
            </Tabs>


          </Card>

          <Modal title="预付款清零"
                 visible={this.state.visible}
                 onCancel={this.handleCancel}
                 okText={'确认清零'}
                 cancelText={'暂不清零'}
                 onOk={this.clearAccount}
          >
            <div className="center" style={{marginBottom: 30}}>
              <div>
                <Icon style={{marginLeft: 15, marginRight: 5}} type={'exclamation-circle-o'} />
              </div>
              <div>清零后服务预付款余额为零，该款项转入账户余额中。清零后服务无法正常使用，并自动关闭该服务的余额预警，请谨慎操作。</div>
            </div>
            <div className="center mb15">您将清零服务【 {serviceDetail.serviceName}{serviceDetail.accessType}】的预付款余额，共{serviceDetail.balance}元。</div>
            <div className="center">是否确认清零？</div>
          </Modal>


        </div>
    );
  }
}



export default Detail;