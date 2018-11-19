/**
*@author: RXK
*@date:2018/11/3 9:47
*@version: V1.0.0
*@Des: 列表首页的按钮组件
**/

import React from 'react'
import {Button} from 'antd'

class ButtonList  extends React.Component{


    onChange = (item) =>{
        console.log("传送的item是：", item);
        this.props.action(item);
    };
    render(){
        return(
            <div style={{background: 'rgb(190, 200, 200)', padding: '26px 16px 16px',textAlign:'justify'}}>
                {this.props.data.map((item) =>
                    <Button type="primary" ghost className="button-list" onClick={() => this.onChange(item)}>
                        <p>{item.title}</p><p>{item.value}</p>
                    </Button>
                )}
            </div>
        );
    }
}
export default ButtonList