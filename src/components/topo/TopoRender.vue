<template>
  <div class="topo-render" :style="layerStyle" v-if="configData.layer">
    <template v-for="(component,index) in configData.components">
      <div
        class="topo-render-wrapper"
        :key="index"
        @click="doClickComponent(component,index)"
        @dblclick="doDbClickComponent(component)"
        :class="{'topo-render-wrapper-clickable': component.action.length > 0 }"
        v-show="component.style.visible == undefined? true:component.style.visible"
        :style="{
                        left: component.style.position.x + 'px',
                        top: component.style.position.y + 'px',
                        width: component.style.position.w + 'px',
                        height: component.style.position.h + 'px',
                        backgroundColor: component.style.backColor,
                        zIndex: component.style.zIndex,
                        borderWidth: component.style.borderWidth + 'px',
                        borderStyle: component.style.borderStyle,
                        borderColor: component.style.borderColor,
                        transform: component.style.transform? `rotate(${component.style.transform}deg)`:'rotate(0deg)',
                    }"
      >
        <component v-bind:is="parseView(component)" :detail="component" ref="spirit" />
        <span v-for="(item,index) in component.action" :key="index">
          <form
            method="POST"
            enctype="multipart/form-data"
            ref="uploadform"
            v-if="item.action=='image'||item.action=='video'||item.action=='audio'"
          >
            <input
              type="file"
              @change="upload($event)"
              style="position:relative;top:-40px; opacity:0;z-index:5;height:50px;width:100px;"
            />
          </form>
        </span>
      </div>
    </template>
  </div>
</template>

<script>
import TopoBase from "./TopoBase";
import axios from "axios";
import topoUtil from "./util/topo-util";

import { getDev, uploadFile } from "@/api/login";
import Cookies from "js-cookie";

