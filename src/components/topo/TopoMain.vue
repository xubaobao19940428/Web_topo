<template>
<div class="topo-main">
    <vue-ruler-tool :parent="true" :is-scale-revise="true" style="width:100%;height: calc(100% - 40px);">
        <div
            tabindex="0"
            id="surface-edit-layer"
            class="topo-layer"                            
            :class="{'topo-layer-view-selected': selectedIsLayer}"
            :style="layerStyle"
            @click="onLayerClick($event)"
            @touchstart="onLayerMousedown($event)"
            @touchmove="onLayerMousemove($event)"
            @touchend="onLayerMouseup($event)"
            @mouseup="onLayerMouseup($event)" 
            @mousemove="onLayerMousemove($event)" 
            @mousedown="onLayerMousedown($event)" 
            @keyup.delete="removeItem()"
            @dragover.prevent
            @drop="onDrop"
            @keydown.ctrl.67.stop="copyItem"
            @keydown.ctrl.86.stop="pasteItem"
            @keydown.ctrl.90.stop="undo"
            @keydown.ctrl.89.stop="redo">
            <template v-for="(component,index) in configData.components">
                <div  
                     :key="component.identifier"
                     tabindex="0"
                     class="topo-layer-view"
                     :class="{'topo-layer-view-selected': selectedComponentMap[component.identifier] == undefined? false:true }" 
                     @click.stop="clickComponent(index,component,$event)"
                     @mousedown.stop="controlMousedown(component,$event,index)"
                     @touchstart.stop="controlMousedown(component,$event,index)"
                     @keyup.delete="removeItem()"
                     @keydown.up.exact.prevent="moveItems('up')"
                     @keydown.right.exact.prevent="moveItems('right')"
                     @keydown.down.exact.prevent="moveItems('down')"
                     @keydown.left.exact.prevent="moveItems('left')"                                     
                     @keydown.ctrl.67.stop="copyItem"
                     @keydown.ctrl.86.stop="pasteItem"
                     @keydown.ctrl.90.stop="undo"
                     @keydown.ctrl.89.stop="redo"                     
                     :style="{
                            left: component.style.position.x + 'px',
                            top: component.style.position.y + 'px',
                            width: component.style.position.w + 'px',
                            height: component.style.position.h + 'px',
                            'background-color': component.style.backColor,
                            zIndex: component.style.zIndex,
                            borderWidth: component.style.borderWidth + 'px',
                            borderStyle: component.style.borderStyle,
                            borderColor: component.style.borderColor,
                            transform: component.style.transform? `rotate(${component.style.transform}deg)`:'rotate(0deg)',
                        }">
                    <component v-bind:is="parseView(component)" :detail="component" :editMode="true" :selected="selectedComponentMap[component.identifier]?true:false" :ref="'comp' + index"/>
                    <!-- <div @mousedown.stop="resizeMousedown(component,$event,index,'resize-re')" v-show="selectedComponentMap[component.identifier]" class="resize-center-re"></div>                                  -->
                    <div @mousedown.stop="resizeMousedown(component,$event,index,'resize-lt')" v-show="selectedComponentMap[component.identifier]" class="resize-left-top"></div>
                    <div @mousedown.stop="resizeMousedown(component,$event,index,'resize-lc')" v-show="selectedComponentMap[component.identifier]" class="resize-left-center"></div>
                    <div @mousedown.stop="resizeMousedown(component,$event,index,'resize-lb')" v-show="selectedComponentMap[component.identifier]" class="resize-left-bottom"></div>
                    <div @mousedown.stop="resizeMousedown(component,$event,index,'resize-rt')" v-show="selectedComponentMap[component.identifier]" class="resize-right-top"></div>
                    <div @mousedown.stop="resizeMousedown(component,$event,index,'resize-rc')" v-show="selectedComponentMap[component.identifier]" class="resize-right-center"></div>
                    <div @mousedown.stop="resizeMousedown(component,$event,index,'resize-rb')" v-show="selectedComponentMap[component.identifier]" class="resize-right-bottom"></div>
                    <div @mousedown.stop="resizeMousedown(component,$event,index,'resize-ct')" v-show="selectedComponentMap[component.identifier]" class="resize-center-top"></div>
                    <div @mousedown.stop="resizeMousedown(component,$event,index,'resize-cb')" v-show="selectedComponentMap[component.identifier]" class="resize-center-bottom"></div>
                </div>
            </template>
            <div class="topo-frame-selection" :style="{width: frameSelectionDiv.width + 'px',height: frameSelectionDiv.height + 'px',top: frameSelectionDiv.top + 'px',left: frameSelectionDiv.left + 'px'}">
            </div>
        </div>
    </vue-ruler-tool>
    <div style="height: 40px;border-top: #ccc solid 1px;position:relative;background-color:white;" >
        <div style="position:absolute;left: 0px;" class="row">
            <div style="line-height:40px;height:40px;" >
                已选组件个数：{{selectedComponents.length}}
            </div>
            <q-btn label="预览" color="primary" size="xs" style="margin-left:10px;height:30px;margin-top:5px;" @click="fullScreen" />

            <q-btn label="当前数据" color="primary" size="xs" style="margin-left:10px;height:30px;margin-top:5px;" @click="printData" />
            <q-btn label="保 存" color="primary" size="xs" style="margin-left:10px;height:30px;margin-top:5px;" @click="addDeviceData(1)" />
        </div>
        <div style="position:absolute;right: 10px;top: 0px;top:-40px" class="row">                            
            <div style="line-height:40px;height:40px;padding: 0px 5px;">
                缩放
            </div>
            <q-slider
                v-model="selectedValue"
                :min="30"
                :max="200"
                :step="1"
                label
                :label-value="`${selectedValue}%`"
                snap
                style="width:200px;"
                />
        </div> 
        <!--测试touch事件生效-->
        <!-- <div id="webId">
            <div class="xuanfu" id="moveDiv"
            @mousedown="down()" @touchstart="down()"
            @mousemove="move()" @touchmove="move()"
            @mouseup="end()" @touchend="end()"
            >
            <div class="yuanqiu">11</div>
            </div>
        </div>-->
    </div>
