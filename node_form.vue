<template>
    <div>
        <div class="ef-node-form">
            <div class="ef-node-form-header">
                编辑
            </div>
            <div class="ef-node-form-body">
                <el-form :model="node" ref="dataForm" label-width="80px" v-show="type === 'node'">
                    <el-form-item label="类型">
                        <el-input v-model="node.type" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="名称">
                        <el-input v-model="node.name"></el-input>
                    </el-form-item>
                    <el-form-item label="left坐标">
                        <el-input v-model="node.left" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="top坐标">
                        <el-input v-model="node.top" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="ico图标">
                        <el-input v-model="node.ico"></el-input>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="node.state" placeholder="请选择">
                            <el-option v-for="item in stateList" :key="item.state" :label="item.label" :value="item.state">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="el-icon-close">重置</el-button>
                        <el-button type="primary" icon="el-icon-check" @click="save">保存</el-button>
                    </el-form-item>
                </el-form>

                <el-form :model="line" ref="dataForm" label-width="80px" v-show="type === 'line'">
                    <el-form-item label="条件">
                        <el-input v-model="line.label"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="el-icon-close">重置</el-button>
                        <el-button type="primary" icon="el-icon-check" @click="saveLine">保存</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!--            <div class="el-node-form-tag"></div>-->
        </div>
    </div>
</template>

<script setup>
import { cloneDeep } from 'lodash'
import { reactive,ref } from 'vue';

const emit=defineEmits(['setLineLabel','repaintEverything']);

let visible = ref(true);
// node 或 line
let type = ref('node');
let node = reactive({
    type:'',
    id:'',
    name:'',
    left:'',
    top:'',
    ico:'',
    state:'',
});
let line = reactive({
    label:''
});
let data = reactive({});
let stateList = ref([{
    state: 'success',
    label: '成功'
}, {
    state: 'warning',
    label: '警告'
}, {
    state: 'error',
    label: '错误'
}, {
    state: 'running',
    label: '运行中'
}])
const nodeInit = function (val, id) {
    type.value = 'node';
    data = val;
    data.nodeList.filter((nodeItem) => {
        if (nodeItem.id === id) {
             let tempNode = cloneDeep(nodeItem);       
             node.type= tempNode.type;
             node.id=tempNode.id;
             node.name=tempNode.name;
             node.left=tempNode.left;
             node.top=tempNode.top;
             node.ico=tempNode.ico;
             node.state=tempNode.state;
        }
    })
}
const lineInit = function (lineItem) {
    type.value = 'line';
    line.label = lineItem.label;
}
const saveLine = function () {
    emit('setLineLabel', line.from, line.to, line.label);
}
const save = function () {
    data.nodeList.filter((nodeItem) => {
        if (nodeItem.id === node.id) {
            nodeItem.name = node.name;
            nodeItem.left = node.left;
            nodeItem.top = node.top;
            nodeItem.ico = node.ico;
            nodeItem.state = node.state;
            emit('repaintEverything');
        }
    })
}
defineExpose({
    nodeInit,
    lineInit
});
</script>

<style scoped>
.el-node-form-tag {
    position: absolute;
    top: 50%;
    margin-left: -15px;
    height: 40px;
    width: 15px;
    background-color: #fbfbfb;
    border: 1px solid rgb(220, 227, 232);
    border-right: none;
    z-index: 0;
}
</style>
