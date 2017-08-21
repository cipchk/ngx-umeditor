import { Component, Input, forwardRef, ViewChild, ElementRef, OnDestroy, EventEmitter, Output, NgZone, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { ScriptService } from './script.service';

declare const window: any;
declare const UM: any;

export type EventTypes = 'destroy' | 'reset' | 'focus' | 'langReady' | 'beforeExecCommand' | 'afterExecCommand' | 'firstBeforeExecCommand' | 'beforeGetContent' | 'afterGetContent' | 'getAllHtml' | 'beforeSetContent' | 'afterSetContent' | 'selectionchange' | 'beforeSelectionChange' | 'afterSelectionChange';

@Component({
    selector: 'umeditor',
    template: `
    <textarea #host class="umeditor-textarea"></textarea>
    <p class="umeditor-loading" *ngIf="loading">{{loadingTip}}</p>
    `,
    encapsulation: ViewEncapsulation.Emulated,
    styles: [ `.umeditor-textarea{display:none;width:100%;}` ],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => UMeditorComponent),
        multi: true
    }],
})
export class UMeditorComponent implements OnDestroy, ControlValueAccessor {
    private instance: any;
    private value: string;
    private id: string;
    private events:any = {};

    loading: boolean = true;

    @Input() path: string;
    @Input() config: any;
    @Input() loadingTip: string = '加载中...';
    @ViewChild('host') host: ElementRef;

    @Output() onReady = new EventEmitter<UMeditorComponent>();
    @Output() onDestroy = new EventEmitter<UMeditorComponent>();
    @Output() onContentChange = new EventEmitter<string>();

    constructor(private el: ElementRef,
                private zone: NgZone,
                private ss: ScriptService) { }

    ngOnInit() {
        if (!this.path) this.path = './assets/umeditor/';

        // 构建一个虚拟id
        this.id = 'umeditor-' + new Date().getTime();
        this.host.nativeElement.id = this.id;

        // 已经存在对象无须进入懒加载模式
        if (window.UM) {
            this.init();
            return;
        }

        this.ss.load(this.path, true).getChangeEmitter().subscribe(res => {
            this.init();
        });
    }

    private init(options?: any) {
        if (!window.UM)
            throw new Error('uedito js文件加载失败');

        if (this.instance) return;

        this.loading = false;

        this.zone.runOutsideAngular(() => {
            window.UMEDITOR_CONFIG.UMEDITOR_HOME_URL = this.path;
            let umeditor = UM.getEditor(this.id, Object.assign({
                UMEDITOR_HOME_URL: this.path
            }, this.config, options));

            umeditor.addListener('contentChange', () => {
                this.updateValue(umeditor.getContent());
            });

            this.zone.run(() => {
                this.instance = umeditor;
            });
        });

        // ready 只会在UM首次加载时触发，倒置 [(ngModel)] 失效
        setTimeout(() => {
            this.value && this.instance.setContent(this.value);
            this.onReady.emit(this);
        }, 300);
    }

    private updateValue(value: string){
        this.zone.run(() => {
            this.value = value;

            this.onChange(this.value);
            this.onTouched(this.value);

            this.onContentChange.emit(this.value);
        });
    }

    private _destroy() {
        // fixed: 由于组件ngOnDestroy会先清除DOM，倒置instance为空，因此从内存中获取实例
        this.instance = UM.getEditor(this.id);
        if (this.instance) {
            for (let ki of this.events) {
                this.instance.removeListener(ki, this.events[ki]);
            }
            this.instance.removeListener('contentChange');
            this.instance.destroy();
            this.instance = null;
        }
        this.onDestroy.emit(this);
    }

    /**
     * 获取UE实例
     *
     * @readonly
     */
    get Instance(): any {
        return this.instance;
    }

    /**
     * 设置编辑器语言
     *
     * @param {('zh-cn' | 'en')} lang
     */
    setLanguage(lang: 'zh-cn' | 'en') {
        this.ss.loadScript(`${this.path}/lang/${lang}/${lang}.js`).then(res => {
            this._destroy();

            //清空语言
            if (!UM._bak_I18N) {
                UM._bak_I18N = UM.I18N;
            }
            UM.I18N = {};
            UM.I18N[lang] = UM._bak_I18N[ lang ];

            this.init();
        });
    }

    /**
     * 添加编辑器事件
     */
    addListener(eventName: EventTypes, fn: Function): void {
        if (this.events[eventName]) return;
        this.events[eventName] = fn;
        this.instance.addListener(eventName, fn);
    }

    /**
     * 移除编辑器事件
     */
    removeListener(eventName: EventTypes): void {
        if (!this.events[eventName]) return;
        this.instance.removeListener(eventName, this.events[eventName]);
        delete this.events[eventName];
    }

    ngOnDestroy() {
        this._destroy();
    }

    writeValue(value: string): void {
        this.value = value;
        if(this.value && this.instance){
            this.instance.setContent(this.value);
        }
    }

    protected onChange: any = Function.prototype;
    protected onTouched: any = Function.prototype;

    public registerOnChange(fn: (_: any) => {}): void { this.onChange = fn; }
    public registerOnTouched(fn: () => {}): void { this.onTouched = fn; }

    setDisabledState(isDisabled: boolean): void {
        if (isDisabled) {
            this.instance.setDisabled();
        } else {
            this.instance.setEnabled();
        }
    }
}
