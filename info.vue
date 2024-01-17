<template>
    <el-dialog
            title="流程数据信息"
            v-model="dialogVisible"
            width="70%"
    >
        <el-alert
                title="使用说明"
                type="warning"
                description="以下流程信息可以被存储起来，方便下一次流程加载"
                show-icon
                close-text="知道了"
        >
        </el-alert>
        <br/>
        <!--一个高亮显示的插件-->
        <codemirror v-model="flowJsonData"
         placeholder="Code gose here..." 
        :style="{ height: '100%' }" 
        :autofocus="true"
        :tabSize="2" :extensions="extensions" />
    </el-dialog>
</template>

<script setup>
    import { onMounted, reactive, ref } from 'vue'
    import { Codemirror } from "vue-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view"


const props=defineProps(['data']); 
let dialogVisible=ref(false);
let flowJsonData=ref('');

let Theme = EditorView.theme({
    // 输入的字体颜色
    "&": {
        color: "#0052D9",
        backgroundColor: "#FFFFFF"
    },
    ".cm-content": {
        caretColor: "#0052D9",
    },
    // 激活背景色
    ".cm-activeLine": {
        backgroundColor: "#FAFAFA"
    },
    // 激活序列的背景色
    ".cm-activeLineGutter": {
        backgroundColor: "#FAFAFA"
    },
    //光标的颜色
    "&.cm-focused .cm-cursor": {
        borderLeftColor: "#0052D9"
    },
    // 选中的状态
    "&.cm-focused .cm-selectionBackground, ::selection": {
        backgroundColor: "#0052D9",
        color:'#FFFFFF'
    },
    // 左侧侧边栏的颜色
    ".cm-gutters": {
        backgroundColor: "#FFFFFF",
        color: "#ddd", //侧边栏文字颜色
        border: "none"
    }
}, { dark: true })

const extensions = [javascript(), Theme];
const init=function()
{
    dialogVisible.value=true;
    flowJsonData=JSON.stringify(props.data, null, 4).toString()
}
//定义方法暴露
defineExpose({
    init
})
</script>
