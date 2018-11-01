
import React from 'react';
import { Row, Col,Card, Button, Icon, Divider, Message, Form, Select,Modal,Input, Table, DatePicker,Pagination} from 'antd';
import {fetch} from '../../api/tools'
import { receiveData, fetchData } from '@/action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AnnualInspectionRecordUpdate from "./AnnualInspectionRecordUpdate";
import { createHashHistory } from 'history';


const history = createHashHistory();
const FormItem = Form.Item;
const Option = Select.Option;


const vioType = [
  {key:1,name:'有违章'},
  {key:2,name:'无违章'},
  {key:3,name:'有可办违章'},
  {key:4,name:'有不可办违章'},
  {key:5,name:'有扣分违章'},
  {key:6,name:'有办理中违章'},
];

const dateType = [
  {key:1,name:'订单日期'},
  {key:2,name:'支付日期'},
  {key:3,name:'完成日期'},
  {key:4,name:'退款日期'},

]





/*const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park2',
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park1',
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park3',
},
    {
        key: '4',
        name: 'Joe Black4',
        age: 32,
        address: 'Sidney No. 1 Lake Park3',
    },
    {
        key: '5',
        name: 'Joe Black5',
        age: 32,
        address: 'Sidney No. 1 Lake Park3',
    },
    {
        key: '6',
        name: 'Joe Black6',
        age: 32,
        address: 'Sidney No. 1 Lake Park3',
    },
    {
        key: '7',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park3',
    },
    {
        key: '8',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park3',
    }];*/
const confirm = Modal.confirm;

class AnnualInspectionRecordList extends React.Component {
  state = {
    activeIndex: 0,
    isShowDetail:false,
    pageNum:1,
    pageSize:6,
    isShowList:true
  };

  //修改数据
    postAlarm = (params) =>{
        fetch('put','/chedui/zichan/annualInspectionRecord',params).then(res=>{
            if(res.code === 2000){
                const {pageNum,pageSize} = this.state
                this.onChange(pageNum,pageSize);
                this.setState({isShowDetail: false})
                Message.destroy()
                Message.success('修改成功')
            } else {
                Message.destroy()
                Message.error(res.msg)
            }
        })
    }

    updateOnChange = ()=>{
        const{pageNum,pageSize} = this.state
        this.onChange(pageNum,pageSize);
    }

    goBack = ()=>{
        this.setState({isShowDetail:false,isShowList:true})
    }

  del = (record)=>{
        // console.log(record)

    };

    find = (record)=>{
        // console.log(record)
        this.setState({carDetailRecord:record,isShowDetail:true,isShowList:false})
    };

    //确认是否删除
    confirm = (record)=>{
        // let _this = this;
        const {pageNum,pageSize} = this.state
        let this1 = this;
        confirm({
            titile:'删除',
            content:'确认删除?',
            onOk(){
                let _this = this1;
                fetch('delete','/chedui/zichan/annualInspectionRecord/'+record.inspectionId).then(res=>{
                    if (res.code===2000){
                        Message.success('删除成功');
                        _this.onChange(pageNum,pageSize);
                    }
                })
            }
        })
    }


  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('表格数据为: ', values);
      }
    });
  };

  /*onChange = (value) =>{
    console.log(value);
  }*/


  componentDidMount(){
      const {pageNum,pageSize}= this.state;
      this.onChange(pageNum,pageSize);
  }

    onChange = (pageNum,pageSize)=>{
      fetch('get','/chedui/zichan/annualInspectionRecord/'+pageNum+'/'+pageSize).then(res=>{
          if (res.code === 2000){
              // alert("获取成功");
              console.log(res.data);
              this.setState({data:res.data.rows,total:res.data.total,pageNum: pageNum,pageSize: pageSize,isShowDetail:false,isShowList:true});
          }
      })
  }




  render() {
      const columns = [{
          title: '车牌号',
          dataIndex: 'carNumber',
          key: 'carNumber',
      }, {
          title: '年检日期',
          dataIndex: 'inspectionDate',
          key: '2',
      }, {
          title: '年检处理人',
          dataIndex: 'inspectionUser',
          key: '3',
      }, {
          title: '年检金额',
          dataIndex: 'inspectionMoney',
          key: '4',
      },{
          title: '下次年检日期',
          dataIndex: 'nextInspectionDate',
          key: '5',
      },{
          title: '备注',
          dataIndex: 'remark',
          key: '6',
      },{
          title: '操作',
          key: '7', render:(record)=>
              <div>
                  <Button type='danger'  size='small' onClick={()=>this.confirm(record)}>删除</Button>
                  <Button type='primary'  size='small' onClick={()=>this.find(record)}>查看</Button>
              </div>

      },];
    const { getFieldDecorator} = this.props.form;
    const{ data,total,carDetailRecord,pageNum,pageSize} = this.state;
    return (

        <div style={{background: 'white', padding: '26px 16px 16px'}}>
            {this.state.isShowList&&<div>
                <Row><p style={{fontSize: '13px',fontWeight: '800'}}>年检记录</p></Row>
                <Divider style={{margin: '10px 0'}}></Divider>
                <Button type="primary" ghost onClick={()=>{history.push('/app/car/AnnualInspectionRecord')}}>添加年检记录</Button>
                <Table bordered className='mt15'  columns={columns} dataSource={data} pagination={false} />
                <Pagination showQuickJumper defaultCurrent={pageNum} defaultPageSize={pageSize} total={total} onChange={this.onChange} />
            </div>}
            {this.state.isShowDetail&&<div>
                <AnnualInspectionRecordUpdate carDetailRecord={this.state.carDetailRecord} goBack={this.goBack} updateOnChange={this.updateOnChange}/>
            </div>}
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



/*export default Form.create()(AnnualInspectionRecordList);*/
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AnnualInspectionRecordList))