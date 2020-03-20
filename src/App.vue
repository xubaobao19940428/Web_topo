
<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import Parse from 'parse'
import { login,Getapp } from '@/api/login';
import Cookies from 'js-cookie';
import '@/icons'
export default {
  name: 'App',
  data(){
    return{
      username:'test',
      password:'123456'
      //  password:'iotn2n.com'
    }
  },
  mounted(){
     Parse.initialize("shuwa", "webapi","HZlora2017");
    //  Parse.serverURL = "http://ci.iotn2n.com:5080/iotapi";
    //  Parse.serverURL = "http://132.232.121.164:5080/iotapi";
     Parse.serverURL = "/iotapi";
    //  this.login()
    this.getDeviceDetail()
  },
  methods:{
    login(){
      Parse.User.logIn(this.username, this.password)
      .then(user => {
         Cookies.set("sessionToken", user.attributes.sessionToken)
         this.getDeviceDetail()
    })
  },
  getDeviceDetail(){
       var afterUrl =window.location.search.substring(1);
       var afterEqual = afterUrl.substring(afterUrl.indexOf('=')+1);
       var Product = Parse.Object.extend('Product')
       var product = new Parse.Query(Product)
       product.get(afterEqual).then(resultes=>{
         if(resultes.attributes.config){
           sessionStorage.setItem('configdata',JSON.stringify(resultes.attributes.config))
            var obj={
                topoData:resultes.attributes.config,
                selectedIsLayer: true, //当前选择的是不是layer层
                selectedComponent: null,//当前选择的单个组件--仅仅当只有一个组件选中有效，当有多个组件选中，则置为null
                selectedComponents: [], //当前选择的组件--只存identifier
                selectedComponentMap: {}, //当前选择的组件--key=identifier，本数据和selectedComponents同步，主要用于渲染判断
                copySrcItems: [],//当前是否使用了CTRL+C命令
                copyCount: 0,//copy计数，对于同一个复制源，每次复制后计数+1
                undoStack: [],//
                redoStack: [],// 
            }
            this.$store.dispatch('getConfigData',obj)
         }
         if(resultes.attributes.nodeType==1){
            var Product1 = Parse.Object.extend('Product')
            var product1 = new Parse.Query(Product1)
            product1.find().then(response=>{
             localStorage.setItem('productlist',JSON.stringify(response))
             localStorage.setItem('nodeType',1)
           })
         }else{
           localStorage.setItem('wumoxing',JSON.stringify(resultes.attributes.thing.properties))
           localStorage.setItem('nodeType',0)
         }
         
       })
    }
  }
}
</script>

<style>
</style>
