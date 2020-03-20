<template>
  <div class="topo-toolbox">
    <q-list highlight separator class="full-height">
      <template v-for="(group,index1) in toolbox">
        <q-expansion-item :icon="group.icon" :label="group.title" v-bind:key="index1" @click="showImg(group,group.items,index1)">
          <div class="toolbox-group">
            <template v-for="(value,index) in group.items">
              <div
                class="toolbox-item"
                v-bind:key="index"
                draggable="true"
                @dragstart="onDragstart($event,value,index)"
                @touchstart="down($event,index)"
                @touchmove="move($event,index)"
                @touchend="end($event)"
                @mousedown="down($event,index)"
                @mousemove="move($event,index)"
                @mouseup="end($event)"
                
              >
                <!-- 判断是不是字体图标 -->
                <template v-if="value.isFontIcon === true">
                  <div class="toolbox-item-icon">
                    <q-icon :name="value.icon" size="30px" />
                  </div>
                  <div class="toolbox-item-text">{{value.text}}</div>
                </template>
            
                <!-- <template v-else-if="value.isFontIcon === 1">
                  <div class="item-icon">
                    
                  </div>
                  <div class="toolbox-item-text">{{ value.text }}</div>
                </template> -->
                 <template v-else-if="value.isFontIcon ===2">
                  <div class="item-icon">
                    <!-- <svg-icon :icon-class="value.icon"/> -->
                    <embed :src="value.info.style.url" :width="20" :height="20" style="pointer-events: none;text-align:center"
                  type="image/svg+xml"
                  pluginspage="http://www.adobe.com/svg/viewer/install/" />
                    
                    <!-- <svg  version="1.1" xmlns="http://www.w3.org/2000/svg" :width="20" :height="20" style="pointer-events: none;" v-html="loadData(value,value.icon)"></svg> -->
                  </div>
                  <div class="toolbox-item-text">{{ value.text }}</div>
                </template>
                <template v-else>
                  <div class="toolbox-item-icon">
                    <img class="topo-dom" :src="value.icon" style="width: 40px;height: 40px;" v-if="value.isFontIcon==4"/>
                  </div>
                  <div class="toolbox-item-text">{{value.text}}</div>
                </template>
              </div>
            </template>
          </div>
        </q-expansion-item>
      </template>
    </q-list>
  </div>
</template>

<script>
import jsonBase from './data-toolbox/base.json';
import jsonChart from './data-toolbox/chart.json';
import jsonOffice from './data-toolbox/office.json';
import jsonSvg from './data-toolbox/svg.json';
import jsonEvidence from './data-toolbox/evidence.json';
import jsonSvgDianli from './data-toolbox/svg-dianli.json';
import anquan from './data-toolbox/WebTopo/1.json'
import anniu from './data-toolbox/WebTopo/2.json'
import anniukaiguan from './data-toolbox/WebTopo/3.json'
import beijing from './data-toolbox/WebTopo/4.json'
import beng from './data-toolbox/WebTopo/5.json'
import beng2 from './data-toolbox/WebTopo/6.json'
import biaozhu from './data-toolbox/WebTopo/7.json'
import caitubiao from './data-toolbox/WebTopo/8.json'
import chumoping from './data-toolbox/WebTopo/9.json'
import deng from './data-toolbox/WebTopo/10.json'
import dianxian from './data-toolbox/WebTopo/11.json'
import dianyuan from './data-toolbox/WebTopo/12.json'
import donghua from './data-toolbox/WebTopo/13.json'
import dongtaitubiao from './data-toolbox/WebTopo/14.json'
import fadongji from './data-toolbox/WebTopo/15.json'
import famen from './data-toolbox/WebTopo/16.json'
import famenfuhao from './data-toolbox/WebTopo/17.json'
import fangkuang from './data-toolbox/WebTopo/18.json'
import fangxing from './data-toolbox/WebTopo/19.json'
import fangyuan from './data-toolbox/WebTopo/20.json'
import feishuichuli from './data-toolbox/WebTopo/21.json'
import fendangkaiguan from './data-toolbox/WebTopo/22.json'
import fuhao from './data-toolbox/WebTopo/23.json'
import gongchangsheshi from './data-toolbox/WebTopo/24.json'
import gongye from './data-toolbox/WebTopo/25.json'
import guan from './data-toolbox/WebTopo/26.json'
import guandao from './data-toolbox/WebTopo/27.json'
import gufeng from './data-toolbox/WebTopo/28.json'
import gufengji from './data-toolbox/WebTopo/29.json'
import guolu from './data-toolbox/WebTopo/30.json'
import HAVC from './data-toolbox/WebTopo/31.json'
import huaxue from './data-toolbox/WebTopo/32.json'
import jianzhu from './data-toolbox/WebTopo/33.json'
import jiaobanqi from './data-toolbox/WebTopo/34.json'
import jiareqi from './data-toolbox/WebTopo/35.json'
import jiqi from './data-toolbox/WebTopo/36.json'
import kaiguan from './data-toolbox/WebTopo/37.json'
import kanguananniu from './data-toolbox/WebTopo/38.json'

