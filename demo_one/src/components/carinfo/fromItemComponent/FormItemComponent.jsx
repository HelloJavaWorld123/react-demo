/**
 *@author: RXK
 *@date:2018/10/22 18:14
 *@version: V1.0.0
 *@Des: 表单组件
 **/

import React from 'react'
import { Form, Input, Button, Message, DatePicker, Select, Card, InputNumber } from 'antd';
import monent from 'moment'
import { receiveData, fetchData } from '@/action';
import { fetch } from '../../../api/tools';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CarMaintainRecord from '../CarMaintainRecord'
import CarRentalRecord from '../CarRentalRecord'
import UploadImg from '../../system/UploadImg'
import AnnualInspectionRecordList from '../../otherinfo/AnnualInspectionRecordList'
import CarIllegalRecordList from '../../otherinfo/CarIllegalRecordList'
import CarInsuranceFileRecordList from '../../otherinfo/CarInsuranceFileRecordList'
import CarInsuranceRecordList from '../../otherinfo/CarInsuranceRecordList'
import CarRepairedRecordList from '../../otherinfo/CarRepairRecordList'

// 样式文件
import styles from './index.less'

const FormItem = Form.Item;
const Option = Select.Option;

class FormItemComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            activityIndex: 0,
            formLayout: 'horizontal',
            actionIndex: 2,
            carNumber: null,
            carInfoDetail: {},
            imageList: [],
            driverLicensePicture: [],
            carPicture: [],
            initPage: false,
            tabList: [
                {
                    tabName: '车辆具体信息',
                    indexKey: 0
                },
            ],
            activityTabIndex: 0
        };
    }

    checkCarNumber = (rule, value, callback) => {
        if (value && !(/([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{1}(([A-HJ-Z]{1}[A-HJ-NP-Z0-9]{5})|([A-HJ-Z]{1}(([DF]{1}[A-HJ-NP-Z0-9]{1}[0-9]{4})|([0-9]{5}[DF]{1})))|([A-HJ-Z]{1}[A-D0-9]{1}[0-9]{3}警)))|([0-9]{6}使)|((([沪粤川云桂鄂陕蒙藏黑辽渝]{1}A)|鲁B|闽D|蒙E|蒙H)[0-9]{4}领)|(WJ[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼·•]{1}[0-9]{4}[TDSHBXJ0-9]{1})|([VKHBSLJNGCE]{1}[A-DJ-PR-TVY]{1}[0-9]{5})/.test(value))) {
            callback('请输入正确的车牌号码')
        } else {
            callback();
        }
    };


    getImgUrl = (type, url) => {
        console.log("图片的信息是：", url);
        let { driverLicensePicture, carPicture } = this.state
        if (type == 'driverLicensePicture') {
            driverLicensePicture.push(url)
        } else {
            carPicture.push(url)
        }
        this.setState({
            driverLicensePicture,
            carPicture
        }, () => {
            // this.handleSubmit()
        })
    };

    componentDidMount() {
        let path = null;
        let parameter = null;
        if (this.props.match.params.params == 1) {
            path = '/api/car/info/detail';
            parameter = {
                id: this.props.match.params.id
            };
            this.setState({ actionIndex: this.props.match.params.params});
        } else if (this.props.match.params.params == 2) {
            path = '/api/car/info/detail';
            parameter = {
                id: this.props.match.params.id
            };
            this.setState({ actionIndex: this.props.match.params.params});
        }else if(this.props.match.params.params==3){
            this.setState({
                initPage:true
            })
        }
        if (this.props.match.params.params != 3) {
            fetch('post', path, parameter).then(res => {
                if (res.code == 2000) {
                    this.setState({ carInfoDetail: res.data }, () => {
                        console.log("后台获取的数据时：", res.data);
                        this.setState({
                            carNumber: this.state.carInfoDetail.carNumber,
                            initPage: true,
                            driverLicensePicture: res.data.driverLicensePicture,
                            carPicture: res.data.carPicture,
                        });
                        this.props.form.setFieldsValue({
                            carNumber: this.state.carInfoDetail.carNumber,
                            carEngineNumber: this.state.carInfoDetail.carEngineNumber,
                            carFrameNumber: this.state.carInfoDetail.carFrameNumber,
                            modelType: this.state.carInfoDetail.carModelType,
                            engineSource: this.state.carInfoDetail.engineSource,
                            siteNum: this.state.carInfoDetail.siteNum,
                            carCompany: this.state.carInfoDetail.carCompany,
                            driverLicensePicture: this.state.carInfoDetail.driverLicensePicture,
                            goodsSource: this.state.carInfoDetail.goodsSource,
                            carPicture: this.state.carInfoDetail.carPicture,
                            bodyColor: this.state.carInfoDetail.carBodyColor,
                            buyTime: monent(this.state.carInfoDetail.buyTime),
                            incomingTime: monent(this.state.carInfoDetail.incomingTime)
                        });
                    });

                } else {
                    Message.destroy();
                    Message.error(res.msg);
                }
            });
        }
    }

    handleSubmit = (e) => {
        console.log("表单开始提交");
        const { history } = this.props;
        // e.preventDefault();
        this.props.form.setFieldsValue({
            carPicture: this.state.carPicture,
            driverLicensePicture: this.state.driverLicensePicture
        });

        this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
            if (!err) {
                
                if (this.props.match.params.params == 3) {
                    this.addNewRecord(fieldsValue, history);
                } else {
                    this.updateRecord(fieldsValue, history);
                }
            }
        });
    };

    updateRecord = (fieldsValue, history) => {
        let params = {
            "id": this.props.match.params.id,
            "carNumber": fieldsValue.carNumber,
            "carEngineNum": fieldsValue.carEngineNumber,
            "carFrameNum": fieldsValue.carFrameNumber,
            "modelType": fieldsValue.modelType,
            "engineSource": fieldsValue.engineSource,
            "siteNum": fieldsValue.siteNum,
            "carCompany": fieldsValue.carCompany,
            "incomingTime": fieldsValue.incomingTime.format('YYYY-MM-DD HH:mm:ss'),
            "buyTime": fieldsValue.buyTime.format('YYYY-MM-DD HH:mm:ss'),
            "driverLicensePicture": this.state.driverLicensePicture,
            "goodsSource": fieldsValue.goodsSource,
            "carPicture": this.state.carPicture,
            "bodyColor": fieldsValue.bodyColor
        };
        fetch('post', '/api/car/info/update', params).then(res => {
            if (res.code == 2000) {
                history.push("/app/system/carListInfo");
            } else {
                Message.destroy();
                Message.error(res.msg || res.message);
            }
        });
    };

    addNewRecord = (fieldsValue, history) => {
        let params = {
            "carNumber": fieldsValue.carNumber,
            "carEngineNum": fieldsValue.carEngineNumber,
            "carFrameNum": fieldsValue.carFrameNumber,
            "modelType": fieldsValue.modelType,
            "engineSource": fieldsValue.engineSource,
            "siteNum": fieldsValue.siteNum,
            "carCompany": fieldsValue.carCompany,
            "incomingTime": fieldsValue.incomingTime.format('YYYY-MM-DD HH:mm:ss'),
            "buyTime": fieldsValue.buyTime.format('YYYY-MM-DD HH:mm:ss'),
            "driverLicensePicture": this.state.driverLicensePicture,
            "goodsSource": fieldsValue.goodsSource,
            "carPicture": this.state.carPicture,
            "bodyColor": fieldsValue.bodyColor
        };
        fetch('post', '/api/car/info/add', params).then(res => {
            if (res.code == 2000) {
                history.push("/app/system/carListInfo");
            } else {
                Message.destroy();
                Message.error(res.msg);
            }
        });
    };


    goToDetailPage = (carNumber, index, item,e) => {

        if(e.target.className=='addBtn'){
            if(index==1){
                this.props.history.push(`/app/system/rental/add/${carNumber}`)

            }else if(index==4){
                this.props.history.push(`/app/system/maintain/add/${carNumber}/null/0`) 
            }else if(index==5){
                this.props.history.push('/app/car/CarIllegalRecord/' + carNumber + '/' + this.state.carInfoDetail.carModelType)
            }else if(index==6){
                this.props.history.push('/app/car/CarRepairRecord/'+carNumber+'/'+this.state.carInfoDetail.carModelType)
            }else if(index==7){
                this.props.history.push('/app/car/CarInsuranceRecord/'+carNumber+'/'+this.state.carInfoDetail.carModelType)
            }else if(index==8){
                this.props.history.push('/app/car/AnnualInspectionRecord/'+carNumber+'/'+this.state.carInfoDetail.carModelType)
            }else if(index==9){
                this.props.history.push('/app/car/CarInsuranceFileRecord/'+carNumber+'/'+this.state.carInfoDetail.carModelType)
            }
            

            return 
        }
        console.log(index)
        let { tabList } = this.state
        let isHas = false
        tabList.map(_item => {
            if (_item.tabName == item.title) {
                isHas = true
            }
        })
        if (!isHas) {
            tabList.push({
                tabName: item.title,
                indexKey: index
            })
        }
        this.setState({
            carNumber,
            activityIndex: index,
            tabList,
            activityTabIndex: index
        });
    };

    // 选中的tab点击
    activityTabClick(e, data) {
        let { tabList } = this.state
        if (e.target.className == "close") {
            let closeIndex = ''
            console.log(data)
            tabList.map((item, index) => {
                if (item.tabName == data.tabName) {
                    closeIndex = index
                }
            })

            tabList.splice(closeIndex, 1)
            this.setState({ tabList, activityTabIndex: 0, activityIndex: 0 })
            return
        }
        this.setState({
            activityTabIndex: data.indexKey,
            activityIndex: data.indexKey
        })
    }

    render() {
        let { actionIndex, carNumber, activityIndex, initPage, tabList, activityTabIndex } = this.state;
        const { getFieldDecorator } = this.props.form;
        const { formLayout } = this.state;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 10, },
        };


        const buttonItemLayout = formLayout === 'horizontal' ? {
            wrapperCol: { span: 14, offset: 4 },
        } : null;

        const config = {
            rules: [{ type: 'object', required: true, message: '请选择正确的时间' }],
        };

        return (
            <div className={'fromItemComponent'}>
                {
                    actionIndex == 1 && <div className={'detailPageBtn'}>
                        <div className={'title'}>车辆记录</div>
                        <div className={'detailPageBtnCont'}>
                            {
                                OPTION_LIST.map((item, index) =>
                                    <div
                                        key={index + 'OPTION_LIST'}
                                        onClick={(e) => this.goToDetailPage(carNumber, index + 1, item,e)}
                                    >
                                        <p> {item.title}</p>
                                        <p>暂无记录</p>
                                        <p>等待录入新纪录</p>
                                        {
                                            item.ishasAdd&&<em className={'addBtn'}>+</em>
                                        }
                                    </div>
                                )
                            }
                        </div>

                    </div>
                }
                <br />
                <div className={'tabListCont'}>
                    {
                        tabList.map((item, index) => {
                            return <div key={index + 'tanlist'}
                                onClick={(e) => this.activityTabClick(e, item)}
                                className={'cursorPointer ' + (activityTabIndex == item.indexKey ? 'activityTabstyle' : '')}
                            >
                                <span>{item.tabName}</span>
                                {
                                    index > 0 && <span className={'close'}>&times;</span>
                                }
                            </div>
                        })
                    }
                </div>
                <div className={'contentBox '}>
                    <div className={((activityIndex != 0 && activityIndex != 4) ? 'borderStyles' : '')} >
                        {
                            activityIndex == 0 &&
                            <Card title="">
                                <Form onSubmit={this.handleSubmit} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div style={{ flex: '10', flexDirection: 'column' }}>
                                        <FormItem
                                            label="车牌号"
                                            hasFeedback
                                            {...formItemLayout}
                                        >
                                            {getFieldDecorator('carNumber', {
                                                rules: [{
                                                    required: true,
                                                    message: '请输入正确的车牌号码'
                                                }, {
                                                    validator: this.checkCarNumber
                                                }], validateTrigger: 'onBlur'
                                            })(
                                                <Input placeholder="合法车牌号" />
                                            )}
                                        </FormItem>
                                        <FormItem
                                            label="车架号码"
                                            hasFeedback
                                            {...formItemLayout}
                                        >
                                            {
                                                getFieldDecorator('carFrameNumber', {
                                                    rules: [{ required: true, message: '请输入正确的车架号码' }, {}],
                                                    validateTrigger: 'onBlur'
                                                })(
                                                    <Input placeholder="正确格式的车架号码" />
                                                )
                                            }

                                        </FormItem>
                                        <FormItem
                                            label="能源类型"
                                            hasFeedback
                                            {...formItemLayout}
                                        >
                                            {
                                                getFieldDecorator('engineSource', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请输入车辆能源类型'
                                                    },], validateTrigger: 'onBlur'
                                                })(
                                                    <Select initialValue={0}>
                                                        <Option value={1}>柴油</Option>
                                                        <Option value={2}>汽油</Option>
                                                        <Option value={3}>氢气</Option>
                                                        <Option value={4}>电</Option>
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                        <FormItem
                                            label="注册地址"
                                            hasFeedback
                                            {...formItemLayout}
                                        >
                                            {
                                                getFieldDecorator('carCompany', {
                                                    rules: [{
                                                        required: true,
                                                        message: '车辆注册地址'
                                                    },], validateTrigger: 'onBlur'
                                                })(
                                                    <Input placeholder="注册地址" />
                                                )
                                            }
                                        </FormItem>
                                        <FormItem
                                            label="座位数"
                                            {...formItemLayout}
                                        >
                                            {
                                                getFieldDecorator('siteNum', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请输入车辆座位数'
                                                    },],
                                                    validateTrigger: 'onBlur'
                                                })(
                                                    <InputNumber min={1} style={{ width: '256px' }} />
                                                )
                                            }
                                        </FormItem>
                                        <FormItem
                                            label="供应商"
                                            hasFeedback
                                            {...formItemLayout}
                                        >
                                            {
                                                getFieldDecorator('goodsSource', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请提供供应商'
                                                    },], validateTrigger: 'onBlur'
                                                })(
                                                    <Input placeholder="供应商" />
                                                )
                                            }
                                        </FormItem>
                                        <FormItem
                                            label="车引擎号码"
                                            hasFeedback
                                            {...formItemLayout}
                                        >
                                            {
                                                getFieldDecorator(
                                                    'carEngineNumber', {
                                                        rules: [{ required: true, message: '请输出正确的车辆引擎号码' }, {}],
                                                        validateTrigger: 'onBlur'
                                                    })(
                                                        <Input type="text" placeholder="正确格式的车引擎号码" />
                                                    )
                                            }
                                        </FormItem>
                                        <FormItem
                                            label="车身类型"
                                            hasFeedback
                                            {...formItemLayout}
                                        >
                                            {
                                                getFieldDecorator('modelType', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请输入车辆类型'
                                                    },],
                                                    validateTrigger: 'onBlur'
                                                })(
                                                    <Input placeholder="车身类型" />
                                                )
                                            }
                                        </FormItem>
                                    </div>
                                    <div style={{ flex: '10', flexDirection: 'column' }}>
                                        <FormItem
                                            label="车身颜色"
                                            hasFeedback
                                            {...formItemLayout}
                                        >
                                            {
                                                getFieldDecorator('bodyColor', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请选择车身颜色'
                                                    },], validateTrigger: 'onBlur'
                                                })(
                                                    <Select initialValue={0}>
                                                        <Option value={0}>黑色</Option>
                                                        <Option value={1}>红色</Option>
                                                        <Option value={2}>橙色</Option>
                                                        <Option value={3}>黄色</Option>
                                                        <Option value={4}>绿色</Option>
                                                        <Option value={5}>青色</Option>
                                                        <Option value={6}>蓝色</Option>
                                                        <Option value={7}>紫色</Option>
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                        <FormItem
                                            label="入库时间"
                                            hasFeedback
                                            {...formItemLayout}
                                        >
                                            {getFieldDecorator('incomingTime', config)(
                                                <DatePicker
                                                    placeholder="选择入库时间"
                                                    showTime
                                                    format="YYYY-MM-DD HH:mm:ss" />
                                            )}
                                        </FormItem>
                                        <FormItem
                                            label="采购时间"
                                            hasFeedback
                                            {...formItemLayout}
                                        >
                                            {getFieldDecorator('buyTime', config)(
                                                <DatePicker
                                                    placeholder="选择购买时间"
                                                    showTime
                                                    format="YYYY-MM-DD HH:mm:ss" />
                                            )}
                                        </FormItem>
                                        {
                                            initPage && <FormItem
                                                label="行驶证照片"
                                                {...formItemLayout}
                                            >
                                                {
                                                    getFieldDecorator('driverLicensePicture', {
                                                        rules: [{
                                                            required: true,
                                                            message: '行驶证照片'
                                                        },], validateTrigger: 'onBlur'
                                                    })(
                                                        <UploadImg
                                                            type={'driverLicensePicture'}
                                                            url={this.state.driverLicensePicture}
                                                            getImgUrl={this.getImgUrl}
                                                        />

                                                    )
                                                }

                                            </FormItem>
                                        }
                                        {
                                            initPage && <FormItem
                                                label="车辆照片"
                                                {...formItemLayout}
                                            >
                                                {
                                                    getFieldDecorator('carPicture', {
                                                        rules: [{ required: true, message: '请上传车辆照片' },]
                                                    })(
                                                        <UploadImg
                                                            type={'carPicture'}
                                                            _this={this}
                                                            url={this.state.carPicture}
                                                            getImgUrl={this.getImgUrl}
                                                        />
                                                    )
                                                }
                                            </FormItem>
                                        }


                                        {
                                            actionIndex != 1 &&
                                            <FormItem {...buttonItemLayout}>
                                                <Button type="primary" htmlType="submit" style={{ width: '60px' }}>确定</Button>
                                                <Button type="primary" htmlType="button" style={{ width: '60px' }}
                                                    onClick={() => this.props.history.push(`/app/system/carListInfo`)}>返回</Button>
                                            </FormItem>
                                            ||
                                            <FormItem {...buttonItemLayout}>
                                                <Button type="primary" htmlType="button" style={{ width: '60%' }}
                                                    onClick={() => this.props.history.push(`/app/system/carListInfo`)}>返回</Button>
                                            </FormItem>
                                        }
                                    </div>
                                </Form>
                            </Card>
                        }
                        {
                            activityIndex == 1 &&
                            <CarRentalRecord recordParam={this.state.carNumber} history={this.props.history} />
                        }
                        {
                            activityIndex == 4 &&
                            <CarMaintainRecord recordParam={this.state.carNumber} history={this.props.history} />
                        }

                        {
                            activityIndex == 5 &&
                            <CarIllegalRecordList carNumber={this.state.carInfoDetail.carNumber}
                                carType={this.state.carInfoDetail.carModelType} />
                        }
                        {
                            activityIndex == 6 &&
                            <CarRepairedRecordList carNumber={this.state.carInfoDetail.carNumber}
                                carType={this.state.carInfoDetail.carModelType} />
                        }
                        {
                            activityIndex == 7 &&
                            <CarInsuranceRecordList carNumber={this.state.carInfoDetail.carNumber}
                                carType={this.state.carInfoDetail.carModelType} />
                        }
                        {
                            activityIndex == 8 &&
                            <AnnualInspectionRecordList carNumber={this.state.carInfoDetail.carNumber}
                                carType={this.state.carInfoDetail.carModelType} />
                        }
                        {
                            activityIndex == 9 &&
                            <CarInsuranceFileRecordList carNumber={this.state.carInfoDetail.carNumber}
                                carType={this.state.carInfoDetail.carModelType} />
                        }
                        {
                            (activityIndex == 2 || activityIndex == 3) && <div className={'noDataStyle'}>
                                暂无记录
                            </div>
                        }
                    </div>
                </div>
                <br />
            </div>
        );
    }
}


const OPTION_LIST = [
    { title: '合同记录',ishasAdd:true},
    { title: '交租记录',ishasAdd:false},
    { title: '退押金记录' ,ishasAdd:false},
    { title: '维修记录' ,ishasAdd:true},
    { title: '违章记录' ,ishasAdd:true},
    { title: '保养记录' ,ishasAdd:true},
    { title: '出险记录' ,ishasAdd:true},
    { title: '年检记录' ,ishasAdd:true},
    { title: '保单记录' ,ishasAdd:true},
];


const mapStateToProps = state => {
    const { carInfoDetail = { data: {} } } = state.httpData;
    return { carInfoDetail };
};


const mapDispatchToProps = dispatch => ({
    fetchData: bindActionCreators(fetchData, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(FormItemComponent))