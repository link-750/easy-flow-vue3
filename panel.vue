<template>
    <div v-if="easyFlowVisible" style="height: 100%;">
        <el-row>
            <!--顶部工具菜单-->
            <el-col :span="24">
                <div class="ef-tooltar">
                    <el-link type="primary" :underline="false">{{flowName }}</el-link>
                    <el-divider direction="vertical"></el-divider>
                    <el-button type="primary" link icon="Delete" size="large" @click="deleteElement"
                        :disabled="!activeElement.type"></el-button>                        
                    <el-divider direction="vertical"></el-divider>
                    <el-button type="primary" link icon="Download" size="large" @click="downloadData"></el-button>
                    <el-divider direction="vertical"></el-divider>                 
                    <el-button type="primary"  link icon="Plus" size="large" @click="zoomAdd"></el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button type="primary" link icon="Minus" size="large" @click="zoomSub"></el-button>
                    <div style="float: right;margin-right: 5px">
                        <el-button type="info" plain round icon="el-icon-document" @click="dataInfo"
                            size="small">流程信息</el-button>
                        <!-- <el-button type="primary" plain round @click="dataReloadA" icon="el-icon-refresh"
                            size="small">切换流程A</el-button>
                        <el-button type="primary" plain round @click="dataReloadB" icon="el-icon-refresh"
                            size="small">切换流程B</el-button>
                        <el-button type="primary" plain round @click="dataReloadC" icon="el-icon-refresh"
                            size="small">切换流程C</el-button>
                        <el-button type="primary" plain round @click="dataReloadD" icon="el-icon-refresh"
                            size="small">自定义样式</el-button>
                        <el-button type="primary" plain round @click="dataReloadE" icon="el-icon-refresh"
                            size="small">力导图</el-button> -->
                        <el-button type="info" plain round icon="el-icon-document" @click="openHelp"
                            size="small">帮助</el-button>
                    </div>
                </div>
            </el-col>
        </el-row>
        <div style="display: flex;height: calc(100% - 47px);">
            <div style="width: 230px;border-right: 1px solid #dce3e8;">
                <node-menu @addNode="addNode" ref="nodeMenuRef"></node-menu>
            </div>
            <div id="efContainer" ref="efContainerRef" class="container" v-FlowDrag>
                <!-- <template > -->
                    <flow-node 
                         v-for="(node,index) in nodeList"
                          :id="node.id"
                          :node="node" 
                         :activeElement="activeElement" 
                        @changeNodeSite="changeNodeSite"
                        @nodeRightMenu="nodeRightMenu" 
                        @clickNode="clickNode">
                    </flow-node>
                <!-- </template> -->
                <!-- 给画布一个默认的宽度和高度 -->
                <div style="position:absolute;top: 680px;left: 1000px;">&nbsp;</div>
            </div>
            <!-- 右侧表单 -->
            <div style="width: 300px;border-left: 1px solid #dce3e8;background-color: #FBFBFB">
                <flow-node-form ref="nodeFormRef" @setLineLabel="setLineLabel"
                    @repaintEverything="repaintEverything"></flow-node-form>
            </div>
        </div>
        <!-- 流程数据详情 -->
        <flow-info v-if="flowInfoVisible" ref="flowInfoRef" :data="{
            name:flowName,
            nodeList:nodeList,
            lineList:lineList
        }"></flow-info>
        <flow-help v-if="flowHelpVisible" ref="flowHelpRef"></flow-help>
    </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus'
 import { jsPlumb } from 'jsplumb'
// 使用修改后的jsplumb
// import './jsplumb'
import { config } from '@/Components/ef/jsplumbConfig.js'
import flowNode from '@/Components/ef/node.vue'
import nodeMenu from '@/Components/ef/node_menu.vue'
import FlowInfo from '@/Components/ef/info.vue'
import FlowHelp from '@/Components/ef/help.vue'
import FlowNodeForm from './node_form.vue'
import lodash from 'lodash'
import { getDataA } from './data_A'
import { getDataB } from './data_B'
import { getDataC } from './data_C'
import { getDataD } from './data_D'
import { getDataE } from './data_E'
import { ForceDirected } from './force-directed'

