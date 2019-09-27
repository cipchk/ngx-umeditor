import {
    Component,
    Input,
    forwardRef,
    ViewChild,
    ElementRef,
    OnDestroy,
    EventEmitter,
    Output,
    NgZone,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    AfterViewInit,
    SimpleChanges,
    OnChanges
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { ScriptService } from './script.service';
import { UMeditorConfig } from './umeditor.config';

declare const window: any;
declare const UM: any;

export type EventTypes =
    | 'destroy'
    | 'reset'
    | 'focus'
    | 'langReady'
    | 'beforeExecCommand'
    | 'afterExecCommand'
    | 'firstBeforeExecCommand'
    | 'beforeGetContent'
    | 'afterGetContent'
    | 'getAllHtml'
    | 'beforeSetContent'
    | 'afterSetContent'
    | 'selectionchange'
    | 'beforeSelectionChange'
    | 'afterSelectionChange';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'umeditor',
    template: `
    <textarea id="{{id}}" class="umeditor-textarea"></textarea>
    <p class="umeditor-loading" *ngIf="loading">{{loadingTip}}</p>
    `,
    preserveWhitespaces: false,
    styles: [
      `:host {line-height: initial;} :host .umeditor-textarea{display:none;width:100%;}`,
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UMeditorComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UMeditorComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy, ControlValueAccessor {
    private instance: any;
    private value: string;
    private inited = false;
    private events: any = {};

    private onChange: (value: string) => void;
    private onTouched: () => void;

    loading = true;
    id = `_umeditor-${Math.random()
      .toString(36)
      .substring(2)}`;

    @Input() path: string;
    @Input() config: any;
    @Input() loadingTip = '加载中...';

    /** 延迟初始化 */
    @Input() delay = 50;

    @Output() onReady = new EventEmitter<UMeditorComponent>();
    @Output() onDestroy = new EventEmitter<UMeditorComponent>();

    constructor(
        private el: ElementRef,
        private zone: NgZone,
        private ss: ScriptService,
        private cd: ChangeDetectorRef,
        cog: UMeditorConfig
    ) {
        Object.assign(this, { ...new UMeditorConfig(), cog });
    }

    ngOnInit() {
      this.inited = true;
    }

    ngAfterViewInit(): void {
        // 已经存在对象无须进入懒加载模式
        if (window.UM) {
            this.initDelay();
            return;
        }

        this.ss
            .load(this.path, true)
            .getChangeEmitter()
            .subscribe(res => this.initDelay());
    }

    ngOnChanges(changes: SimpleChanges): void {
      if (this.inited && changes.config) {
        this.destroy();
        this.initDelay();
      }
    }

    private initDelay() {
      setTimeout(() => this.init(), this.delay);
    }

    private init(options?: any) {
        if (!window.UM) {
            throw new Error('uedito js文件加载失败');
        }

        if (this.instance) {
            return;
        }

        this.zone.runOutsideAngular(() => {
            window.UMEDITOR_CONFIG.UMEDITOR_HOME_URL = this.path;
            const umeditor = UM.getEditor(
                this.id,
                Object.assign(
                    {
                        UMEDITOR_HOME_URL: this.path
                    },
                    this.config,
                    options
                )
            );
            umeditor.ready(() => {
                this.instance = umeditor;
                if (this.value) this.instance.setContent(this.value);
                this.zone.run(() => this.onReady.emit(this));
            });

            umeditor.addListener('contentChange', () => {
                this.value = umeditor.getContent();
                this.zone.run(() => this.onChange(this.value));
            });
        });
        this.loading = false;
        this.cd.detectChanges();
    }

    private destroy() {
        // fixed: 由于组件ngOnDestroy会先清除DOM，倒置instance为空，因此从内存中获取实例
        this.instance = UM.getEditor(this.id);
        if (this.instance && this.events && this.events.length > 0) {
            for (const ki of this.events) {
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
     */
    get Instance(): any {
        return this.instance;
    }

    /**
     * 设置编辑器语言
     */
    setLanguage(lang: 'zh-cn' | 'en') {
        this.ss.loadScript(`${this.path}/lang/${lang}/${lang}.js`).then(res => {
            this.destroy();

            // 清空语言
            if (!UM._bak_I18N) {
                UM._bak_I18N = UM.I18N;
            }
            UM.I18N = {};
            UM.I18N[lang] = UM._bak_I18N[lang];

            this.initDelay();
        });
    }

    /**
     * 添加编辑器事件
     */
    addListener(eventName: EventTypes, fn: Function): void {
        if (this.events[eventName]) {
            return;
        }
        this.events[eventName] = fn;
        this.instance.addListener(eventName, fn);
    }

    /**
     * 移除编辑器事件
     */
    removeListener(eventName: EventTypes): void {
        if (!this.events[eventName]) {
            return;
        }
        this.instance.removeListener(eventName, this.events[eventName]);
        delete this.events[eventName];
    }

    ngOnDestroy() {
        this.destroy();
    }

    // reuse-tab: http://ng-alain.com/components/reuse-tab#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F
    _onReuseInit() {
      this.destroy();
      this.initDelay();
    }

    writeValue(value: string): void {
        this.value = value;
        if (this.value && this.instance) {
            this.instance.setContent(this.value);
        }
    }

    public registerOnChange(fn: (_: any) => {}): void {
        this.onChange = fn;
    }
    public registerOnTouched(fn: () => {}): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        if (isDisabled) {
            this.instance.setDisabled();
        } else {
            this.instance.setEnabled();
        }
    }
}
