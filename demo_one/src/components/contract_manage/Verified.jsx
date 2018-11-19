import React from 'react';
import {Button, Form, Message, Modal,Input,Select,Divider,Row,Col,Tabs,Card} from 'antd';
import {fetch} from '../../api/tools'
import {fetchData, receiveData} from '@/action';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';


class Verified extends React.Component {
  state = {

  };


    updateOnChange = ()=>{

    }

    callback = ()=>{

    }




  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {

      }
    });
  };



  componentDidMount(){

  }




  render() {
      const pstyle = {
          fontSize:'15px',fontWeight:'500',lineHeight:'39px'
      };
      let {verification,title,cardStyle} = this.props;
      console.log('测试',verification);
            return (
                <div>
                    <Card title={<h3>{title}</h3>} bordered={false} style={cardStyle}>
                        <Row>
                                <Col span={5}>
                                    <p style={pstyle}>{"核查日期 : "+verification.checkTime}</p>
                                </Col>
                                <Col span={5}>
                                    <p style={pstyle}>{"核查方式 : "+(verification.checkWay===0?'胡椒核查小程序':'其他')}</p>
                                </Col>
                                <Col span={5}>
                                    <p style={pstyle}>{"核查人 : "+verification.checkBy}</p>
                                </Col>
                                <Col span={5}>
                                    <span style={pstyle}>核实截图: </span>
                                    <div className='UploadImg'>
                                        {
                                            JSON.parse(verification.checkImg==null?'[]':verification.checkImg).map((item,index) => {
                                                return <img src={item} key={index} style={{ width: '100px', height: '100px' }} />
                                            })
                                        }
                                    </div>

                                </Col>
                        </Row>
                    </Card>
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



/*export default Form.create()(Verified);*/
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Verified))