let nodeFormRef = ref();
let nodeMenuRef = ref();
let efContainerRef = ref();
let flowInfoRef = ref();
let flowHelpRef = ref();
// jsPlumb 实例
let jsPlumbIns = null;
// 控制画布销毁
let easyFlowVisible = ref(true);
// 控制流程数据显示与隐藏
let flowInfoVisible = ref(false);
// 是否加载完毕标志位
let loadEasyFlowFinish = ref(false);
let flowHelpVisible = ref(false);
// 数据
//  let flowData = reactive({ 
//     name:'',
//     nodeList:[],
//     lineList:[]
//  });

 let flowName=ref('');
 let nodeList=ref([]);
 let lineList=ref([]);


// 激活的元素、可能是节点、可能是连线
let activeElement = reactive({
    // 可选值 node 、line
    type: undefined,
    // 节点ID
    nodeId: undefined,
    // 连线ID
    sourceId: undefined,
    targetId: undefined
});
let zoom = ref(0.5);

onMounted(() => {
    jsPlumbIns = jsPlumb.getInstance();
    nextTick(() => {
        dataReload(getDataB());
    });
})

//自定义指令
const vFlowDrag = {
    mounted(el, binding, vnode, oldNode) {
        if (!binding) {
            return
        }
        el.onmousedown = (e) => {
            if (e.button == 2) {
                // 右键不管
                return;
            }
            //  鼠标按下，计算当前原始距离可视区的高度
            let disX = e.clientX;
            let disY = e.clientY;
            el.style.cursor = 'move';

            document.onmousemove = function (e) {
                // 移动时禁止默认事件
                e.preventDefault();
                const left = e.clientX - disX;
                disX = e.clientX;
                el.scrollLeft += -left;

                const top = e.clientY - disY;
                disY = e.clientY;
                el.scrollTop += -top;
            }

            document.onmouseup = function (e) {
                el.style.cursor = 'auto';
                document.onmousemove = null;
                document.onmouseup = null;
            }
        }
    }
}





