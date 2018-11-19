import React from 'react';
import {Button, Form, Message, Modal,Input,Select,Pagination,Divider,Row,Icon,Table} from 'antd';
import {fetch} from '../../api/tools'
import {fetchData, receiveData} from '@/action';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { createHashHistory } from 'history';


const history = createHashHistory();
const FormItem = Form.Item;
const Option = Select.Option;

class ContractRiskList extends React.Component {
  state = {
    activeIndex: 0,
    isShowDetail:false,
    pageNum:1,
    pageSize:10,
    isShowList:true
  };


    updateOnChange = ()=>{
        const{pageNum,pageSize} = this.state
        this.onChange(pageNum,pageSize);
    }


  del = (record)=>{
        // console.log(record)

    };

    find = (record)=>{
        // console.log(record)
        this.setState({carDetailRecord:record,isShowDetail:true,isShowList:false})
    };



  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
      const {pageNum,pageSize}= this.state;
      this.onChange(pageNum,pageSize,values);
      }
    });
  };



  componentDidMount(){
      const {pageNum,pageSize}= this.state;
      this.onChange(pageNum,pageSize);
  }

    onChange = (pageNum,pageSize,contractInfo)=>{
      fetch('post','/chedui/contract/risk/'+pageNum+'/'+pageSize,contractInfo).then(res=>{
          if (res.code === 2000){
              let data = res.data.rows;
              for(let item of data){
                  switch(item.contractStatus){
                      case 1:
                          item.contractStatus = '异常合同';
                          break;
                      case 2:
                          item.contractStatus = '执行中的合同';
                          break;
                      case 3:
                          item.contractStatus = '快到期合同';
                          break;
                      case 4:
                          item.contractStatus = '还款逾期合同';
                          break;
                      case 5:
                          item.contractStatus = '待审核合同';
                          break;
                      case 6:
                          item.contractStatus = '待签约合同';
                          break;
                      case 7:
                          item.contractStatus = '待交车合同';
                          break;
                      case 8:
                          item.contractStatus = '收款待付合同';
                          break;
                  }
                  item.contractType = item.contractType === 0 ?'直租':'以租代购';
              }
              this.setState({data:data,total:res.data.total,pageNum: pageNum,pageSize: pageSize,isShowDetail:false,isShowList:true});
          }
      })
  }




  render() {
      const columns = [{
          title: '合同编号',
          dataIndex: 'contractCode',
          key: '1',
      }, {
          title: '合同状态',
          dataIndex: 'contractStatus',
          key: '2',
      }, {
          title: '合同类型',
          dataIndex: 'contractType',
          key: '3',
      }, {
          title: '车辆信息',
          dataIndex: 'carInfo',
          key: '4',
      },{
          title: '承租人',
          dataIndex: 'userInfo',
          key: '5',
      },{
          title: '缴款日',
          dataIndex: 'paymentTime',
          key: '6',
      },{
          title: '开始时间',
          dataIndex: 'beginTime',
          key: '7',
      },{
          title: '结束时间',
          dataIndex: 'endTime',
          key: '8',
      },{
          title: '操作',
          key: '9', render:(record)=>
              <div>
                  <Button type='primary'  size='small' onClick={()=>history.push('/app/contract/ContractRiskDetail/'+record.id)}>查看详情</Button>
              </div>

      },];
    const{ data,total,pageNum,pageSize} = this.state;
    const { getFieldDecorator} = this.props.form;
    return (

        <div style={{background: 'white', padding: '26px 16px 16px',margin:'20px 0px'}}>
            <Row><p style={{fontSize: '18px',fontWeight: '800'}}>风控审核</p></Row>
            <Divider style={{margin: '10px 0'}}></Divider>
            <Form onSubmit={this.handleSubmit} layout='inline'>
            <FormItem
                label="合同编号"

            >
                {getFieldDecorator('contractCode', {
                    rules: [],
                })(
                    <Input/>
                )}
            </FormItem>
            <FormItem

                label="状态"
            >
                {getFieldDecorator('contractStatus', {
                    rules: [],
                })(
                    <Select defaultValue='0'  dropdownMatchSelectWidth={false} allowClear={true} placeholder='合同状态'>
                        {contractStatus.map((item,index)=>
                            <Option value={item.value} key={index}>{item.name}</Option>
                        )}
                    </Select>
                )}
            </FormItem>
            <FormItem

                label="承租人姓名"
            >
                {getFieldDecorator('rentalUserName', {
                    rules: [],
                })(
                    <Input />
                )}
            </FormItem>
            <FormItem

                label="承租人电话"
            >
                {getFieldDecorator('rentalUserPhone', {
                    rules: [],
                })(
                    <Input />
                )}
            </FormItem>
            <FormItem

            >
                <Button type='primary' size='large'  htmlType="submit">
                    <Icon type="search" theme="outlined" />
                    查询
                </Button>
            </FormItem>
            </Form>
            <div>
                    <Table  className='mt15'  columns={columns} dataSource={data} pagination={false} title={() => '共 '+total+' 条数据'} footer={()=>''} rowKey='contractCode'/>
                <Pagination showQuickJumper defaultCurrent={pageNum} defaultPageSize={pageSize} total={total} onChange={this.onChange} />
            </div>
        </div>



    );
  }
}
const mapStateToProps = state => {
    const { usersWallet = {data: {}} , userInfo = {data: {}}} = state.httpData;
    return {usersWallet, userInfo};
};

const contractStatus = [
    {value:'1',name:'异常合同'},
    {value:'2',name:'执行中的合同'},
    {value:'3',name:'快到期合同'},
    {value:'4',name:'还款逾期合同'},
    {value:'5',name:'待审核合同'},
    {value:'6',name:'待签约合同'},
    {value:'7',name:'待交车合同'},
    {value:'8',name:'收款待复核合同'},
]

const mapDispatchToProps = dispatch => ({
    fetchData: bindActionCreators(fetchData, dispatch),
});



/*export default Form.create()(ContractRiskList);*/
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ContractRiskList))