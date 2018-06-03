# ngx-umeditor
Angular for Baidu UMeditor（[UEditor](https://github.com/cipchk/ngx-ueditor)）

[![NPM version](https://img.shields.io/npm/v/ngx-umeditor.svg)](https://www.npmjs.com/package/ngx-umeditor)
[![Build Status](https://travis-ci.org/cipchk/ngx-umeditor.svg?branch=master)](https://travis-ci.org/cipchk/ngx-umeditor)


## Demo

[Live Demo](https://cipchk.github.io/ngx-umeditor/)

## 特性

+ 懒加载 umeditor.min.js 文件。
+ 支持umeditor事件监听与移除
+ 支持语言切换
+ 支持umeditor实例对象直接访问。

## 使用

### 1、安装

```
npm install ngx-umeditor --save
```

把 `UMeditorModule` 模块导入到你项目中。

```typescript
import { UMeditorModule } from 'ngx-umeditor';

@NgModule({
    imports: [BrowserModule, UMeditorModule.forRoot() ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

### 2、使用

```html
<umeditor [(ngModel)]="full_source" 
         [config]="{...}"
         [path]="'./assets/umeditor/'"
         [loadingTip]="'加载中……'"
         (onReady)=""
         (onDestroy)=""></umeditor>
```

| 名称    | 类型           | 默认值  | 描述 |
| ------- | ------------- | ----- | ----- |
| config | Object |  | 前端配置项说明，[见官网](http://fex.baidu.com/umeditor/#start-config) |
| path | string | ./assets/umeditor/ | umeditor代码根目录路径，以 `/` 结尾。 |
| loadingTip | string | 加载中... | 初始化提示文本。 |
| onReady | Function |  | 编辑器准备就绪后会触发该事件 |
| onDestroy | Function |  | **编辑器组件销毁**后会触发该事件 |

### 3、关于懒加载

懒加载在未到 `wdinow.UM` 时会启动，如果你在 `index.html` 已经使用 `<script src="umeditor.js"></script>` 加载过，懒加载流程将会失效。

**加载语言注意点**

懒加载会自动识别并引用，否则，需要自行在 `<head>` 加入语言版本脚本。

## 访问umeditor实例对象

首先，需要给组件定义一下模板变量：

```html
<umeditor [(ngModel)]="full_source" #full></umeditor>
```

使用 `@ViewChild` 访问组件，并使用 `this.full.Instance` 访问umeditor实例对象。

```typescript
export class DemoComponent {
    @ViewChild('full') full: UeditorComponent;
    constructor(private el: ElementRef) {}

    getAllHtml() {
        // 通过 `this.full.Instance` 访问umeditor实例对象
        alert(this.full.Instance.getAllHtml())
    }
}
```

## 事件

虽说上节也可以直接注册umeditor事件，但当组件被销毁时可能会引发内存泄露。所以**不建议直接在umeditor实例中这么做**。组件本身提供 `addListener` 和 `removeListener` 来帮你处理。

```typescript
// 事件监听
this.full.addListener('focus', () => {
    this.focus = `fire focus in ${new Date().getTime()}`;
});
// 事件移除
this.full.removeListener('focus');
```

## 表单非空校验

组件加入 `required` 当编辑器为空时会处于 `ng-invalid` 状态，具体体验见[Live Demo](https://cipchk.github.io/ngx-umeditor/)。

## 组件接口

```typescript
interface UMeditorComponent {
    /**
     * 获取UM实例
     * 
     * @readonly
     */
    get Instance(): any;

        /**
     * 设置编辑器语言
     * 
     * @param {('zh-cn' | 'en')} lang 
     */
    setLanguage(lang: 'zh-cn' | 'en') {}

    /**
     * 添加编辑器事件
     */
    addListener(eventName: 'destroy' | 'reset' | 'focus' | 'langReady' | 'beforeExecCommand' | 'afterExecCommand' | 'firstBeforeExecCommand' | 'beforeGetContent' | 'afterGetContent' | 'getAllHtml' | 'beforeSetContent' | 'afterSetContent' | 'selectionchange' | 'beforeSelectionChange' | 'afterSelectionChange', 
                fn: Function): void {}

    /**
     * 移除编辑器事件
     * 
     * @param {('destroy' | 'reset' | 'focus' | 'langReady' | 'beforeExecCommand' | 'afterExecCommand' | 'firstBeforeExecCommand' | 'beforeGetContent' | 'afterGetContent' | 'getAllHtml' | 'beforeSetContent' | 'afterSetContent' | 'selectionchange' | 'beforeSelectionChange' | 'afterSelectionChange')} eventName 
     */
    removeListener(eventName: 'destroy' | 'reset' | 'focus' | 'langReady' | 'beforeExecCommand' | 'afterExecCommand' | 'firstBeforeExecCommand' | 'beforeGetContent' | 'afterGetContent' | 'getAllHtml' | 'beforeSetContent' | 'afterSetContent' | 'selectionchange' | 'beforeSelectionChange' | 'afterSelectionChange'): void {}
}
```

## Troubleshooting

Please follow this guidelines when reporting bugs and feature requests:

1. Use [GitHub Issues](https://github.com/cipchk/ngx-umeditor/issues) board to report bugs and feature requests (not our email address)
2. Please **always** write steps to reproduce the error. That way we can focus on fixing the bug, not scratching our heads trying to reproduce it.

Thanks for understanding!

### License

The MIT License (see the [LICENSE](https://github.com/cipchk/ngx-umeditor/blob/master/LICENSE) file for the full text)