// 返回唯一标识
const getUUID = function () {
    return Math.random().toString(36).substr(3, 10)
}
const jsPlumbInit = function () {
    jsPlumbIns.ready(() => {
        // 导入默认配置
        jsPlumbIns.importDefaults(config.jsplumbSetting)
        // 会使整个jsPlumb立即重绘。
        jsPlumbIns.setSuspendDrawing(false, true);
        // 初始化节点
        loadEasyFlow();
        // 单点击了连接线, https://www.cnblogs.com/ysx215/p/7615677.html
        jsPlumbIns.bind('click', (conn, originalEvent) => {
            activeElement.type = 'line'
            activeElement.sourceId = conn.sourceId
            activeElement.targetId = conn.targetId
            nodeFormRef.value.lineInit({
                from: conn.sourceId,
                to: conn.targetId,
                label: conn.getLabel()
            })
        })
        // 连线
        jsPlumbIns.bind("connection", (evt) => {
            let from = evt.source.id
            let to = evt.target.id
            if (loadEasyFlowFinish.value) {
                lineList.value.push({ from: from, to: to })
            }
        })

        // 删除连线回调
        jsPlumbIns.bind("connectionDetached", (evt) => {
            deleteLine(evt.sourceId, evt.targetId)
        })

        // 改变线的连接节点
        jsPlumbIns.bind("connectionMoved", (evt) => {
            changeLine(evt.originalSourceId, evt.originalTargetId);
        })

        // 连线右击
        jsPlumbIns.bind("contextmenu", (evt) => {
            console.log('contextmenu', evt)
        })

        // 连线
        jsPlumbIns.bind("beforeDrop", (evt) => {
            let from = evt.sourceId;
            let to = evt.targetId;
            if (from === to) {
                ElMessage.error('节点不支持连接自己');
                return false;
            }
            if (hasLine(from, to)) {
                ElMessage.error('该关系已存在,不允许重复创建');
                return false;
            }
            if (hashOppositeLine(from, to)) {
                ElMessage.error('不支持两个节点之间连线回环');
                return false;
            }
            ElMessage.success('连接成功');
            return true;
        })

        // beforeDetach
        jsPlumbIns.bind("beforeDetach", (evt) => {
            console.log('beforeDetach', evt)
        })
        jsPlumbIns.setContainer(efContainerRef.value);
    })
}
// 加载流程图
const loadEasyFlow = function () {
    // 初始化节点
    for (var i = 0; i < nodeList.value.length; i++) {
        let node = nodeList.value[i];
        // 设置源点，可以拖出线连接其他节点
        jsPlumbIns.makeSource(node.id, lodash.merge(config.jsplumbSourceOptions, {}))
        // // 设置目标点，其他源点拖出的线可以连接该节点
        jsPlumbIns.makeTarget(node.id, config.jsplumbTargetOptions)
        if (!node.viewOnly) {
            jsPlumbIns.draggable(node.id, {
                containment: 'parent',
                stop: function (el) {
                    // 拖拽节点结束后的对调
                    console.log('拖拽结束: ', el)
                }
            })
        }
    }
    // 初始化连线
    for (var i = 0; i <  lineList.value.length; i++) {
        let line =  lineList.value[i];
        var connParam = {
            source: line.from,
            target: line.to,
            label: line.label ? line.label : '',
            connector: line.connector ? line.connector : '',
            anchors: line.anchors ? line.anchors : undefined,
            paintStyle: line.paintStyle ? line.paintStyle : undefined,
        }
        jsPlumbIns.connect(connParam,config.jsplumbConnectOptions)
    }
    nextTick( ()=> {
        loadEasyFlowFinish.value = true;
    })
}
// 设置连线条件
const setLineLabel = function (from, to, label) {
    var conn = jsPlumbIns.getConnections({
        source: from,
        target: to
    })[0];
    if (!label || label === '') {
        conn.removeClass('flowLabel')
        conn.addClass('emptyFlowLabel')
    } else {
        conn.addClass('flowLabel')
    }
    conn.setLabel({
        label: label,
    })
    lineList.value.forEach(function (line) {
        if (line.from == from && line.to == to) {
            line.label = label;
        }
    })

}
// 删除激活的元素
const deleteElement = function () {
    if (activeElement.type === 'node') {
        deleteNode(activeElement.nodeId)
    } else if (activeElement.type === 'line') {
        ElMessageBox.confirm('确定删除所点击的线吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            var conn = jsPlumbIns.getConnections({
                source: activeElement.sourceId,
                target: activeElement.targetId
            })[0]
            jsPlumbIns.deleteConnection(conn);
        }).catch(() => {
        })
    }
}
// 删除线
const deleteLine = function (from, to) {
    lineList.value =  lineList.value.filter(function (line) {
        if (line.from == from && line.to == to) {
            return false;
        }
        return true;
    })
}
// 改变连线
const changeLine = function (oldFrom, oldTo) {
    deleteLine(oldFrom, oldTo);
}
// 改变节点的位置
const changeNodeSite = function (dataVal) {
    for (var i = 0; i <nodeList.value.length; i++) {
        let node = nodeList.value[i];
        if (node.id === dataVal.nodeId) {
            node.left = dataVal.left;
            node.top = dataVal.top;
        }
    }
}
/**
 * 拖拽结束后添加新的节点
 * @param evt
 * @param nodeMenu 被添加的节点对象
 * @param mousePosition 鼠标拖拽结束的坐标
 */
const addNode =function (evt, nodeMenu, mousePosition) {
    var screenX = evt.originalEvent.clientX, screenY = evt.originalEvent.clientY
    let efContainer = efContainerRef.value;
    var containerRect = efContainer.getBoundingClientRect()
    var left = screenX, top = screenY
    // 计算是否拖入到容器中
    if (left < containerRect.x || left > containerRect.width + containerRect.x || top < containerRect.y || containerRect.y > containerRect.y + containerRect.height) {
        ElMessage.error("请把节点拖入到画布中")
        return
    }
    left = left - containerRect.x + efContainer.scrollLeft
    top = top - containerRect.y + efContainer.scrollTop
    // 居中
    left -= 85
    top -= 16
    var nodeId = getUUID();
    // 动态生成名字
    var origName = nodeMenu.name;
    var nodeName = origName;
    var index = 1;
    while (index < 10000) {
        var repeat = false
        for (var i = 0; i < nodeList.value.length; i++) {
            let node = nodeList.value[i]
            if (node.name === nodeName) {
                nodeName = origName + index;
                repeat = true;
            }
        }
        if (repeat) {
            index++;
            continue;
        }
        break
    }
    var node = {
        id: nodeId,
        name: nodeName,
        type: nodeMenu.type,
        left: left + 'px',
        top: top + 'px',
        ico: nodeMenu.ico,
        state: 'success'
    }
    /**
     * 这里可以进行业务判断、是否能够添加该节点
     */
     nodeList.value.push(node);   
      nextTick(()=> {       
        jsPlumbIns.makeSource(nodeId, config.jsplumbSourceOptions);
        jsPlumbIns.makeTarget(nodeId, config.jsplumbTargetOptions);
        jsPlumbIns.draggable(nodeId, {
            containment: 'parent',           
        });
    })
   
}
/**
 * 删除节点
 * @param nodeId 被删除节点的ID
 */
