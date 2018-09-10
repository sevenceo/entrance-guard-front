<template>
    <body class="multimarkdown-preview">
    <div class="content">
        <div class="page-header"><a href="https://github.com/mikexfreeze/manage-sys/blob/master/使用教程.md" name="wikipage" id="wikipage" title="Click here to open the file on GitHub">&#20351;&#29992;&#25945;&#31243;.md</a></div>
        <div class="hr"></div>
        <h1 id="框架使用教程"><a href="#框架使用教程" name="框架使用教程">框架使用教程</a></h1>
        <blockquote>
            <p>本文档旨在为不熟悉nodejs/vue/webpack等技术的同学提供上手攻略</p>
        </blockquote>
        <h3 id="一环境配置"><a href="#一环境配置" name="一环境配置">一、环境配置</a></h3>
        <ul>
            <li>去 <a href="https://nodejs.org/zh-cn/">nodejs中文官网</a> 下载安装包，建议下载稳定版，目前的稳定版6.11.0</li>
            <li>安装完成之后检查环境配置是否成功，在命令行输入
                <pre><code>$ node -v
$ npm -v
</code></pre>
                <p>应当可以看到相应的版本号</p>
            </li>
        </ul>
        <h3 id="二项目依赖安装及启动"><a href="#二项目依赖安装及启动" name="二项目依赖安装及启动">二、项目依赖安装及启动</a></h3>
        <p>在项目文件启动命令行并输入</p>
        <pre><code class="bash"># 安装项目依赖包
npm install

# 运行项目开发环境 在浏览器中打开localhost:8080
npm run dev

# 打包代码并在本地启动预览环境
npm run pre

# build for production and view the bundle analyzer report
npm run build --report
</code></pre>
        <h3 id="项目配置文件"><a href="#项目配置文件" name="项目配置文件">项目配置文件</a></h3>
        <pre><code class="text">|- build/  ----------------------------- webpack配置文件
|- config/  ---------------------------- API地址配置文件
|- dist/  ------------------------------ 打包后生产环境文件
|- src/  ------------------------------- 项目源代码
    |- api  ---------------------------- api接口代码
    |- assets  ------------------------- 静态资源css、js
    |- components  --------------------- 全局公用组件
    |- directives  --------------------- 自定义全局指令
    |- filters  ------------------------ 自定义全局filters
    |- router  ------------------------- 路由文件
        |- index  ---------------------- 框架路由
        |- customRoute  ---------------- 开发使用路由
    |- store  -------------------------- 全局状态管理
    |- utils  -------------------------- 通用方法封装
        |- fetch  ---------------------- ajax封装
    |- views  -------------------------- 功能组件按照视图分类
    |- App.vue
    |- main.js  ------------------------ 入口文件
|- .babelrc  --------------------------- babel 配置文件
|- index.html  ------------------------- HTML 模板
|- package.json  ----------------------- npm 配置文件
|- README.md  -------------------------- 项目帮助文档
</code></pre>
        <p>config/index.js文中</p>
        <pre><code>port: 8080,//开发模式项目默认启动端口
</code></pre>
        <p>设置项目开发模式启动端口如果与其他项目冲突的话可在此设置其他端口</p>
        <h3 id="开始开发"><a href="#开始开发" name="开始开发">开始开发</a></h3>
        <h4 id="一创建页面组件"><a href="#一创建页面组件" name="一创建页面组件">一、创建页面组件</a></h4>
        <pre><code class="text">|- src/  ------------------------------- 项目源代码
    |- views  -------------------------- 功能组件按照视图分类
        |- active
            |- package-table  ------------------------ 封装表格组件
                |- components  ------------------------ 页面组件文件夹
                    |- editor.vue  ------------------------ 编辑对话框组件
                    |- table  ------------------------ table组件文件夹
                |- packageTable.js  ------------------------ 活动页面JS代码
                |- packageTable.scss  ------------------------ 活动页面JS样式文件
                |- packageTable.vue  ------------------------ 活动页面JS HTML文件
</code></pre>
        <p>按照<strong>package-table</strong>文件夹下的文件目录结构组织构建新的页面，*<strong>.vue</strong>文件本身就是vue框架中的单个组件，我们既可以把<strong>html,js,css</strong>都写在一个文件当中，也可以按照本目录下面的写法，把<strong>js/css</strong>文件拆分出去。这样可以让代码显得更加清晰。</p>
        <div class="hr"null>&nbsp;</div>
        <p>下面分析*.vue文件中的html代码：</p>
        <pre><code class="html">&lt;!--面包屑--&gt;
