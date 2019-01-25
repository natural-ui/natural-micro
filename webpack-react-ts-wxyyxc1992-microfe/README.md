[中文版本](./) | [English Version](./README-en.md)

# m-fe/react-ts-webpack

[https://github.com/wxyyxc1992/fe-boilerplate](https://github.com/wxyyxc1992/fe-boilerplate) 包含了单模块单页面、单模块多页面、(伪)多模块单页面、微前端项目等不同类型的模板，其中微前端项目与前者的区别即在于微前端中的各个模块能够独立开发，独立版本发布，独立部署，独立加载。分布式协作势必会带来协同以及开发流程上的挑战，在设计微前端项目架构的时候开发易用性也是非常重要的考量点。在[年度总结]()中我也讨论了使用 TS 面向重构编程的意义，欢迎参考 [Backend-Boilerplate/node]() 中的 `ts-*` 项目，使用 TS 进行全栈开发。

当我们考量项目框架、模板或者脚手架的时候，首先想到的点就是希望尽可能对上层屏蔽细节，但是对于长期维护的、多人协作的中大型项目而言，如果项目的主导者直接使用了部分抽象的脚手架，不免会给未来的更新、迭代带来一定的技术负债；同时，目前也有很多成熟的工程化脚手架，因此笔者选择以项目模板的形式抽象出微前端中所需要的部分。尽可能地遵循简约、直观的原则，减少抽象/Magic Function 等；大型项目可能会抽象出专用的开发工具流，但是对于大部分项目而言，在现有框架/工具链的基础上进行适当封装会是较优选择。

```sh
# 拉取并且提取出子项目
git clone https://github.com/wxyyxc1992/fe-boilerplate
cp fe-boilerplate/micro-frontend/react-ts-webpack ../

# 添加全局的依赖更新工具
$ yarn global add npm-check-updates

# 为各个子项目安装依赖，以及链接各个子项目
$ lerna bootstrap

# 执行预编译操作
$ npm run build

# 运行该项目
# 进入 rtw-bootstrap 并且启动
$ cd packages/rtw-bootstrap & npm start

# 运行集成测试示例
# 返回根目录
$ cd .. & npm start
```

## Features

- 非 APP 类可单独发布，APP 类可单独运行，与发布。发布版本可包含 ES, CJS, UMD 等，dist 目录下包含 ES/CJS 模块，build 目录下包含 APP 完整资源以及 UMD 模块。
- 版本控制: 子应用资源不使用 Hash 方式，而是使用语义化版本，`/[cdnHost]/[projectName]/[subAppName]/[x.y.z]/index.{js,css}`
- 样式，LESS 文件支持 CSS Modules，CSS/SCSS 使用标准 CSS
- 状态管理，灵活支持 Redux/MobX/Dva 等不同的状态管理框架，对于 Redux 提供全局统一的 Store 声明

# Structure | 项目结构

以下组成部分：

- Module | 模块: 模块是可单独编译、发布的基础单元，基础模式下可直接打包入主应用，标准模式下多项目共用时可单独打包为 AMD/UMD 格式，通过 SystemJS 引入
- Page | 页面: 页面不可单独编译，使用 Webpack SplitChunk 或其他机制进行异步加载
- App | 应用: 应用是对模块的扩展，是实际用户可见的部分
- Widget | 控件: 控件是特殊的模块，譬如通用的无业务组件等
- Extension | 扩展: 扩展是特殊的应用，提供了跨模块的通用功能，类似于 Chrome Extension 的定位

基础模块：

- rtw: 根目录，public 目录下包含了部分跨模块集成测试的代码

核心模块：

- rtw-core: 暴露给子应用可用的通用基础类、模型定义、部分无界面独立模块等。rtw-core 建议不放置界面相关，使用 Jest UT 方式进行功能验证。
- rtw-bootstrap: 完整项目级别编译与启动入口，包含项目的运行时配置、依赖配置\消息总线、注册中心、核心模块加载机制等。
- rtw-host-app: 提供界面基础容器，譬如应用标准的 Layout，Menu 等组件；提供 Redux 核心 Store。

子业务应用：

- rtw-mobx-app: MobX 示例应用
- rtw-redux-app: Redux 示例应用

扩展模块：

- rtw-widgets: 包含部分业务型控件，提供给所有的子应用使用，提取通用业务逻辑、对上屏蔽部分第三方依赖关系，类似于完整的 OSS 文件上传控件等。
- rtw-extensions: 包含部分业务无关的通用型插件，类似于 Chrome Extension 的定位。
- rtw-worker: 包含通用的 Web Worker & WASM 计算模块，子应用内也可以通过 Buffer 方式直接引入自定义的 Worker

如果希望在子应用 A 中加载子应用 B 的实例，则应该使用类似于依赖注入的方式，从统一的注册中心中获取该实例对象。
所有各个模块共享的基础库，都必须以 UMD 模式加载到全局。

rtw-host-app 中声明与使用需要展示哪些模块，rtw-bootstrap 中注册可提供的 UMD 子模块。

# 开发模式

笔者一直推崇[渐进式的工程架构]()，

## 基础模式

基础模式类似于(伪)多模块单页面，仅有唯一的 Host APP 作为编译与运行的入口，其他包体（譬如 rtw-core）直接打包进主包体中，不使用 SystemJS 进行独立加载。

### `rtw-core`

### `rtw-host-app`

## 标准模式

### `rtw-bootstrap & rtw-host-app`

### `rtw-redux-app & rtw-mobx-app`

rtw-mobx-app 使用 10081 端口，

# Todos

- [ ] 使用 webpack-merge 替代目前的朴素对象合并