const deleteNode = function (nodeId) {
    ElMessageBox.confirm('确定要删除节点' + nodeId + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
    }).then(() => {
        /**
         * 这里需要进行业务判断，是否可以删除
         */
         nodeList.value = nodeList.value.filter( (node) =>{
            if (node.id === nodeId) {
                // 伪删除，将节点隐藏，否则会导致位置错位
               //  node.show = false
                return false;
            }
            return true;
        })
        nextTick(() =>{
            jsPlumbIns.removeAllEndpoints(nodeId);
            jsPlumbIns.remove(nodeId);//移除节点
        })
    }).catch(() => {
    })
    return true
}
const clickNode = function (nodeId) {
    activeElement.type = 'node';
    activeElement.nodeId = nodeId;
    nodeFormRef.value.nodeInit({
         name:flowName.value,
         nodeList:nodeList.value,
         lineList:lineList.value
    }, nodeId);
}
// 是否具有该线
const hasLine = function (from, to) {
    for (var i = 0; i < lineList.value.length; i++) {
        var line = lineList.value[i];
        if (line.from === from && line.to === to) {
            return true;
        }
    }
    return false;
}
// 是否含有相反的线
const hashOppositeLine = function (from, to) {
    return hasLine(to, from);
}
const nodeRightMenu = function (nodeId, evt) {
    menu.show = true;
    menu.curNodeId = nodeId;
    menu.left = evt.x + 'px';
    menu.top = evt.y + 'px';
}
const repaintEverything = function () {
    jsPlumbIns.repaint();
}
// 流程数据信息
const dataInfo = function () {
    flowInfoVisible.value = true;
    nextTick(()=> {
        flowInfoRef.value.init();
    })
}
// 加载流程图
const dataReload = function (dataVal) {
    easyFlowVisible.value = false;
    nodeList.value = [];
    lineList.value = [];
    nextTick(() => {       
        easyFlowVisible.value = true;
        flowName.value=dataVal.name;
        nodeList.value=dataVal.nodeList;
        lineList.value=dataVal.lineList;
        nextTick(() => {
            jsPlumbIns = jsPlumb.getInstance()
            nextTick(() => {
                jsPlumbInit();
            })
        })
    })
}
// 模拟载入数据dataA
const dataReloadA = function () {
    dataReload(getDataA());
}
// 模拟载入数据dataB
const dataReloadB = function () {
    dataReload(getDataB());
}
// 模拟载入数据dataC
const dataReloadC = function () {
    dataReload(getDataC());
}
// 模拟载入数据dataD
const dataReloadD = function () {
    dataReload(getDataD());
}
// 模拟加载数据dataE，自适应创建坐标
const dataReloadE = function () {
    let dataE = getDataE();
    let tempData = lodash.cloneDeep(dataE);
    let data = ForceDirected(tempData);
    dataReload(data);
    ElMessage.info({
        message: '力导图每次产生的布局是不一样的',
        type: 'warning'
    });
}
const zoomAdd = function () {
    if (zoom.value >= 1) {
        return
    }
    zoom.value = zoom.value + 0.1;
    efContainerRef.value.style.transform = `scale(${zoom.value})`
    jsPlumbIns.setZoom(zoom.value);
}
const zoomSub = function () {
    if (zoom.value <= 0) {
        return
    }
    zoom.value = zoom.value - 0.1
    efContainerRef.value.style.transform = `scale(${zoom.value})`
    jsPlumbIns.setZoom(zoom.value);
}
// 下载数据
const downloadData = function () {
    ElMessageBox.confirm('确定要下载该流程数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
    }).then(() => {
        var datastr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, '\t'));
        var downloadAnchorNode = document.createElement('a')
        downloadAnchorNode.setAttribute("href", datastr);
        downloadAnchorNode.setAttribute("download", 'data.json')
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        ElMessage.success("正在下载中,请稍后...")
    }).catch(() => {
    })
}
const openHelp = function () {
    flowHelpVisible.value = true;
    nextTick(() =>{
        flowHelpRef.value.init();
    })
}


</script>
