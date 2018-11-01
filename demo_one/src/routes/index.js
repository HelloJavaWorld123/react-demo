/**
 * Created by 叶子 on 2017/8/13.
 */
import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Home from '../components/home/Home';
import Service from '../components/service/Service';
import Detail from '../components/service/Detail';
import Balance from '../components/account/Balance';
import Exchange from '../components/account/Exchange';
import News from '../components/system/News';
import Authentication from '../components/system/Authentication';
import OperationLog from '../components/system/OperationLog';
import SetAccount from '../components/system/SetAccount';
import ChangePwd from '../components/system/ChangePwd';
import ChangePayPwd from '../components/account/ChangePayPwd';
import CarListInfo from '../components/carinfo/CarListInfo'
import FormItemComponent from '../components/carinfo/FormItemComponent'
import CarMaintainRecordList from '../components/carinfo/CarMaintainRecord'
import CarMaintainRecordDetail from '../components/carinfo/CarMaintainRecordDetail'
import CarRentalRecord from '../components/carinfo/CarRentalRecord'
import CarRentalRecordDetail from '../components/carinfo/CarRentalRecordDetail'
import AnnualInspectionRecordList from '../components/otherinfo/AnnualInspectionRecordList';
import AnnualInspectionRecord from '../components/otherinfo/AnnualInspectionRecord';
import CarIllegalRecordList from '../components/otherinfo/CarIllegalRecordList';
import CarIllegalRecord from '../components/otherinfo/CarIllegalRecord';
import CarInsuranceFileRecord from '../components/otherinfo/CarInsuranceFileRecord';
import CarInsuranceFileRecordList from '../components/otherinfo/CarInsuranceFileRecordList';
import CarRepairRecordList from '../components/otherinfo/CarRepairRecordList';
import CarRepairRecord from '../components/otherinfo/CarRepairRecord';
import CarInsuranceRecordList from '../components/otherinfo/CarInsuranceRecordList';
import CarInsuranceRecord from '../components/otherinfo/CarInsuranceRecord';


// const WysiwygBundle = (props) => (
//     <Bundle >
//         {(Component) => <Component {...props} />}
//     </Bundle>
// );

export default class CRouter extends Component {


    requireAuth = (permission, component) => {
        const { auth } = this.props;
        const { permissions } = auth.data;
        // const { auth } = store.getState().httpData;
        if (!permissions || !permissions.includes(permission)) return <Redirect to={'404'} />;
        return component;
    };
    render() {
      // if(!localStorage.getItem('piccToken')){
      //   return <Redirect to={'/'} />
      // }
      return (
            <Switch>
                <Route exact path="/app/home" component={Home} />
                <Route exact path="/app/service" component={Service} />
                <Route exact path="/app/service/detail/:id" component={Detail} />
                <Route exact path="/app/account/balance" component={Balance} />
                <Route exact path="/app/account/exchange" component={Exchange} />
                <Route exact path="/app/account/changePayPwd" component={ChangePayPwd} />
                <Route exact path="/app/system/news" component={News} />
                <Route exact path="/app/system/authentication" component={Authentication} />
                <Route exact path="/app/system/operationLog" component={OperationLog} />
                <Route exact path="/app/system/setAccount" component={SetAccount} />
                <Route exact path="/app/system/changePwd" component={ChangePwd} />
                <Route exact path="/app/system/carListInfo" component={CarListInfo}/>
                <Route exact path="/app/system/carMaintainList/:id" component={CarMaintainRecordList}/>
                <Route exact path="/app/system/carAdd/:id/:params" component={FormItemComponent}/>
                <Route exact path="/app/system/maintain/add/:id/:maintainId/:index" component={CarMaintainRecordDetail}/>
                <Route exact path="/app/system/rental/record" component={CarRentalRecord}/>
                <Route exact path="/app/system/rental/add/:carNumber/:index" component={CarRentalRecordDetail}/>
                <Route exact path="/app/car/AnnualInspectionRecord" component={AnnualInspectionRecord} />
                <Route exact path="/app/car/AnnualInspectionRecordList" component={AnnualInspectionRecordList} />
                <Route exact path="/app/car/CarIllegalRecordList" component={CarIllegalRecordList} />
                <Route exact path="/app/car/CarIllegalRecord" component={CarIllegalRecord} />
                <Route exact path="/app/car/CarInsuranceFileRecord" component={CarInsuranceFileRecord} />
                <Route exact path="/app/car/CarInsuranceFileRecordList" component={CarInsuranceFileRecordList} />
                <Route exact path="/app/car/CarRepairRecordList" component={CarRepairRecordList} />
                <Route exact path="/app/car/CarRepairRecord" component={CarRepairRecord} />
                <Route exact path="/app/car/CarInsuranceRecordList" component={CarInsuranceRecordList} />
                <Route exact path="/app/car/CarInsuranceRecord" component={CarInsuranceRecord} />
                <Route render={() => <Redirect to="/404" />} />
            </Switch>
        )
    }
}