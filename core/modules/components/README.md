# COMPONENTS

**This directory is not required, you can delete it if you don't want to use it.**

The components directory contains your Vue.js Components.

_Nuxt.js doesn't supercharge these components._

## mycomponents

- commons - [全局]业务公用组件

- layout  - [全局][适用于投影]页面共享组件，主要用于总布局中body的布局

- page    - [非全局的]存放每个模块的独自的组件

- projections - 投影组件

- _core-component.scss - 收集目录中除page外的组件样式

- base-component.ts - 页面组件的基类组件
（用于赋予子类公用方法，方法应兼容ssr渲染和spa渲染！！！）

