import React from 'react'
import {Message } from 'antd';
import axios from 'axios';
import {toQueryString} from '../../api/tools'

import lrz from 'lrz'



 class UpLoadImg extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      img: ''
    }
  }


  picture(base64) {
    this.postImgToUploadImg(base64);
  }

     /**
      * 上传图片到服务器
      * @param base64 base64图片
      */
     postImgToUploadImg = (base64) => {
         //添加图片
         // console.log(base64)
         // let img = this.state.img;
         // let index = imgs.push({
         //   tempSrc: base64
         // });

         this.setState({
             'img': base64
         });
         //上传图片到服务器
         let uploadimgData = {
             bizType: 'motorcade',
             bizTypeName: '车队SAAS',
             format: 'png',
             tags: '车辆照片',
             exId: '',
             thumbnail: "/resize,m_fixed,h_107,w_170",
             watermark: 0,
             deadline: 'D0',
             selfdescribed: '',
             createUser: 'RXK',
             fileBase64: base64.split(',')[1], //只上传图片流
             fileSize: '1124',
         };

         axios.post('https://test-pic.cx580.com/photo_gallery_api/photoUpload/uploadFileForMobileEnd', toQueryString(uploadimgData), {
             headers: {
                 'Content-Type': 'application/x-www-form-urlencoded',
                 Accept: 'application/json'
             }
         })
             .then(res => {
                 console.log(res);
                 if (res.data.code == 0) {
                     this.props.getImgUrl(this.props.type, res.data.data.thumbnails[0])
                 } else {
                     Message.destroy();
                     Message.error(res.msg)
                 }
             })
             .catch(err => console.log(err));

         // uploadImg(uploadimgData).then(data => {
         //   // Toast.hide();
         //   if (data.code === 0) {
         //     this.setState({
         //       'img': data.data.url
         //     });
         //     this.props.getImgUrl(this.props.type,data.data.url)
         //   } else {
         //     this.props.getImgUrl('')
         //     // res.message && Toast.info(res.message,1)
         //   }
         // }, () => {
         //   // Toast.info("系统繁忙，请稍后再试");
         // })

     };

  /**
   * 图片上传
   */

  // picture(base64) {
  //   this.postImgToUploadImg(base64);
  // }

  uploadImg(e){
    // Toast.info('图片上传中',10);
    let files = e.target.files;
    this._lrz(files[0]);
    //多张图片
    for (let i = 0; i < files.length; i++) {
      this._lrz(files[i], i);
    }
  }



  /**
   * 图片压缩上传
   * @param e 图片资源
   */
  _lrz(e) {
    try {
      let files = e;
      let quality = 1;
      if (files.size > 1024 * 1024 * 5) {
        quality = .5;
      }
      else if (files.size > 1024 * 1024 * 2) {
        quality = .5;
      }
      else if (files.size > 1024 * 1024) {
        quality = .5;
      }
      else if (files.size > 1024 * 500) {
        quality = .4;
      }
      else if (files.size > 1024 * 100) {
        quality = .5;
      } else {
        quality = .7;
      }
      lrz(files, {
        width: 1024,
        quality: quality
      }).then((rst) => {
        // 处理成功会执行
        rst.base64 && this.postImgToUploadImg(rst.base64);
      }).catch((err) => {
        // 处理失败会执行
        // Toast.fail('图片上传失败!', 2);
      }).always((err) => {
        // 不管是成功失败，都会执行
        this.refs.uploadImgInput.value = ""; //清空文件上传的内容 避免上传同一张照片或是拍照时出现的图片无法展示的bug
      });
    } catch (e) {
      // Toast.fail("图片上传失败", 2)
    }
  }


  render() {
    return (
        <div style={{position: 'relative'}}>
          <div className='input-btn'>
            选取文件
          </div>
          <input ref="uploadImgInput"
                 type="file"
                 accept="image/*"
                 onChange={(e) => this.uploadImg(e)}
                 className="hide-upload-input"
          />
          {this.props.url && <img src={this.props.url}/>}
          <div style={{color: 'rgba(0, 0, 0, 0.4)'}}>格式支持常规图片格式，JPG、PNG、BMP、JPEG等</div>
        </div>
    )
  }

}

export default UpLoadImg





