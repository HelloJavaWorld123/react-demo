
import  React from 'react';
import { Row,Col,Card, Button,notification,Icon, Divider, Message, Form, Select, Input, Table, DatePicker,Pagination} from 'antd';
import {fetch} from '../../api/tools'
import { receiveData, fetchData } from '@/action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createHashHistory } from 'history';


const history = createHashHistory();
const FormItem = Form.Item;
const Option = Select.Option;

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


class AnnualInspectionRecordList extends React.Component {
  state = {
    activeIndex: 0,
    isShowCarDetail:false,
    pageNum :1,
    pageSize :6,
  };


    find = (record)=>{
        this.setState({carDetailRecord:record,isShowCarDetail:true})
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
      fetch('get','/chedui/zichan/carIllegalRecord/'+pageNum+'/'+pageSize).then(res=>{
          if (res.code === 2000){
              let rows = res.data.rows;
              for (let i = 0; i <rows.length; i++) {
                  rows[i].status = rows[i].status===0?'未处理':'已处理';
              }
              this.setState({data:rows,total:res.data.total,pageNum:pageNum,pageSize:pageSize});
          }
      })
  }

  refresh = ()=>{
    const {pageNum,pageSize} = this.state;
    this.onChange(pageNum,pageSize);
    notification['success']({
          message: '刷新违章提醒',
          description: '成功刷新违章',
      });
}



  render() {
      const columns = [{
          title: '车牌号',
          dataIndex: 'carNumber',
          key: 'carNumber',
      }, {
          title: '违章日期',
          dataIndex: 'illegalTime',
          key: '2',
      }, {
          title: '违章地点',
          dataIndex: 'illegalAddress',
          key: '3',
      }, {
          title: '违章内容',
          dataIndex: 'illegalContent',
          key: '1',
      }, {
          title: '违章扣分',
          dataIndex: 'illegalScore',
          key: '4',
      },{
          title: '违章罚款',
          dataIndex: 'illegalMoney',
          key: '5',
      },{
          title: '状态',
          dataIndex: 'status',
          key: '6',
      },];
    const{ data,total,pageNum,pageSize} = this.state;
    return (

        <div style={{background: 'white', padding: '26px 16px 16px'}}>
        <Row><p style={{fontSize: '13px',fontWeight: '800'}}>违章记录</p></Row>
        <Divider style={{margin: '10px 0'}}></Divider>
        <Button type="primary" ghost onClick={()=>{history.push('/app/car/CarIllegalRecord');}}>添加违章记录</Button>
        <Button type="primary" ghost onClick={()=>{this.refresh()}}>手动刷新</Button>
        <Table bordered className='mt15'  columns={columns} dataSource={data} pagination={false} />
        <Pagination showQuickJumper defaultCurrent={pageNum} defaultPageSize={pageSize} total={total} onChange={this.onChange} />
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