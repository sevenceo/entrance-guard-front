<template>
    <body class="multimarkdown-preview">
    <div class="content">
        <div class="page-header"><a href="https://github.com/mikexfreeze/manage-sys/blob/master/README.md" name="wikipage" id="wikipage" title="Click here to open the file on GitHub">README.md</a></div>
        <div class="hr"></div>
        <h1 id="manage-sys"><a href="#manage-sys" name="manage-sys">manage-sys</a></h1>
        <blockquote>
            <p>front-end management system prototype</p>
        </blockquote>
        <h2 id="已完成通用功能"><a href="#已完成通用功能" name="已完成通用功能">已完成通用功能</a></h2>
        <ul>
            <li class="p">
                <p class="p">自动化</p>
                <ul>
                    <li>开发环境编译</li>
                    <li>生产环境编译（包括API地址定制）
                        <ul>
                            <li>代码压缩</li>
                            <li>异步加载</li>
                        </ul>
                    </li>
                    <li>支持ES6语法，支持CommenJs语法</li>
                    <li>支持Sass语法，支持css组件级分割（防止污染）</li>
                </ul>
            </li>
            <li class="p">
                <p class="p">前端路由系统</p>
                <ul>
                    <li>404错误处理</li>
                </ul>
            </li>
            <li class="p">
                <p class="p">权限管理系统</p>
                <ul>
                    <li>401错误处理</li>
                    <li>导航菜单、单个组件、元素配置（见hasAuthority.md）</li>
                </ul>
            </li>
            <li class="p">
                <p class="p">封装组件</p>
                <ul>
                    <li>面包屑导航</li>
                </ul>
            </li>
            <li class="p">
                <p class="p">标签页系统</p>
                <ul>
                    <li>详见appMain.md</li>
                </ul>
            </li>
            <li class="p">
                <p class="p">ajax请求封装</p>
                <ul>
                    <li>详见fetch.md</li>
                </ul>
            </li>
        </ul>
        <h2 id="已完成页面"><a href="#已完成页面" name="已完成页面">已完成页面</a></h2>
        <ul>
            <li>登陆</li>
            <li>注册页面</li>
            <li>表格功能展示页</li>
        </ul>
        <h2 id="计划完成功能"><a href="#计划完成功能" name="计划完成功能">计划完成功能</a></h2>
        <ul>
            <li>元素级别的权限控制功能及页面</li>
            <li>从零开始的开发手册（尝试开发人员在没有培训的情况下按照手册开始开发）</li>
            <li>自动发布</li>
            <li>API接口数据模拟</li>
            <li>单元测试用例</li>
            <li>代码自动化生成</li>
            <li>模糊查询、类别筛选演示</li>
            <li>国际化</li>
        </ul>
        <h2 id="build-setup"><a href="#build-setup" name="build-setup">Build Setup</a></h2>
        <pre><code class="bash"># install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# 打包代码并在本地启动预览环境
npm run pre

# build for production and view the bundle analyzer report
npm run build --report
</code></pre>
        <p>For detailed explanation on how things work, checkout the <a href="http://vuejs-templates.github.io/webpack/">guide</a> and <a href="http://vuejs.github.io/vue-loader">docs for vue-loader</a>.</p>
        <h2 id="文件结构"><a href="#文件结构" name="文件结构">文件结构</a></h2>
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
        <h3 id="source-code-editing"><a href="#source-code-editing" name="source-code-editing">Source Code Editing</a></h3>
        <p><em>Text editor plugins</em></p>
        <h4 id="atom"><a href="#atom" name="atom">Atom</a></h4>
        <ul>
            <li><a href="https://github.com/hedefalk/atom-vue">language-vue@atom.io</a> - Vue component file syntax for Atom.</li>
            <li><a href="https://github.com/CYBAI/language-vue-component">language-vue-component@atom.io</a> - Adds syntax highlighting to Vue Component files in Atom.</li>
            <li><a href="https://github.com/ealves-pt/atom-vue-autocomplete">vue-autocomplete@atom.io</a> - Vue.js 1.0+ autocomplete for Atom.</li>
            <li><a href="https://github.com/ealves-pt/atom-vue-snippets">vue-snippets@atom.io</a> - Atom snippets for Vue component files.</li>
            <li><a href="https://github.com/paulpflug/vue-autocompile">vue-autocompile@atom.io</a> - Auto compile vue file on save.</li>
            <li><a href="https://github.com/fsblemos/lint-sass-vue">lint-sass-vue@atom.io</a> - Atom.io package to lint Sass/SCSS in <code>.vue</code> files.</li>
        </ul>
        <h4 id="sublime-text"><a href="#sublime-text" name="sublime-text">Sublime Text</a></h4>
        <ul>
            <li><a href="https://github.com/vuejs/vue-syntax-highlight">Vue Syntax Highlight</a> - Sublime Text syntax highlighting for single-file Vue components.</li>
        </ul>
        <h4 id="vim"><a href="#vim" name="vim">Vim</a></h4>
        <ul>
            <li><a href="https://github.com/posva/vim-vue">Vim Vue</a> - Syntax Highlight for Vue.js components.</li>
        </ul>
        <h4 id="visual-studio-code"><a href="#visual-studio-code" name="visual-studio-code">Visual Studio Code</a></h4>
        <ul>
            <li><a href="https://github.com/octref/vetur">Vetur</a> - Vue tooling for VSCode.</li>
        </ul>
        <h4 id="visual-studio"><a href="#visual-studio" name="visual-studio">Visual Studio</a></h4>
        <ul>
            <li><a href="https://github.com/madskristensen/VuePack">VuePack</a> - Contains HTML Intellisense and code snippets for the Vue.js JavaScript library.</li>
        </ul>
        <h4 id="brackets"><a href="#brackets" name="brackets">Brackets</a></h4>
        <ul>
            <li><a href="https://github.com/pandao/brackets-vue">Brackets Vue</a> - Brackets extension for Vue.js.</li>
        </ul>
        <h4 id="intellij"><a href="#intellij" name="intellij">Intellij</a></h4>
        <ul>
            <li><a href="https://github.com/postalservice14/vuejs-plugin">Vue.js Plugin</a> - Vue.js features for the Intellij Platform (WebStorm, RubyMine, Intellij, etc).</li>
            <li><a href="https://github.com/JetBrains/intellij-plugins/tree/master/vuejs">Vue.js support for WebStorm</a>, IntelliJ IDEA, PhpStorm, PyCharm &amp; RubyMine – official Vue.js support by JetBrains</li>
        </ul>
        <h4 id="emacs"><a href="#emacs" name="emacs">Emacs</a></h4>
        <ul>
            <li><a href="https://github.com/CodeFalling/vue-mode">Vue Mode</a> - Emacs major mode for vue.js.</li>
        </ul>
        <h4 id="kate"><a href="#kate" name="kate">Kate</a></h4>
        <ul>
            <li><a href="https://github.com/mtorromeo/kate-syntax-files">Kate Syntax Files</a> - Syntax files (modified or original) for katepart (kate, kwrite, kdevelop).</li>
        </ul>
    </div>
    </body>

</template>
<script>
    export default{

    }
</script>
<link rel="stylesheet" href="./multimarkdown_default.css">