var touchStart=''
export default {
  name: 'TopoToolbox',
  data () {
    return {
      toolbox: [

      ],
      svgContent:'',
      selectedIndex: -1,
      flags: false,
      position: { x: 0, y: 0 },
      nx: '', ny: '', dx: '', dy: '', xPum: '', yPum: ''
    }

  },
  watch:{
        toolbox:{
        handler(newVal) {
    
      },
      deep:true
     }
  },
  methods: {
          //懒加载问题解决
          showImg(group,imgages,index){
            imgages.map(item=>{
              if(!item.isFontIcon){
                item.isFontIcon=4
              }
            })
            this.$set(this.toolbox,index,group)
          },
        onDragstart (event, info,index) {
          console.log(event)
          var infoJson = JSON.stringify(info.info);
          event.dataTransfer.setData('my-info', infoJson);
          this.down(event,index)
        },
     down(event,index){
               touchStart = document.getElementsByClassName('toolbox-item')
               console.log(event)
                this.flags = true;
                let touch;
                if(event.touches){
                    touch = event.touches[0];
                }else {
                    touch = event;
                }  
                this.position.x = touch.clientX;
                this.position.y = touch.clientY;
                this.dx = touchStart[index].offsetLeft;
                this.dy = touchStart[index].offsetTop;
            },
            move(event,index){
                if(this.flags){
                let touch ;
                if(event.touches){
                    touch = event.touches[0];
                }else {
                    touch = event;
                }
                this.nx = touch.clientX - this.position.x;
                this.ny = touch.clientY - this.position.y;
                this.xPum = this.dx+this.nx;
                this.yPum = this.dy+this.ny;
                //添加限制：只允许在屏幕内拖动
                const maxWidth = document.body.clientWidth - 54;//屏幕宽度减去悬浮框宽高
                const maxHeight = document.body.clientHeight - 54;
                if (this.xPum < 0) { //屏幕x限制
                    this.xPum = 0;
                } else if (this.xPum>maxWidth) {
                    this.xPum = maxWidth;
                }
                if (this.yPum < 0) { //屏幕y限制
                    this.yPum = 0;
                } else if (this.yPum>maxHeight) {
                    this.yPum = maxHeight;
                }
                touchStart[index].style.left = this.xPum+"px";
                touchStart[index].style.top = this.yPum +"px";
                //阻止页面的滑动默认事件
                document.addEventListener("touchmove",function(){ // 1.2 如果碰到滑动问题，请注意是否获取到 touchmove
                    event.preventDefault();//jq 阻止冒泡事件
                    // event.stopPropagation(); // 如果没有引入jq 就用 stopPropagation()
                },false);
                }
            },
            //鼠标释放时候的函数
            end(event){
                this.flags = false;
            },
          async loadData(val,url) {
              var that = this;
              await this.$axios.get(url)
              .then(function (response) {
              that.svgContent = response.data  
              return response.data;
              })
              .catch(function (error) {
                  console.log(error);
              });
              },  
  },
  mounted () {
    this.toolbox = [];
     this.toolbox.push(jsonBase);
    this.toolbox.push(jsonChart);
    
    this.toolbox.push(jsonSvg)
    this.toolbox.push(jsonEvidence)
    this.toolbox.push(anquan)   
    this.toolbox.push(anniu)   
    this.toolbox.push(anniukaiguan)
    this.toolbox.push(beijing)
    this.toolbox.push(beng)
    this.toolbox.push(beng2)
    this.toolbox.push(biaozhu)
    this.toolbox.push(caitubiao)
    this.toolbox.push(chumoping)
    this.toolbox.push(deng)
    this.toolbox.push(dianxian)
    this.toolbox.push(dianyuan)
    this.toolbox.push(dongtaitubiao)
    this.toolbox.push(fadongji)
    this.toolbox.push(famen)
    this.toolbox.push(famenfuhao)
    this.toolbox.push(fangkuang)
    this.toolbox.push(fangxing)
    this.toolbox.push(fangyuan)
    this.toolbox.push(feishuichuli)
    this.toolbox.push(fendangkaiguan)
    this.toolbox.push(fuhao)
    this.toolbox.push(gongchangsheshi)
    this.toolbox.push(gongye)
    this.toolbox.push(guan)
    this.toolbox.push(guandao)
    this.toolbox.push(gufeng)
    this.toolbox.push(gufengji)
    this.toolbox.push(guolu)
    this.toolbox.push(HAVC)
    this.toolbox.push(huaxue)
    this.toolbox.push(jianzhu)
    this.toolbox.push(jiaobanqi)
    this.toolbox.push(jiareqi)
    this.toolbox.push(jiqi)
    this.toolbox.push(kaiguan)
    this.toolbox.push(kanguananniu)
   this.toolbox.push(jsonOffice);
    console.log(this.toolbox)
  }
}
</script>

<style lang="scss">
.topo-toolbox {
  border: #ccc solid 1px;
  background-color: white;
  overflow-y: auto;
  overflow-x: hidden;

  .toolbox-group {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: space-between;

    .toolbox-item {
      width: 70px;
      margin: 10px 5px;
      padding: 5px;
      color: #777;
      border: transparent solid 1px;
      text-align:center;
      &.base {
        width: 64px;
      }
      .toolbox-item-icon {
        text-align: center;
      }

      .toolbox-item-text {
        margin-top: 10px;
        text-align: center;
      }
    }

    .toolbox-item:hover {
      border: #ccc solid 1px;
      background: #ccc;
      color: #3388ff;
      border-radius: 6px;
      cursor: pointer;
    }
  }
}
</style>
<style lang="scss" scoped>
.item-icon {
  height: 30px;
  .iconfont {
    font-size: 30px;
    margin-left: 14px;
  }
}
</style>