
import React from 'react';
import { Row, Col,Card, Button, Icon, Divider, Message, Form, Select, Input,Modal,Table, DatePicker,Pagination} from 'antd';
import {fetch} from '../../api/tools'
import { receiveData, fetchData } from '@/action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CarRepairRecordUpdate  from './CarRepairRecordUpdate';
import { createHashHistory } from 'history';


const history = createHashHistory();
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;




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


class CarRepairRecordList extends React.Component {
  state = {
    activeIndex: 0,
    isShowDetail:false,
    isShowList:true,
    pageNum:1,
    pageSize:5,
  };




    find = (record)=>{
        this.setState({carDetailRecord:record,isShowDetail:true,isShowList:false})
    };


  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('表格数据为: ', values);
      }
    });
  };



  componentDidMount(){
      const {pageNum,pageSize} = this.state;
      this.onChange(pageNum,pageSize);
  }

    onChange = (pageNum,pageSize)=>{
      fetch('get','/chedui/zichan/carRepairRecord/'+pageNum+'/'+pageSize).then(res=>{
          if (res.code === 2000){
              this.setState({data:res.data.rows,total:res.data.total,isShowDetail:false,isShowList:true,pageNum: pageNum,pageSize: pageSize});
          }
      })
  };

    updateOnChange = ()=>{
        const{pageNum,pageSize} = this.state
        this.onChange(pageNum,pageSize);
    }

  /*refresh = ()=>{
    const {pageNum,pageSize} = this.state;
    this.onChange(pageNum,pageSize);
    Message.success("刷新成功");
}*/

    //确认是否删除
    confirm = (record)=>{
        // let _this = this;
        const {pageNum,pageSize} = this.state;
        let this1 = this;
        confirm({
            titile:'删除',
            content:'确认删除?',
            onOk(){
                let _this = this1;
                fetch('delete','/chedui/zichan/carRepairRecord/'+record.id).then(res=>{
                    if (res.code===2000){
                        Message.success('删除成功');
                        _this.onChange(pageNum,pageSize);
                    }
                })
            }
        })
    };
    goBack = ()=>{
        this.setState({isShowDetail:false,isShowList:true})
    }



  render() {
      const columns = [{
          title: '车牌号',
          dataIndex: 'carNumber',
          key: 'carNumber',
      }, {
          title: '保养厂',
          dataIndex: 'company',
          key: '2',
      }, {
          title: '开始修理时间',
          dataIndex: 'beginTime',
          key: '3',
      }, {
          title: '结束时间',
          dataIndex: 'endTime',
          key: '1',
      }, {
          title: '下次保养时间',
          dataIndex: 'nextMaintainTime',
          key: '4',
      },{
          title: '保养金额',
          dataIndex: 'money',
          key: '5',
      },{
          title: '进厂公里数',
          dataIndex: 'maintainMeter',
          key: '6',
      },{
          title: '下次保养公里数',
          dataIndex: 'nextMaintainMeter',
          key: '7',
      },{
          title: '是否提车',
          dataIndex: 'carStats',
          key: '8',
      },{
          title: '备注',
          dataIndex: 'remark',
          key: '9',
      },{
          title: '操作',
          key: '10', render:(record)=>
              <div>
                  <Button type='danger'  size='small' onClick={()=>this.confirm(record)}>删除</Button>
                  <Button type='primary'  size='small' onClick={()=>this.find(record)}>查看</Button>
              </div>

      },];
    const{ data,total,pageNum,pageSize} = this.state;
    return (

        <div style={{background: 'white', padding: '26px 16px 16px'}}>
            {this.state.isShowList&&<div>
              <Row><p style={{fontSize: '13px',fontWeight: '800'}}>保养记录</p></Row>
              <Divider style={{margin: '10px 0'}}></Divider>
              <Button type="primary" ghost onClick={()=>{history.push('/app/car/CarRepairRecord');}}>添加保养记录</Button>
              <Table bordered className='mt15'  columns={columns} dataSource={data} pagination={false} />
              <Pagination showQuickJumper defaultCurrent={pageNum} defaultPageSize={pageSize} total={total} onChange={this.onChange} />
          </div>}
            {this.state.isShowDetail&&<div>
                <CarRepairRecordUpdate carDetailRecord={this.state.carDetailRecord} goBack={this.goBack} updateOnChange={this.updateOnChange} />
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



/*export default Form.create()(CarRepairRecordList);*/
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(CarRepairRecordList))