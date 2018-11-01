
import React from 'react';
import { Row, Col,Card, Button, Icon,  Divider, Message, Tabs, Table, Radio} from 'antd';
import EnterpriseInfo from './EnterpriseInfo'
import AdministratorInfo from './AdministratorInfo'
import {fetch} from '../../api/tools'
import licence from '@/style/imgs/licence.png';
import businessLicense from '@/style/imgs/businessLicense.png';
import idCardNegative from '@/style/imgs/idCardNegative.png';
import idCardPositive from '@/style/imgs/idCardPositive.png';



const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;




class Authentication extends React.Component {
  state = {
    value:2,
    certifiedInfo:{},
    showInfo: false,
    companyInfo:[],
    adminInfo:[],
    authStatus:''
  }
  onChange = (e) => {
    // console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }

  submit = (params) => {
    params.certifiedType = this.state.value
    params.companyAddress && (params.companyAddress = params.companyAddress.join(''));
    fetch('post','/admin/userExt',params).then(res=>{
      if(res.code == 0){
        this.fetchData()
        Message.destroy()
        Message.success('提交成功')
      } else {
        Message.destroy()
        Message.error(res.msg)
      }
    })
  }

  componentDidMount(){
    this.fetchData()
  }

  fetchData = () => {
    fetch('get','/admin/userExt/get').then(res=>{
      // certifiedStatus  0:未认证 1待审核 2 认证成功 3 认证失败
      if(res.code == 0){
        let authStatus = ''
        switch (res.data.certifiedStatus){
          case 0:
            authStatus='暂未认证'
            break
          case 1:
            authStatus='正在认证,请耐心等待...'
            break
          case 2:
            authStatus='认证成功'
            break
          case 3:
            authStatus='认证失败,'+ res.data.verifyResult
            break
        }
        if(res.data && ([1,2,3].includes(res.data.certifiedStatus))){
          let {companyName, companyAddress, companyAddressDetail, companyTaxNum, companyOrgNum,
              companyLicenseCopy, companyCustomerLicense, userName, userPhone, userIdCard,
              idCardPositive, idCardNegative
          } = res.data
          let companyInfo = [
            {title:'公司名称', value: companyName},
            {title:'公司地址', value: companyAddress+companyAddressDetail},
            {title:'税务登记证编号', value: companyTaxNum},
            {title:'组织机构编号', value: companyOrgNum},
            {title:'营业执照副本', value: companyLicenseCopy, isImg: true},
            {title:'开户许可证', value: companyCustomerLicense, isImg: true},
          ];
          let adminInfo = [
            {title:'姓名', value: userName},
            {title:'电话', value: userPhone},
            {title:'身份证号', value: userIdCard},
            {title:'身份证正面', value: idCardPositive, isImg: true},
            {title:'身份证反面', value: idCardNegative, isImg: true},
          ]
          this.setState({showInfo: true, certifiedInfo: res.data, companyInfo: companyInfo, adminInfo: adminInfo, authStatus: authStatus , certifiedStatus: res.data.certifiedStatus})
        }
      }else{
        Message.error(res.msg)
      }
    })
  }



  render() {
    let {showInfo, certifiedInfo, companyInfo, adminInfo, authStatus, certifiedStatus} = this.state
    return (
        <div className="gutter-example">
          <Card>
            <Row className="c-default-bg" style={{padding: '15px 30px'}}>实名认证一经通过不得再次修改！</Row>
            {showInfo && <Row className="c-default-bg" style={{marginTop: 10,padding: '15px 30px',fontSize: '18px'}}>{authStatus}</Row>}
            {!showInfo && <div>
              <Row type='flex' align="middle" style={{padding: '15px 0 15px 50px'}}>
                <p style={{marginRight: '40px', fontWeight: '800'}}>认证类型</p>
                <RadioGroup onChange={this.onChange} value={this.state.value}>
                  <Radio value={2}>企业认证</Radio>
                  <Radio value={1}>个人认证</Radio>
                </RadioGroup>
              </Row>
              {this.state.value == 2 && <EnterpriseInfo submit={this.submit} />}
              {this.state.value == 1 && <AdministratorInfo submit={this.submit} />}
            </div>}
            {showInfo && <div>
              <Row type='flex' align="middle" style={{padding: '20px 0 15px 32px'}}>
                <Col span={3} style={{textAlign: 'right',color: 'rgba(0, 0, 0, 0.85)'}}>认证类型</Col>
                <Col span={20} offset={1}>{certifiedInfo.certifiedType == 1 ? '个人认证':'企业认证'}</Col>
              </Row>
              {certifiedInfo.certifiedType == 2 && <Card title={'企业信息'} bordered = {false}>
                {companyInfo.map((item,index)=>
                  <Row key={index} style={{marginBottom: 10}}>
                    <Col span={3} style={{textAlign: 'right',color: 'rgba(0, 0, 0, 0.85)'}}>{item.title}</Col>
                    <Col span={20} offset={1}>
                      {item.isImg?  <img src={item.value} alt=""/> :item.value}
                    </Col>
                  </Row>
                )}
              </Card>}
              <Card title={'管理员信息'} bordered = {false}>
                {adminInfo.map((item,index)=>
                    <Row key={index} style={{marginBottom: 10}}>
                      <Col span={3} style={{textAlign: 'right', color: 'rgba(0, 0, 0, 0.85)'}}>{item.title}</Col>
                      <Col span={20} offset={1}>
                        {item.isImg?  <img src={item.value} alt=""/> :item.value}
                      </Col>
                    </Row>
                )}
              </Card>
              {certifiedStatus == 3 &&
              <Card bordered = {false}>
              <Row>
                <Col span={20} offset={4}>
                  <Button type="primary" onClick={()=>{this.setState({showInfo: false})}}>重新认证</Button>
                </Col>
              </Row>
              </Card>}
            </div>}
            {!showInfo && <Card title={'示例图片'} bordered = {false}>
              <Row className='mb15'>
                <Col span={6} offset={4}>
                  <div className="example">
                    <img src={idCardPositive} alt=""/>
                    <p>身份证正面</p>
                  </div>
                </Col>
                <Col span={6}>
                  <div className="example">
                    <img src={idCardNegative} alt=""/>
                    <p>身份证反面</p>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={6} offset={4}>
                  <div className="example">
                    <img src={businessLicense} alt=""/>
                    <p>营业执照</p>
                  </div>
                </Col>
                <Col span={6}>
                  <div className="example">
                    <img  src={licence} alt=""/>
                    <p>开户许可证</p>
                  </div>
                </Col>
              </Row>
            </Card>}
          </Card>


        </div>
    );
  }
}


export default Authentication;