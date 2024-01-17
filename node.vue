<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: Trent
 * @Date: 2024-01-16 14:05:35
 * @LastEditors: Trent
 * @LastEditTime: 2024-01-17 11:10:31
-->
<template>
    <div ref="nodeRef" :style="nodeContainerStyle" 
    @click="clickNode" 
    @mouseup="changeNodeSite"
     :class="nodeContainerClass">
        <!-- 最左侧的那条竖线 -->
        <div class="ef-node-left"></div>
        <!-- 节点类型的图标 -->
        <div class="ef-node-left-ico ">
            <i :class="nodeIcoClass">               
                <el-icon><component :is="props.node.ico"></component></el-icon>
              </i>
        </div>
        <!-- 节点名称 -->
        <div class="ef-node-text" :show-overflow-tooltip="true">
            {{ node.name }}
        </div>
        <!-- 节点状态图标 -->
        <div class="ef-node-right-ico">
            <i class="el-icon-circle-check el-node-state-success" v-show="node.state === 'success'">
                <el-icon><CircleCheck /></el-icon>
            </i>
            <i class="el-icon-circle-close el-node-state-error" v-show="node.state === 'error'">
                <el-icon><CircleClose /></el-icon>
            </i>
            <i class="el-icon-warning-outline el-node-state-warning" v-show="node.state === 'warning'">
                <el-icon><Warning /></el-icon>
            </i>
            <i class="el-icon-loading el-node-state-running" v-show="node.state === 'running'">
                <el-icon><Loading /></el-icon>
            </i>
        </div>
        <div class="ef-node-right flow-node-drag">

        </div>
         
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
let nodeRef=ref();
const props = defineProps(['node', 'activeElement']);
const emit = defineEmits(['clickNode', 'changeNodeSite']);
// 点击节点
const clickNode = function () {
    emit('clickNode',props.node.id);
}
// 鼠标移动后抬起
const changeNodeSite = function () {
    // 避免抖动
    if (props.node.left == nodeRef.value.style.left && props.node.top ==nodeRef.value.style.top) {
        return;
    }
    emit('changeNodeSite', {
        nodeId: props.node.id,
        left: nodeRef.value.style.left,
        top: nodeRef.value.style.top,
    });
}
let nodeContainerClass = computed(() => {
    return {
        'ef-node-container': true,
        'ef-node-active': props.activeElement.type == 'node' ? props.activeElement.nodeId === props.node.id : false
    }
})
let nodeContainerStyle = computed(() => {
    return {
        top: props.node.top,
        left: props.node.left
    }
})
let nodeIcoClass = computed(() => {
    var nodeIcoClass = {};
    nodeIcoClass[props.node.ico] = true;
    // 添加该class可以推拽连线出来，viewOnly 可以控制节点是否运行编辑
    nodeIcoClass['flow-node-drag'] = props.node.viewOnly ? false : true;
    return nodeIcoClass;
});






</script>
<style scoped>
.ef-node-right
{
    position: relative;
    width: 8px;
    height: 100%;
    background-color: #1879ff;
    right: -35px;
    border-radius: 0 4px 4px 0;
}
</style>