</div>
</template>

<script>
import VueRulerTool from './ruler';
import TopoBase from './TopoBase';

import uid from '@/assets/libs/uid.js'

import topoUtil from './util/topo-util';
import {
    deepCopy
} from "@/assets/libs/utils";

import {
    checkInRange,checkByPointInRect,checkByRectCollisionDetection
} from "@/assets/libs/topo";

import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
import Parse from 'parse'
export default {
    name: 'TopoMain',
    extends: TopoBase,
    components: {        
        VueRulerTool
    },
    props: [],
    computed: {
        ...mapState({
            selectedComponents: state => state.topoEditor.selectedComponents,
            selectedComponentMap: state => state.topoEditor.selectedComponentMap,
            configData: state => state.topoEditor.topoData,
            selectedIsLayer: state => state.topoEditor.selectedIsLayer,
            copySrcItems: state => state.topoEditor.copySrcItems,
            copyCount: state => state.topoEditor.copyCount,
            devicid:state=>state.devicid           
        }),
        layerStyle:function () {
            var scale = this.selectedValue / 100;
            var styles = [`transform:scale(${scale})`];
            if(this.configData.layer.backColor) {
                styles.push(`background-color: ${this.configData.layer.backColor}`);
            }
            if(this.configData.layer.backgroundImage) {
                styles.push(`background-image: url("${this.configData.layer.backgroundImage}")`);
            }
            if(this.configData.layer.width > 0) {
                styles.push(`width: ${this.configData.layer.width}px`);
            }
            if(this.configData.layer.height > 0) {
                styles.push(`height: ${this.configData.layer.height}px`);
            }
            styles.push(`background-size:${this.configData.layer.width}px ${this.configData.layer.height}px`)
            var style = styles.join(';');
            return style;
        }
    },
    data() {
        return {
            moveItem: {
                startX: 0,
                startY: 0
            }, //移动组件 相关变量
            resizeItem: {
                startPx: 0,
                startPy: 0,
                x: 0,
                y: 0,
                w: 0,
                h: 0,
                rotate:0,
            }, //resize组件 相关变量  
            frameSelectionDiv: {
                width: 0,
                height: 0,
                top: 10,
                left: 10,
                startX: 0,
                startY: 0,
                startPageX: 0,                
                startPageY: 0,
            },          
            flag: '', //当前操作标志位
            curControl: null,
            curIndex: -1,
            selectedValue: 100,
            deviceId:'',
            flags: false,
            position: { x: 0, y: 0 },
            nx: '', ny: '', dx: '', dy: '', xPum: '', yPum: '',
            timer:null
        }
    },
    methods: {
        ...mapMutations('topoEditor',[
            'setSelectedComponent',
            'addSelectedComponent',
            'removeSelectedComponent',
            'clearSelectedComponent',
            'setLayerSelected',
            'setCopySrcItems',
            'increaseCopyCount',
            'execute',
            'undo',
            'redo'
        ]),
        ...mapActions('topoEditor',[
            'loadDefaultTopoData'
        ]),
        down(){
                this.flags = true;
                let touch;
                if(event.touches){
                    touch = event.touches[0];
                }else {
                    touch = event;
                }
                this.position.x = touch.clientX;
                this.position.y = touch.clientY;
                this.dx = moveDiv.offsetLeft;
                this.dy = moveDiv.offsetTop;
                console.log(moveDiv)
            },
            move(){
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
                moveDiv.style.left = this.xPum+"px";
                moveDiv.style.top = this.yPum +"px";
                //阻止页面的滑动默认事件
                document.addEventListener("touchmove",function(){ // 1.2 如果碰到滑动问题，请注意是否获取到 touchmove
                    event.preventDefault();//jq 阻止冒泡事件
                    // event.stopPropagation(); // 如果没有引入jq 就用 stopPropagation()
                },false);
                }
            },
            //鼠标释放时候的函数
            end(){
                this.flags = false;
            },

        controlMousedown(component,event,index) {
          
            if(event.ctrlKey) {                
                return;
            }
            this.flag = 'move';
            this.curControl = component;
            this.clickItem(component,index);
            this.moveItem.startX = event.pageX;
            this.moveItem.startY = event.pageY; 
            //记录初始信息--move
            for(var key in this.selectedComponentMap) {
                var component = this.selectedComponentMap[key];
                component.style.temp = {};
                component.style.temp.position = {};
                component.style.temp.position.x = component.style.position.x;
                component.style.temp.position.y = component.style.position.y;
            }         
        },
        resizeMousedown(component,$event,index,flag) {//resize-鼠标按下事件
        console.log(component,$event,index,flag)
            this.flag = flag;
            this.curControl = component;
            this.curIndex = index;
            this.clickItem(component,index);
            var dom = event.currentTarget;
            this.resizeItem.startPx = event.pageX;
            this.resizeItem.startPy = event.pageY;
            //记录初始信息-resize
            this.resizeItem.x = this.curControl.style.position.x;
            this.resizeItem.y = this.curControl.style.position.y;
            this.resizeItem.w = this.curControl.style.position.w;
            this.resizeItem.h = this.curControl.style.position.h;
            this.resizeItem.rotate = this.curControl.style.transform           
        },
       getAngle(cen, first, second) {
　　　　 // cen  : 中心点 [0,0]
　　　　 // first : 开始点 [1,3]
　　　　 // second : 结束位置 [3,4]
        var f_c_x = first[0] - cen[0],
            f_c_y = cen[1] - first[1],
            s_c_x = second[0] - cen[0],
            s_c_y = cen[1] - second[1];
        var c = Math.sqrt(f_c_x * f_c_x + f_c_y * f_c_y) * Math.sqrt(s_c_x * s_c_x + s_c_y * s_c_y);
        if (c == 0) return -1;
        var angle = Math.acos((f_c_x * s_c_x + f_c_y * s_c_y) / c);
        // 第一象限
        if (cen[0] - second[0] < 0 && cen[1] - second[1] < 0) {
           
            return angle*180
            // 第二象限
        } else if (cen[0] - second[0] < 0 && cen[1] - second[1] > 0) {
        
            return angle*180
            // 第三象限
        } else if (cen[0] - second[0] > 0 && cen[1] - second[1] < 0) {
         
            return (2 * Math.PI - angle)*180
            // 第四象限
        } else if (cen[0] - second[0] > 0 && cen[1] - second[1] > 0) {
            
            return (2 * Math.PI - angle)*180
        }
    },
        onLayerMousemove(event) {
            if(event.which != 1) {
                this.flag = '';
                return;
            }
            if (this.flag == '')
                return;
            if(this.flag.startsWith('resize')) {
                var dx = event.pageX - this.resizeItem.startPx,
                    dy = event.pageY - this.resizeItem.startPy;
                switch (this.flag) {
                    case 'resize-lt':
                        this.curControl.style.position.x = this.resizeItem.x + dx;
                        this.curControl.style.position.y = this.resizeItem.y + dy;
                        dx = -dx;
                        dy = -dy;
                        break;
                    case 'resize-lc':
                        this.curControl.style.position.x = this.resizeItem.x + dx;
                        dy = 0;
                        dx = -dx;                        
                        break;
                    case 'resize-lb':
                        this.curControl.style.position.x = this.resizeItem.x + dx;
                        dx = -dx;
                        break;
                    case 'resize-rt':
                        this.curControl.style.position.y = this.resizeItem.y + dy;
                        dy = -dy;                        
                        break;
                    case 'resize-rc':
                        dy = 0;
                        break;
                    case 'resize-rb':                        
                        break;
                    case 'resize-ct':
                        this.curControl.style.position.y = this.resizeItem.y + dy;
                        dx = 0;
                        dy = -dy;                        
                        break;
                    case 'resize-cb':
                        dx = 0;                        
                        break;
                    // case 'resize-re':
                    //       this.curControl.style.position.x = this.resizeItem.x
                    //       this.curControl.style.position.y = this.resizeItem.y
                    //       this.curControl.style.position.w=this.resizeItem.w 
                    //       this.curControl.style.position.h=this.resizeItem.h
                    //       this.curControl.style.transform=Math.ceil(this.getAngle([0,0],[this.resizeItem.startPx,this.resizeItem.startPy],[dx,dy]))
                    // break;
                }
                if((this.resizeItem.w + dx) > 20) {
                    this.curControl.style.position.w = this.resizeItem.w + dx;
                }
                if((this.resizeItem.h + dy) > 20) {
                    this.curControl.style.position.h = this.resizeItem.h + dy;
                }
                //canvas组件需要重新渲染
                // DOM 还没有更新
                this.$nextTick(function () {
                    // DOM 更新了
                    var a = this.$refs['comp' + this.curIndex][0];
                    a.onResize();
                });
            } else if(this.flag ==  'move') {
                //移动组件
                var dx = event.pageX - this.moveItem.startX,
                    dy = event.pageY - this.moveItem.startY;
                for(var key in this.selectedComponentMap) {
                    var component = this.selectedComponentMap[key];
                    component.style.position.x = component.style.temp.position.x + dx;
                    component.style.position.y = component.style.temp.position.y + dy;
                }
            } else if(this.flag == 'frame_selection') {
                this.onFrameSelection(event);                                
            } 
                event.preventDefault()

        },
        onLayerMouseup(event) {
        
            if(this.flag.startsWith('resize')) {                
                var a = this.$refs['comp' + this.curIndex][0];
                a.onResize();
            } else if(this.flag == 'frame_selection') {
                //由于和onLayerClick冲突，这里模拟下点击空白区域
                this.onFrameSelection(event);
                this.frameSelectionDiv.width = 0;
                this.frameSelectionDiv.height = 0;
                this.frameSelectionDiv.top = 0;
                this.frameSelectionDiv.left = 0;
            } else if(this.flag == 'move') {
                //鼠标move只是方便用户预览，真正执行应该用命令，所以要先恢复                
                var dx = event.pageX - this.moveItem.startX;
                var dy = event.pageY - this.moveItem.startY;
                for(var key in this.selectedComponentMap) {
                    var component = this.selectedComponentMap[key];
                    component.style.position.x = component.style.position.x - dx;
                    component.style.position.y = component.style.position.y - dy;
                }                
                this.execute({
                    op: 'move',
                    dx: dx,
                    dy: dy,
                    items: this.selectedComponentMap                                        
                });
            }else if(this.flag=='re')
            this.flag = '';
        },     
        onLayerMousedown($event) {
            console.log(222)
            this.flag = 'frame_selection';
            this.frameSelectionDiv.startX = event.offsetX;
            this.frameSelectionDiv.startY = event.offsetY;
            this.frameSelectionDiv.startPageX = event.pageX;
            this.frameSelectionDiv.startPageY = event.pageY;
        },
        onLayerClick() {
            // this.clearSelectedComponent(); 
            // this.setLayerSelected(true); 
        },
        onFrameSelection(event){
            var dx = event.pageX - this.frameSelectionDiv.startPageX;
            var dy = event.pageY - this.frameSelectionDiv.startPageY;  
            this.frameSelectionDiv.width = Math.abs(dx);
            this.frameSelectionDiv.height = Math.abs(dy);              
            if(dx > 0 && dy > 0) {            
                this.frameSelectionDiv.top = this.frameSelectionDiv.startY;
                this.frameSelectionDiv.left = this.frameSelectionDiv.startX;
            } else if(dx > 0 && dy < 0) {
                this.frameSelectionDiv.top = this.frameSelectionDiv.startY + dy;
                this.frameSelectionDiv.left = this.frameSelectionDiv.startX;
            } else if(dx < 0 && dy > 0) {
                this.frameSelectionDiv.top = this.frameSelectionDiv.startY;
                this.frameSelectionDiv.left = this.frameSelectionDiv.startX + dx;
            } else if(dx < 0 && dy < 0) {
                this.frameSelectionDiv.top = this.frameSelectionDiv.startY + dy;
                this.frameSelectionDiv.left = this.frameSelectionDiv.startX + dx;
            }
            //判断各个组件是否在方框内
            var _this = this;
            var rect = {
                x: this.frameSelectionDiv.left,
                y: this.frameSelectionDiv.top,
                width: this.frameSelectionDiv.width,
                height: this.frameSelectionDiv.height
            };
            var components = this.configData.components;
            components.forEach(component => {
                var itemRect = {
                    x: component.style.position.x,
                    y: component.style.position.y,
                    width: component.style.position.w,
                    height: component.style.position.h,
                };
                if(checkByRectCollisionDetection(rect,itemRect)) {
                    _this.addSelectedComponent(component);
                } else {
                    _this.removeSelectedComponent(component);
                }
            });            
            if(this.selectedComponents.length > 0) {
                this.setLayerSelected(false);
            } else {
                this.setLayerSelected(true);
            }
        }, 
        onDrop(event) {
            event.preventDefault();        
            var infoJson = event.dataTransfer.getData('my-info');
            var component = JSON.parse(infoJson);
            if(this.checkAddComponent(component) == false) {
                return;
            }
            //判断当前着陆点是不是layer
            if(event.target.id == "surface-edit-layer") {
                component.style.position.x = event.offsetX;
                component.style.position.y = event.offsetY; 
            } else {
                //解决着陆灯不是layer的情形
                var layer = event.currentTarget;
                var position = layer.getBoundingClientRect();
                var x = event.clientX - position.left;
                var y = event.clientY - position.top;
                component.style.position.x = x;
                component.style.position.y = y; 
            }
            //处理默认值
            this.execute({
                op: 'add',
                component: component
            });                                               
            //默认选中，并点击
            this.clickItem(component,this.configData.components.length - 1);
        },
        moveItems(direction){
            var dx = 0,dy = 0;
            if(direction == 'up') {
                dy = -5;
            } else if(direction == 'right') {
                dx = 5;
            } else if(direction == 'down') {
                dy = 5;
            } else if(direction == 'left') {
                dx = -5;
            }
            this.execute({
                op: 'move',
                dx: dx,
                dy: dy,
                items: this.selectedComponentMap                                        
            });
        },
        checkAddComponent(info){
            if(info == null) {
                this.$q.notify({
                    type: 'negative',
                    position: "bottom-right",
                    message: 'This component not surpport.'
                });
                return false;
            }
            return true;
        },
        parseView(component) {
            return topoUtil.parseViewName(component);
        },
        clickItem(component, index) {
            this.setLayerSelected(false);
            if(this.selectedComponentMap[component.identifier] == undefined) {
                this.setSelectedComponent(component);
            } else {
                //如果已经选中，则不做任何处理
            }
        },
        clickComponent(index,component,event){//点击组件
            if(event.ctrlKey == true) { //点击了ctrl
                this.setLayerSelected(false);
                if(this.selectedComponentMap[component.identifier] == undefined) {
                    this.addSelectedComponent(component);
                } else {
                    this.removeSelectedComponent(component);
                }
            } else {
                //这里不再处理点击事件，改为鼠标左键
                //this.clickItem(component,index);
            }                       
        },
        copyItem(){ // 设定复制源 
            var items = []; 
            for(var key in this.selectedComponentMap) {                
                var item = deepCopy(this.selectedComponentMap[key]); 
                items.push(item);
            }          
            this.setCopySrcItems(items);
        },
        pasteItem() {
            if(this.copySrcItems && this.copySrcItems.length > 0) {                
                this.execute({
                    op: 'copy-add',
                    items: this.copySrcItems,
                });
            }
        },
        removeItem(index,component) { //移除组件
            this.execute({
                op: 'del',
                index: index
            });
            this.setLayerSelected(true);  
        },        
        fullScreen() {
            var afterUrl =  window.location.search.substring(1);
            var afterEqual = afterUrl.substring(afterUrl.indexOf('=')+1);
            this.deviceid = afterEqual
            localStorage.setItem('topoData',JSON.stringify(this.configData));
            this.$router.push({
                path:'/fullscreen',
                query:{
                    deviceId: this.deviceid
                }
            })
        },
        addDeviceData(index){
          var afterUrl =  window.location.search.substring(1);
          var afterEqual = afterUrl.substring(afterUrl.indexOf('=')+1);
          this.deviceid = afterEqual
          this.$store.dispatch('getDeviceId',this.deviceid)
          this.configData.deviceid = this.$store.state.getDevices.deviceId
          var json = JSON.stringify(this.configData);
          var Product = Parse.Object.extend('Product')
          var product = new Product()
          if(this.devicid!=''){
              product.id = this.deviceid
            product.set('config',this.configData)
            product.save().then(resultes=>{
                if(resultes){
                    if(index==1){
                        this.$q.notify({
                            color: 'positive',
                            position: 'top',
                            message: '保存成功',
                        })
                    }
                        
                }
            },error=>{
                this.$q.notify({
                    color: 'purple',
                    position: 'top',
                    message: error.error,
                }) 
                window.clearInterval(this.timer)
                this.timer = null
            })
          }
        },
        setTimer(){
            this.timer = window.setInterval(() => {
                this.addDeviceData(0);
            }, 60000);
            
            },
        printData(){
            this.configData.deviceid = this.$store.state.getDevices.deviceId
            var json = JSON.stringify(this.configData);
            alert(json);
        },
        //判断产品是否有默认配置
        
    },
    
    mounted() {
        if(sessionStorage.getItem('configdata')){
        //     var obj={
        //         topoData:JSON.parse(sessionStorage.getItem('configdata')),
        //         selectedIsLayer: true, //当前选择的是不是layer层
        //         selectedComponent: null,//当前选择的单个组件--仅仅当只有一个组件选中有效，当有多个组件选中，则置为null
        //         selectedComponents: [], //当前选择的组件--只存identifier
        //         selectedComponentMap: {}, //当前选择的组件--key=identifier，本数据和selectedComponents同步，主要用于渲染判断
        //         copySrcItems: [],//当前是否使用了CTRL+C命令
        //         copyCount: 0,//copy计数，对于同一个复制源，每次复制后计数+1
        //         undoStack: [],//
        //         redoStack: [],// 
        //     }
        //    this.$store.dispatch('getConfigData',obj)
        }else{
            this.loadDefaultTopoData()
        }
    window.clearInterval(this.timer)
    this.setTimer()
    },
     beforeDestroy(){
      window.clearInterval(this.timer)
      this.timer = null
    
  }
}
</script>

