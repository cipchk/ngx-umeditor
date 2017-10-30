# 1.0.4

+ fix: 由于随机ID可能引起重复问题。

# 1.0.3

+ fix: 当根模块指定 `ViewEncapsulation.None` 时，倒置编辑器无法显示问题。

# 1.0.2

+ [增] `onReady`、`onDestroy` 事件返回一个参数值 `UMeditorComponent` 实例对象。
+ [修] 修复 `[(ngModel)]` 在初始化时由于 `ready` 事件只会在首次加载UM时才会生效，倒置 `[(ngModel)]` 失效问题。