&lt;breadcrumb&gt;&lt;/breadcrumb&gt;
</code></pre>
        <p>上面一个html标签引入了一个vue全局组件，在引入全局组件时不需要再js中添加任何代码只要直接在html中直接引入标签即可。这是一个已经开发好的vue组件，有兴趣的同学可以在breadcrumb文件夹下找到源代码研究。</p>
        <pre><code class="text">|- src/  ------------------------------- 项目源代码
    |- components  --------------------- 全局公用组件
        |- breadcrumb  ----------------- 项目帮助文档
</code></pre>
        <div class="hr"null>&nbsp;</div>
        <p>操作区引入了三个按钮<code>&lt;el-button&gt;&lt;/el-button&gt;</code>是由饿了么团队制作的element-ui当中的按钮组件。
            <code>@click=&quot;onAdd&quot;</code>是将click事件和onAdd函数绑定。
            <code>v-authority=&quot;'ROLE_ADMIN'&quot;</code>设定了该按钮只有拥有&quot;ROLE_ADMIN&quot;权限的用户才能访问。</p>
        <pre><code class="html">&lt;!--操作区--&gt;
&lt;div class=&quot;filter-container&quot;&gt;
    &lt;el-button type=&quot;primary&quot; icon=&quot;plus&quot; @click=&quot;onAdd&quot; v-authority=&quot;'ROLE_ADMIN'&quot;&gt;新增&lt;/el-button&gt;
    &lt;el-button type=&quot;primary&quot; icon=&quot;edit&quot; @click=&quot;onEdit&quot; v-if=&quot;hasAuthority('ROLE_ADMIN')&quot;&gt;编辑&lt;/el-button&gt;
    &lt;el-button type=&quot;danger&quot; icon=&quot;delete&quot; @click=&quot;onDel&quot; v-if=&quot;hasAuthority('ROLE_ADMIN')&quot;&gt;删除&lt;/el-button&gt;
&lt;/div&gt;
</code></pre>
        <div class="hr"null>&nbsp;</div>
        <p>展示区中引入了一个<code>&lt;dataTable&gt;</code>组件这是在package-table文件夹下components文件下定义的一个table组件。
            <code>:tableData =&quot;formData&quot;</code>表示在<code>&lt;dataTable&gt;</code>组件的<code>tableData</code>属性上绑定数据源<code>formData</code>，<code>formData</code>可以是在js代码中定义的变量。</p>
        <pre><code class="html">&lt;!--展示区--&gt;
&lt;dataTable :tableData =&quot;formData&quot; v-on:selectionChange=&quot;handleSelectionChange&quot; /&gt;
</code></pre>
        <p>篇幅有限有关Vue的更多详细教学请参见官网 <a href="https://cn.vuejs.org/">Vue</a></p>
        <h4 id="二分配路由"><a href="#二分配路由" name="二分配路由">二、分配路由</a></h4>
        <pre><code class="text">|- src/  ------------------------------- 项目源代码
    |- router  ------------------------- 路由文件
        |- index  ---------------------- 框架路由
        |- customRoute  ---------------- 开发使用路由
</code></pre>
        <p>在customRoute.js文件中引入相应组件并分配路由。</p>
        <pre><code class="js">const PermissionTest = resolve =&gt; require(['../views/permission-test/index'], resolve);

{
    path: '/permission-test',//路径
    component: Layout,//layout模板组件
    redirect: '/permission-test/index',//重新定向到子路由
    name: '权限测试',//路由名称
    icon: 'quanxian',
    meta: {role: ['ROLE_ADMIN']}, //页面需要的权限
    // noDropdown: true,
    children: [//子路由
        {
            path: 'index',
            component: PermissionTest,
            name: '权限测试页',
            meta: {role: ['ROLE_ADMIN']}  //页面需要的权限
        }]
},
</code></pre>
        <p>有关vue-router的更多详细教学请参见官网 <a href="https://router.vuejs.org/zh-cn/">Vue-router</a></p>
    </div>
    </body>
</template>
<script>
    export default{

    }
</script>
<link rel="stylesheet" href="./multimarkdown_default.css">