<style lang="scss">
.topo-main {
    background-color: white;
    border: #ccc solid 1px;    
    position: relative;
    overflow-x: hidden;
    overflow-y: hidden;

    .topo-layer {
        width: 100%;
        height: 100%;
        position: absolute;
        transform-origin: left top;
        overflow: auto;
        // background-color: white;
        // background-clip: padding-box;
        // background-origin: padding-box;
        // background-repeat: no-repeat;
        // background-size: 100% 100%;
        background-image: 
        linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), 
        linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc); 
        background-size: 20px 20px;
        background-position: 0 0, 10px 10px;
        .topo-frame-selection {
            background-color: #8787e7;
            opacity: 0.3;
            border: #0000ff solid 1px;
            position: absolute;   
            z-index: 999;         
        }

        .topo-layer-view {
            position: absolute;
            height: 100px;
            width: 100px;
            background-color: #999;
            cursor: move;
            border: #ccc solid 1px;

            .resize-left-top {
                position: absolute;
                height: 10px;
                width: 10px;
                background-color: white;
                border: 1px solid #0cf;
                left: -5px;
                top: -5px;
                cursor: nwse-resize;
            }
            .resize-center-re {
                position: absolute;
                height: 10px;
                width: 10px;
                background-color: white;
                border: 1px solid #0cf;
                left: 50%;
                top: -40px;
                margin-left:-5px;
                transform: rotate(90deg);
                cursor: default;
            }
            .resize-left-center {
                position: absolute;
                height: 10px;
                width: 10px;
                background-color: white;
                border: 1px solid #0cf;
                left: -5px;
                top: 50%;
                margin-top: -5px;
                cursor: ew-resize;
            }

            .resize-left-bottom {
                position: absolute;
                height: 10px;
                width: 10px;
                background-color: white;
                border: 1px solid #0cf;
                left: -5px;
                bottom: -5px;
                cursor: nesw-resize;
            }

            .resize-right-top {
                position: absolute;
                height: 10px;
                width: 10px;
                background-color: white;
                border: 1px solid #0cf;
                right: -5px;
                top: -5px;
                cursor: nesw-resize;
            }

            .resize-right-center {
                position: absolute;
                height: 10px;
                width: 10px;
                background-color: white;
                border: 1px solid #0cf;
                right: -5px;
                top: 50%;
                margin-top: -5px;
                cursor: ew-resize;
            }

            .resize-right-bottom {
                position: absolute;
                height: 10px;
                width: 10px;
                background-color: white;
                border: 1px solid #0cf;
                right: -5px;
                bottom: -5px;
                cursor: nwse-resize;
            }

            .resize-center-top {
                position: absolute;
                height: 10px;
                width: 10px;
                background-color: white;
                border: 1px solid #0cf;
                top: -5px;
                left: 50%;
                margin-left: -5px;
                cursor: ns-resize;
            }

            .resize-center-bottom {
                position: absolute;
                height: 10px;
                width: 10px;
                background-color: white;
                border: 1px solid #0cf;
                bottom: -5px;
                left: 50%;
                margin-left: -5px;
                cursor: ns-resize;
            }
        }

        .topo-layer-view-selected {
            outline: 1px solid #0cf;
        }
    }
}
</style>
<style>
#webId { position: relative; }
  .xuanfu {
    height: 54px; 
    width: 54px;
    z-index: 999;
    position: fixed;
    top: 4.2rem;
    right: 3.2rem;
    border-radius: 0.8rem;
    background-color: rgba(0, 0, 0, 0.55);
  }
  .yuanqiu {
    height: 2.7rem;
    width: 2.7rem;
    border: 0.3rem solid rgba(140, 136, 136, 0.5);
    margin: 0.65rem auto;
    color: #000000;
    font-size: 1.6rem;
    line-height: 2.7rem;
    text-align: center;
    border-radius: 100%;
    background-color: #ffffff;
  }
</style>
