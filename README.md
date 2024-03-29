## WEB 组态

基于 vue+quasar 的 web 组态，核心代码基于 vue，quasar 仅仅是为了方便构建
(我是不太建议用 quasar,这个框架看起来比较麻烦，组件的事件基本上没有示例，看着不是太清晰（个人观点）)

## 后续重点 TODO

- 完善撤销和恢复
- 折线箭头（思路：增加控制锚点作为转折点）
- 属性元数据设计和属性编辑 UI 生成（思路：仿造 winform 的属性面板）

## 功能清单

| 功能                                              |     状态 |
| ------------------------------------------------- | -------: |
| 面板标尺                                          |     完成 |
| 拖曳添加组件                                      |     完成 |
| 位置移动-鼠标                                     |     完成 |
| 位置移动-方向键                                   |     完成 |
| 位置移动-批量                                     |     完成 |
| 拖动位置磁性吸附                                  |   未完成 |
| 尺寸锚点（8 个）                                  |     完成 |
| 旋转锚点                                          |     完成 |
| 选中效果                                          |     完成 |
| 层叠控制                                          |     完成 |
| 面板比例缩放                                      |     完成 |
| CTRL+C/V 复制黏贴                                 |     完成 |
| CTRL+A 多选                                       |     完成 |
| 鼠标框选                                          |     完成 |
| DELETE 删除（支持删除多个）                       |     完成 |
| 样式配置（文字、大小、位置、边框、颜色、旋转）    |     完成 |
| 组件继承体系                                      |     完成 |
| DOM 组件（文字、图片）                            |     完成 |
| canvas 组件（圆形、三角形、矩形、线条、箭头线条） |     完成 |
| 折线箭头                                          | 部分完成 |
| echarts 组件                                      |     完成 |
| SVG 组件                                          |     完成 |
| 组件同步/异步数据加载                             |     完成 |
| 通讯机制-事件总线                                 |     完成 |
| 通讯机制-VUEX                                     |   未开始 |
| 事件总线-WebSocket                                |   未开始 |
| 事件总线-MQTT                                     |   未开始 |
| VUEX-WebSocket                                    |   未开始 |
| VUEX-MQTT                                         |   未开始 |

## 高级功能

| 功能         |     状态 |
| ------------ | -------: |
| 批量编辑属性 |   未完成 |
| 对齐工具     |   未完成 |
| 撤销和恢复   | 有限支持 |
| 容器组件     |   未完成 |
| 动画         |   未完成 |

## 撤销和恢复支持操作列表

| 命令码   | 操作     | 撤销   |   恢复 |
| -------- | -------- | ------ | -----: |
| add      | 新增     | 支持   |   支持 |
| del      | 删除     | 支持   | 不支持 |
| move     | 移动     | 支持   |   支持 |
| select   | 选择     | 未完成 | 未完成 |
| --       | 反选     | 未完成 | 未完成 |
| resize   | 形变     | 未完成 | 未完成 |
| copy-add | 多项复制 | 未完成 | 未完成 |
| --       | 属性修改 | 未完成 | 未完成 |

## 存在问题

1. 目前的属性面板的鼠标编辑是硬编码的，这样初期拓展简单但是维护麻烦，更好的方法是每个属性定义完整的属性元数据，属性面板根据每个属性的元数据动态生成编辑，并支持属性分组

## 基础

1. 在 src/assets/data/topo-data.json 文件中

## 如何拓展控件

1. 定义数据文件（参见 \src\components\topo\data-toolbox 下的 json 文件）
2. 新增控件，根据数据文件的数据自己实现显示方式（在\src\components\topo\control 下新增控件，继承组件，可参考其他组件实现方式，整个思想就是利用第一步的数据绘制 dom 节点或 canvas 图像）
3. 注册控件到工具栏（在 TopoToolbox.vue 中）
4. 注册控件（在 TopoBase.vue 中）

其实整体思想很简单，就是定义一些数据，然后自己新增 vue 组件根据这些数据控制渲染和行为，其他的一些组态编辑操作是公共的。

## 组件和服务器通讯

3 种机制：独立 http、VUEX、事件总线（基于一个消息中心，订阅和发布消息的模式）

### 独立通讯-http

每个组件独立使用 http 接口和定时器实现，适用于少量组件的应用（组件太多会导致过多连接和定时器）

### 通讯机制-事件总线-演示

参见/src/assets/libs/simpleEventBus.js 和 ViewRect.vue 组件的演示代码（直接进入预览可看见矩形变色）

### 通知机制-VUEX-演示

未开始

### VUEX 通讯-WebSocket

未开始

### VUEX 通讯-MQTT

未开始

### 事件总线-WebSocket

准备中

### 事件总线-MQTT

未开始

## 构建过程

- 安装 NodeJs
- 安装 vue-cli：npm install -g @vue/cli
- 安装 quasar-cli：npm install -g @quasar/cli
- 进入根目录，执行安装 npm install（建议使用 cnpm 安装）
- 启动项目：quasar dev

更多构建功能请参考 quasar 官网，以下是一些常用的构建命令

### 运行开发服务器

\$ quasar dev

### 运行在特定端口

\$ quasar dev -p 9090

### PWA 模式

\$ quasar dev -m pwa

### 手机 App

\$ quasar dev -m cordova

### Electron 应用

\$ quasar dev -m electron

注意：Electron 应用等请参考官网配置相应的开发环境  
安装 yarn：npm install -g yarn  
设置 yarn 镜像：yarn config set registry http://registry.npm.taobao.org/  
安装 electron：yarn add --dev electron@^7.0.0 electron-debug@^3.0.0 electron-devtools-installer@^2.2.4 devtron@^1.4.0  
安装环境：cnpm install --global windows-build-tools

在打包过程中会从 github 下载文件，如果下载不了，可以直接百度网盘下载，网盘地址：
https://pan.baidu.com/s/1RiHHBDJMeiXLubaFzryTAw

## 如何打包

1. 编辑 quasar.conf.js 下的 publicPath，修改为实际的名称
2. 去编译后(使用命令 quasar build)的 dist 文件夹将文件拷贝到 web 服务器即可
3. 目前 publicPath 默认为 WebTopo，所以构建后访问http://127.0.0.1/WebTopo/即可  
   注意：由于 VUE 使用 history 模式，使用 nginx 等服务器需要解决路径 404 问题（本项目只有 2 个 url）

## 构建命令参考

### build for production

quasar build

### Electron App

quasar build -m electron
