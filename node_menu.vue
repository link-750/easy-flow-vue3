<template>
    <div class="flow-menu" ref="tool">
        <div v-for="menu  in  menuList" :key="menu.id">
            <span class="ef-node-pmenu" @click="menu.open = !menu.open"><i
                    :class="{ 'el-icon-caret-bottom': menu.open, 'el-icon-caret-right': !menu.open }"></i>&nbsp;{{ menu.name }}</span>
            <ul v-show="menu.open" class="ef-node-menu-ul">
                <draggable
                     @end="end" 
                     @start="move"
                      :list="menu.children" 
                      :item-key="menu.id"
                      :options="draggableOptions">
                      <template #item="{ element }">
                        <li class="ef-node-menu-li" :key="element.id" :type="element.type">
                        <i :class="element.ico"></i> {{ element.name }}
                    </li>
                    </template>                  
                </draggable>
            </ul>
        </div>
    </div>
</template>
<script setup>
import { onMounted, reactive,ref } from 'vue';
import draggable from 'vuedraggable'

let mousePosition = {
    left: -1,
    top: -1
}
let activeNames = ref('1');
// draggable配置参数参考 https://www.cnblogs.com/weixin186/p/10108679.html
let draggableOptions = reactive({
    preventOnFilter: false,
    sort: false,
    disabled: false,
    ghostClass: 'tt',
    // 不使用H5原生的配置
    forceFallback: true,
    // 拖拽的时候样式
    // fallbackClass: 'flow-node-draggable'
});

// 默认打开的左侧菜单的id
let defaultOpeneds = ref(['1', '2']);
let menuList = ref([
    {
        id: '1',
        type: 'group',
        name: '开始节点',
        ico: 'VideoPlay',
        open: true,
        children: [
            {
                id: '11',
                type: 'timer',
                name: '数据接入',
                ico: 'Timer',
                // 自定义覆盖样式
                style: {}
            }, {
                id: '12',
                type: 'task',
                name: '接口调用',
                ico: 'Odometer',
                // 自定义覆盖样式
                style: {}
            }
        ]
    },
    {
        id: '2',
        type: 'group',
        name: '结束节点',
        ico: 'VideoPause',
        open: true,
        children: [
            {
                id: '21',
                type: 'end',
                name: '流程结束',
                ico: 'CaretRight',
                // 自定义覆盖样式
                style: {}
            }, {
                id: '22',
                type: 'over',
                name: '数据清理',
                ico: 'ShoppingCartFull',
                // 自定义覆盖样式
                style: {}
            }
        ]
    }
]);

let nodeMenu = reactive({});

const emit=defineEmits(['addNode']);

onMounted(() => {
    if (isFirefox()) {
        document.body.ondrop = function (event) {
            // 解决火狐浏览器无法获取鼠标拖拽结束的坐标问题
            mousePosition.left = event.layerX;
            mousePosition.top = event.clientY - 50;
            event.preventDefault();
            event.stopPropagation();
        }
    }
});

const getMenuByType = function (type) {
    for (let i = 0; i < menuList.value.length; i++) {
        let children = menuList.value[i].children;
        for (let j = 0; j < children.length; j++) {
            if (children[j].type === type) {
                return children[j];
            }
        }
    }
}
// 拖拽开始时触发
const move = function (evt, a, b, c) {
    var type = evt.item.attributes.type.nodeValue
    nodeMenu = getMenuByType(type)
}
// 拖拽结束时触发
const end = function (evt, e) {
  emit('addNode', evt, nodeMenu, mousePosition)
}
// 是否是火狐浏览器
const isFirefox = function () {
    var userAgent = navigator.userAgent
    if (userAgent.indexOf("Firefox") > -1) {
        return true;
    }
    return false;
}

</script>
