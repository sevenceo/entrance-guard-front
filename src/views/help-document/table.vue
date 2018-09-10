<template>
    <body class="multimarkdown-preview">
    <div class="content">
        <div class="page-header"><a href="https://github.com/mikexfreeze/manage-sys/blob/master/src/components/table/table.md" name="wikipage" id="wikipage" title="Click here to open the file on GitHub">table.md</a></div>
        <div class="hr"></div>
        <h1 id="表格组件"><a href="#表格组件" name="表格组件">表格组件</a></h1>
        <blockquote>
            <p>表格组件功能梳理</p>
        </blockquote>
        <h4 id="功能点"><a href="#功能点" name="功能点">功能点</a></h4>
        <ol>
            <li>勾选框</li>
            <li>单选行
                <ul>
                    <li>如果只需要单选功能可以采用点击行选中功能比勾选框更加利于操作</li>
                </ul>
            </li>
            <li>条件筛选行的样式显示
                <ul>
                    <li>例如双数行显示不同背景色</li>
                </ul>
            </li>
            <li>最大高度</li>
            <li>表头固定
                <ul>
                    <li>表格高度固定时，纵向内容高度超过表格高度则表格内部滚动且表头固定</li>
                </ul>
            </li>
            <li>表格列固定
                <ul>
                    <li>设定某列固定在表格的左边或右边，内容横向长度超过表格长度时固定列不滚动</li>
                </ul>
            </li>
            <li>多级表头
                <ul>
                    <li>数据结构比较复杂的时候，可使用多级表头来展现数据的层次关系。</li>
                </ul>
            </li>
            <li>排序
                <ul>
                    <li>对某列进行排序，前端无法对多页信息生效</li>
                </ul>
            </li>
            <li>筛选
                <ul>
                    <li>对某列进行筛选，前端无法对多页信息生效</li>
                </ul>
            </li>
            <li>自定义列
                <ul>
                    <li>自定义列的显示内容，可组合其他组件使用。</li>
                </ul>
            </li>
            <li>展开行
                <ul>
                    <li>当行内容过多并且不想显示横向滚动条时，可以使用 Table 展开行功能。</li>
                </ul>
            </li>
            <li>表尾合计行
                <ul>
                    <li>若表格展示的是各类数字，可以在表尾显示各列的合计。</li>
                </ul>
            </li>
        </ol>
        <h4 id="样式"><a href="#样式" name="样式">样式</a></h4>
        <ol>
            <li>内边框 带 or 不带</li>
        </ol>
        <p><a href="http://element.eleme.io/#/zh-CN/component/table">在线说明文档</a></p>
    </div>
    </body>
</template>
<script>
    export default{

    }
</script>
<link rel="stylesheet" href="./multimarkdown_default.css">