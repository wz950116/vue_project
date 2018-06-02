<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [{{项目名称}}](#%E9%A1%B9%E7%9B%AE%E5%90%8D%E7%A7%B0)
    - [1 兼容性要求](#1-%E5%85%BC%E5%AE%B9%E6%80%A7%E8%A6%81%E6%B1%82)
    - [2 技术依赖](#2-%E6%8A%80%E6%9C%AF%E4%BE%9D%E8%B5%96)
    - [3 开发、测试、线上环境](#3-%E5%BC%80%E5%8F%91%E6%B5%8B%E8%AF%95%E7%BA%BF%E4%B8%8A%E7%8E%AF%E5%A2%83)
        - [3.1 本地开发调试](#31-%E6%9C%AC%E5%9C%B0%E5%BC%80%E5%8F%91%E8%B0%83%E8%AF%95)
        - [3.2 测试环境](#32-%E6%B5%8B%E8%AF%95%E7%8E%AF%E5%A2%83)
    - [4 目录结构](#4-%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84)
    - [5 开发指南](#5-%E5%BC%80%E5%8F%91%E6%8C%87%E5%8D%97)
        - [5.1 组件和页面的开发](#51-%E7%BB%84%E4%BB%B6%E5%92%8C%E9%A1%B5%E9%9D%A2%E7%9A%84%E5%BC%80%E5%8F%91)
        - [5.2 特定开发情景](#52-%E7%89%B9%E5%AE%9A%E5%BC%80%E5%8F%91%E6%83%85%E6%99%AF)
    - [6 构建，部署，上线](#6-%E6%9E%84%E5%BB%BA%E9%83%A8%E7%BD%B2%E4%B8%8A%E7%BA%BF)
    - [附录](#%E9%99%84%E5%BD%95)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# {{广告投放管理后台}}

广告投放的后台管理系统

## 1 兼容性要求

PC：ie9以上

## 2 技术依赖

框架（vue2.1.6以及vue-router）、打包工具（webpack1.13.1）、代码转译（babel）、第三方库（jquery、fetch封装、ElementUI、underscore等）、语法检查（eslint、stylelint）

注意区分本地Node.js运行和浏览器端运行，前者是开发工具，后者是前端库。

## 3 开发、测试、线上环境

开发：shengtai-admin-adv.focus-dev.cn:5000

测试：shengtai-admin-adv.focus-test.cn/ecology-ad-admin#/

线上环境：shengtai-admin-adv.focus.cn/ecology-ad-admin#/

### 3.1 本地开发调试

npm install

npm run dev

host：127.0.0.1 shengtai-admin-adv.focus-dev.cn


## 4 目录结构

-   dist　webpack打包后的文件

-   node_modules　项目相关依赖的npm包

-   public

    -   dev-server.js　启动本地服务文件（基于express）

    -   sever.js　启动本地服务文件（基于nodejs-server）（已作废）

    -   utils.js　css等样式文件打包分离配置文件

    -   webpack.config.js　项目打包相关配置

-   src

    -   components　组件
    
    -   config　路由配置
    
    -   lib　库
    
    -   script　http请求文件
    
    -   store　vuex状态管理文件

## 5 开发指南

### 5.1 组件和页面的开发

项目多数页面为header+table以及各种dialog形式的组件，通过es6的import引入，在components中申明使用，绝大多数地方使用了ElementUI的组件，各种数据通过props传递。

### 5.2 特定开发情景

项目多数为父子组件数据传递，几乎不涉及兄弟组件数据传递，在beforeMount阶段进行初始数据请求，在表单的onchange事件中重新发送请求更新数据。

## 6 构建，部署，上线

阐述项目的构建、发布甚至上线流程。

jenkins构建：10.23.48.112:8080/me/my-views/view/all/job/ad-admin/

rscode发布：rscode.ops.focus.cn/project/163/

上线操作：新建上线任务提测-测试通过-生成work镜像-上线成功。

## 附录

列举其他相关的、需要参考的网址，如system仓库地址、jenkins任务地址、rscode项目地址，如后端接口wiki，公共模块，第三方库的文档，等等。
