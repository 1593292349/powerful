## 依赖列表

* chalk: 改变控制台打印的颜色
* conventional-changelog-cli: 根据 git 提交记录生成 CHANGELOG.md
* husky: 定义 git 钩子
* lint-staged: 对 git 暂存文件执行任务
* tsx: 在 Node.js 直接运行 TypeScript
* jest: 单元测试框架
* jest-environment-jsdom: 让 Jest 模拟浏览器环境
* ts-node: 让 Jest 支持 TypeScript 格式配置文件(jest.config.ts)
* ts-jest: 让 Jest 支持通过 TypeScript 编写测试代码
* @types/jest: 支持在 TypeScript 直接使用 Jest 全局变量
* @types/node: 为 Node.js API 提供类型支持
* tslib: 包含所有 TypeScript 辅助函数的运行时库

## scripts 命令解释

* test: 单元测试
* build: 构建包
* changelog: 生成变更日志
* preinstall: npm生命周期, 限制项目只能使用pnpm
* prepare: npm生命周期, 初始化husky
* pre-commit: 提交前校验代码
* commit-msg: 提交前校验提交信息

## 组件设计

### class命名规范

* 组件 class 命名为: `pf-[组件名]`
* 组件内部 class 命名为: `pf-[组件名]_[块名]`
* 状态 class 命名为: `pf--[修饰符]` 或 `pf--[修饰符]-[值]`
* 全局 class 命名为: `pf_global--[修饰符]` 或 `pf_global--[修饰符]-[值]`
* 组件名, 块名, 修饰符, 值皆以驼峰命名规则

### 属性

* 考虑数据的异步获取。
* 组件通过暴露 classes, styles 实现基础的自定义。
* 既接收简单类型, 又支持高级扩展性(例如: string | object 和 boolean | object)。
* 数组类数据, 通过 PropOrGetter 定义每项具有的属性。
    * 注意: 当数据是树形结构时, 请将 PropOrGetter 属性分为两类
        1. 基于原生数据, 来构建标准数据, 例如: childrenKey, lazyKey, uniqueKey
        2. 基于标准数据, 来个性化定制外观, 例如: labelKey, slotKey
    * 渲染 `选中数据` 时, 始终和标准数据的 `unique` 比较
        1. `选中数据` 如果是对象类型, 则需要先转换得到unique值, 再比较
        2. 多选时, 不要包含未匹配上的 `选中数据`
* 复杂类型考虑使用 class 实现, 聚合相关的属性/方法。
* 用 undefined 代表空，null 表示特殊值。
* 不允许改动传进来的props, 特别是数组/对象等。应在内部建立自己的状态。

### 事件

* 事件参数可以包含 `方法`, 用于改变内部状态, 例如: `Button` 的 `click` 事件参数是 `wrapLoading`。
* 用户操作、代码操作触发的事件不要混淆。

### 插槽

* 先查找 `#系列名_xxx`, 没有再查找 `#系列名`。

### 其他

* 统一使用 `毫秒` 作为时间单位。
* **cache.ts**: 所有组件实例的共用缓存。
* **injection.ts**: 组件可以 provide 一个上下文参数, 支持和后代组件联动。
    - 如: Select在Modal下时自动appendTo到其根元素上。
* 数组类数据尽量不预先 "标准化", 需按条懒 "标准化"。
    - 需要缓存, 当相关依赖更新时, 缓存失效。
* 嵌套组件: 需要转发子组件的属性、事件、插槽、方法、ref/dom
    - 属性: 通过单个属性 v-bind 到子组件。
    - 事件: 所有以 `@子组件名::` 开头的事件 v-on 到子组件。
    - 插槽: 所有以 `#子组件名::` 开头的插槽转发到子组件。
    - 方法: 直接通过子组件的 ref 调用。
    - ref/dom: 通过 `@ref:xxx` 事件抛出。
* 样式主题需要支持js动态修改
* 考虑国际化
* 高内聚一个组件相关的所有内容(源码、国际化、设计思想、示例文档)

## 组合式函数

* 参数尽量具有响应性
    - 普通类型: MaybeRef, MaybeRefOrGetter。
    - 集合类型: Set, Ref, setter & Getter。

## 代码优化

### js相关

* 数组优化
  * 数组的长度已知时, 用 `new Array(length)` 创建
  * `map` 方法, 没有用 `new Array(length)` 实现效率高
  * `filter、slice` 方法的效率不容置疑
  * 遍历性能: `forEach` < `for of` < `普通for循环`(稍快)
* 对象优化
  * ie上的 `Object.values` 很慢, 不如自己通过 `Object.keys` + `new Array(length)` 实现
* 函数是懒加载关键, 尽量懒加载

### vue相关

* 尽量使用shallowRef、customRef
* props的默认值为对象时, 尽量用markRaw包装(禁止转为响应式变量)
* v-if代码块很复杂时, 尽量封装为组件(相当于懒加载)
* 插槽内容复杂时, 尽量封装为props稳定的组件(因为组件更新会导致组件的插槽重新渲染)
* 模板上的对象字面值尽量写为setup里的变量, 防止重复创建对象
* watch和watchEffect等, 尽量同步调用(或者生命周期中), 防止内存泄露(否则必须调用停止方法)
* 在watchEffect中, 通过异步来避免响应性变量追踪

### 业务相关

* 通过 templateRename 等方法统一后端返回结构(方便前端处理)