import {signData,signData1} from '@/api/upload'
export default {
  name: "TopoRender",
  extends: TopoBase,
  components: {},
  computed: {
    layerStyle: function() {
      var styles = [];
      if (this.configData.layer.backColor) {
        styles.push(`background-color: ${this.configData.layer.backColor}`);
      }
      if (this.configData.layer.backgroundImage) {
        styles.push(
          `background-image: url("${this.configData.layer.backgroundImage}")`
        );
      }
      if (this.configData.layer.width > 0) {
        styles.push(`width: ${this.configData.layer.width}px`);
      }
      if (this.configData.layer.height > 0) {
        styles.push(`height: ${this.configData.layer.height}px`);
      }
      var style = styles.join(";");
      return style;
    }
  },
  data() {
    return {
      configData: {},

      type: "",
      title: "",
      contents: "",
      blob: "",
      component:[],
      componentindex:'',
       devaddr: "",
      productid: "",
      nodeType: "",
      standard:'',
      testbed:'',
      taskid:'',
      application:'',
      current:1,
      maxtotal:0,
      ispump:false,
    };
  },
  methods: {
    parseView(component) {
      return topoUtil.parseViewName(component);
    },
    doClickComponent(component,index) {
        this.component = component
        this.componentindex = index
        console.log(component,index)
      for (var i = 0; i < component.action.length; i++) {
        var action = component.action[i];
        if (action.type == "click") {
          this.handleComponentActuib(action);
        }
      }
    },
    doDbClickComponent(component) {
      for (var i = 0; i < component.action.length; i++) {
        var action = component.action[i];
        if (action.type == "dblclick") {
          this.handleComponentActuib(action);
        }
      }
    },

    //点击上传
    upload(event) {
      if (event) {
        var file = event.target.files[0]; //name: "dangqi1.png" || type: "image/png"
        var name = file.name;
        var type = file.type.split("/")[0];
        console.log(type)
        if (type === this.component.action[0].action) {
          //将图片img转化为base64
          var reader = new FileReader();
          reader.readAsDataURL(file);
          var that = this;
          reader.onloadend = function() {
            var dataURL = reader.result;
            console.log(reader)
            var blob = that.dataURItoBlob(dataURL);
            that.uploadFile(blob, name); //执行上传接口
          };
        } else if(this.component.action[0].action==='image') {
          this.$q.notify({
                color: 'purple',
                position: 'top',
                message: '请上传图片文件',
            })
        }else if(this.component.action[0].action==='video'){
          this.$q.notify({
                color: 'purple',
                position: 'top',
                message: '请上传视频文件',
            })
        }
        else if(this.component.action[0].action==='audio'){
          this.$q.notify({
                color: 'purple',
                position: 'top',
                message: '请上传音频文件',
            })
        }
      }
    },
    dataURItoBlob(dataURI) {
      // base64 解码
      var byteString = atob(dataURI.split(",")[1]);
      var mimeString = dataURI
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    },
    uploadFile(imgUrl, name) {
      var formdata = new FormData();
      formdata.append("file", imgUrl, name);
      formdata.append("output", 'json')
      formdata.append("path",Parse.User.current().id)
      formdata.append("auth_token", Cookies.get('sessionToken')) //下面是要传递的参数
      //此处必须设置为  multipart/form-data
      let config = {
        headers: {
          "Content-Type": "multipart/form-data" //之前说的以表单传数据的格式来传递fromdata
        }
      };
      axios
        .post("http://file.iotn2n.com/shapes/upload",formdata, config)
        .then(res => {
          if(res.status==200){
            var datas = {
              'url':res.data.url
            }
            var md5 = res.data.md5
            // signData('12345s',datas,md5,'1111').then(response=>{
              // if(response){
                this.component.action[0].action='link'
                this.component.action[0].showItems=res.data.url
                this.$set(this.configData.components,this.index,this.component)
                if(this.ispump==-1){
                    var Product = Parse.Object.extend("Product");
                    var product = new Product();
                    product.id =  this.productid
                    product.set('config',this.configData)
                    product.save().then(resultes=>{
                        if(resultes){
                            alert('保存成功')
                        }
                    })
                }else{
                    var Devices = Parse.Object.extend("Devices");
                    var devices = new Devices();
                    devices.id =this.productid
                    devices.set('basedata',this.configData)
                    devices.save().then(resultes=>{
                      if(resultes){
                            this.$q.notify({
                            color: 'positive',
                            position: 'top',
                            message: '保存成功',
                        })
                      }
                    })
                }
               
              // }
            // })
          }
        });
    },
    //打开链接
    handleComponentUrl(action) {
      window.open(action.showItems);
    },
    //弹窗弹起
    handleComponentAlert(action) {
      window.alert(action.showItems);
    },
    handleComponentActuib(action) {
      var _this = this;
      if (action.action == "visible") {
        if (action.showItems.length > 0) {
          action.showItems.forEach(identifier => {
            _this.showComponent(identifier, true);
          });
        }
        if (action.hideItems.length > 0) {
          action.hideItems.forEach(identifier => {
            _this.showComponent(identifier, false);
          });
        }
      } else if (action.action == "service") {
        _this.sendFun(action);
      } else if (action.action == "link") {
        _this.handleComponentUrl(action);
      } else if (action.action == "alert") {
        _this.handleComponentAlert(action);
      } else if (action.action == "image") {
        _this.upload();
      }else if (action.action == "video") {
        _this.upload();
      }else if (action.action == "audio") {
        _this.upload();
      }else if (action.action == "last") {
      } else if (action.action == "next") {
      }
    },
    showComponent(identifier, visible) {
      console.log("show:" + identifier + ",visible:" + visible);
      var spirits = this.$refs["spirit"];
      for (var i = 0; i < spirits.length; i++) {
        var spirit = spirits[i];
        if (spirit.detail.identifier == identifier) {
          spirit.detail.style.visible = visible;
          break;
        }
      }
    },
    //水泵应用取产品
    getReportDevices(){
      var Devices = Parse.Object.extend("Devices");
      var devices = new Parse.Query(Devices);
      devices.get(this.productid).then(resultes => {
        this.configData = resultes.attributes.basedata;
        var Devices1 = Parse.Object.extend("Devices");
        var devices1 = new Parse.Query(Devices1);
        devices1.equalTo('brand',this.taskid)
        devices1.count().then(count=>{
          this.maxtotal = count
        })
        // var Report = Parse.Object.extend('Report')
        // var report = new Report()
        // report.id = this.standard
        // var relation = report.relation('report')
        // var query = relation.query()
        // query.count().then(count=>{
        //   this.maxtotal = count
        // })
      }); 
    },
    //得到物模型模板
    getProductView() {
      var Product = Parse.Object.extend("Product");
      var product = new Parse.Query(Product);
      product.get(this.productid).then(resultes => {
        this.configData = resultes.attributes.config;
        getDev(this.devaddr, this.productid, Cookies.get("sessionToken")).then(
          response => {
            this.configData.components.map(item => {
              response.data.map(child => {
                if (item.wumoxing.identifier == child.identifier) {
                  item.wumoxing.value = child.value;
                }
              });
            });
          }
        );
      });
    },
    //实时刷新数据
    setIntervalDetail() {
      setInterval(() => {
        getDev(this.devaddr, this.productid).then(response => {
          this.configData.components.map(item => {
            response.data.map(child => {
              if (item.wumoxing.identifier == child.identifier) {
                item.wumoxing.value = child.value;
              }
            });
          });
        });
      }, 5000);
    },
    //得到url传参
    getparam() {
      var query = location.hash.substring(12);
      var values = query.split("&");
      var value = new Array(values.length);
      for (var i = 0; i < values.length; i++) {
        var pos = values[i].indexOf("=");
        if (pos == -1) continue;
        var paramname = values[i].substring(0, pos);
        value[i] = values[i].substring(pos + 1);
      }
      if(this.ispump==-1){
        this.devaddr = value[0];
        this.productid = value[1];
        this.getProductView();
      }else{
        this.standard = value[0]
        this.taskid = value[1]
        this.productid = value[2]
        this.testbed = value[3]
        this.getReportDevices()
      }
      
    },
  },
  mounted() {
    
    this.nodeType = localStorage.getItem("nodeType");
    if (localStorage.getItem("topoData")) {
      var temp = localStorage.getItem("topoData");
      this.configData = JSON.parse(temp);
    }
  },
//   beforeDestroy() {
//     localStorage.removeItem("topoData");
//   }
};
</script>

<style lang="scss">
.topo-render {
  overflow: auto;
  background-color: white;
  background-clip: padding-box;
  background-origin: padding-box;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: relative;
  height: 100%;
  .topo-render-wrapper {
    position: absolute;
  }

  .topo-render-wrapper-clickable {
    cursor: pointer;
  }
}
</style>

