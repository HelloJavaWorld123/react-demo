
import React from 'react';
import { Row, Col,Card, Button, Icon,  Divider, message,  Table, Message, Modal} from 'antd';
import {fetch} from '../../api/tools'
import { receiveData, fetchData } from '@/action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


class News extends React.Component {
  state={
    newsInfo: [],
    modalContent: {}
  }

  componentDidMount(){
    this.fetchNews(1)
  }

  fetchNews=(current)=>{
    fetch('get',`/usercenter/messages/list?current=${current}&size=10`).then(res=>{
      if(res.code == 0){
        let newsInfo = res.data.records
        // newsInfo = this.state.newsInfo.concat(newsInfo);
        newsInfo.forEach((item,index)=>{
          item.number = (current-1)*10+index+1;
          item.type = 0?'后台消息':'系统消息'
        })
        this.setState({newsInfo: newsInfo, total: res.data.total, current: current})
      }else{
        Message.destroy()
        Message.error(res.msg)
      }
    })
  }

  fetchMore = (page,pageSize) =>{
    this.fetchNews(page.current)
  }


  showModal = (item) => {
    this.setState({
      visible: true,
      modalContent: item
    });
    let params = {
      id: item.id,
      status: 1,
    }
    // fetch('put','/usercenter/messages/update',params).then(res=>{
    //   if(res.code == 0){
    //     this.fetchNews(this.state.current)
    //     this.props.fetchData({funcName:'unreadNews',stateName: 'unreadNewsNum'})
    //   }else{
    //     Message.destroy()
    //     Message.error(res.msg)
    //   }
    // })
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  render() {
    let { newsInfo, total, modalContent, current} = this.state

    return (
        <div className="gutter-example">
          <Card>
            <Table
                columns={columns}
                dataSource={newsInfo}
                pagination={{total: total, current: current}}
                onChange={(page,pageSize)=>{this.fetchMore(page,pageSize)}}
                onRow={(record) => {
                  return {
                    onClick: () => {this.showModal(record)},       // 点击行
                  };
                }}
            />
          </Card>
          <Modal title="消息详情"
                 visible={this.state.visible}
                 onCancel={this.handleCancel}
                 footer={false}
          >
            <p style={{fontSize: '13px',marginLeft:'-5'}}>{`【${modalContent.type}】`}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{modalContent.createTime}</p>
            <p style={{color: '#ababab'}}>{modalContent.content}</p>
            <div className="modal-footer-btn">
              <Button type='primary' onClick={this.handleCancel}>我知道了</Button>
            </div>
          </Modal>
        </div>
    );
  }
}

const columns= [
  { title: '序号',
    // dataIndex: 'number',
    key: 'number' ,
    render: (record) =>
    <span>{record.number}</span>
  },
  { title: '时间 ',
    // dataIndex: 'createTime',
    key: 'createTime',
    render: (record) =>
        <span>{record.createTime}</span>
  },
  { title: '消息类型',
    // dataIndex: 'type',
    key: '1',
    render: (record) =>
        <span>{record.type}</span>
  },
  { title: '内容',
    // dataIndex: 'content',
    key: '2' ,
    width: '60%',
    render: (record) =>
        <span className={record.status == 0? 'c-blue col-content':'col-content'}>{record.content}</span>,
  },
];


const mapStateToProps = state => {
  const { responsive = {data: {}} } = state.httpData;
  return {responsive};
};


const mapDispatchToProps = dispatch => ({
  fetchData: bindActionCreators(fetchData, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(News)


