import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

declare const window: any;
declare const document: any;

@Injectable()
export class ScriptService {
    private loaded = false;
    private list: any = {};
    private emitter: Subject<boolean> = new Subject<boolean>();

    getChangeEmitter() {
        return this.emitter;
    }

    load(path: string, debug?: boolean) {
        if (this.loaded) return this;

        this.loaded = true;

        // 优先加载依赖库
        this.loadLib(path).then(() => {
            const promises: Promise<any>[] = [];

            promises.push(
                this.loadCss(`${path}/themes/default/css/umeditor.min.css`)
            );

            [
                `${path}umeditor.config.js`,
                debug === true
                    ? `${path}/umeditor.js`
                    : `${path}/umeditor.all.min.js`
            ].forEach(script => promises.push(this.loadScript(script)));

            Promise.all(promises).then(res => {
                this.emitter.next(true);
            });
        });

        return this;
    }

    loadLib(path: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const promises: Promise<any>[] = [];
            const jss: string[] = [];
            if (!window.jQuery) jss.push(`${path}third-party/jquery.min.js`);
            if (!window.etpl) jss.push(`${path}third-party/template.min.js`);

            jss.forEach(script => promises.push(this.loadScript(script)));

            Promise.all(promises).then(res => {
                resolve();
            });
        });
    }

    loadScript(path: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.list[path] === true) {
                resolve(<any>{
                    path: path,
                    loaded: true,
                    status: 'Loaded'
                });
                return;
            }

            this.list[path] = true;

            const node = document.createElement('script');
            node.type = 'text/javascript';
            node.src = path;
            node.charset = 'utf-8';
            if (node.readyState) {
                // IE
                node.onreadystatechange = () => {
                    if (
                        node.readyState === 'loaded' ||
                        node.readyState === 'complete'
                    ) {
                        node.onreadystatechange = null;
                        resolve(<any>{
                            path: path,
                            loaded: true,
                            status: 'Loaded'
                        });
                    }
                };
            } else {
                node.onload = () => {
                    resolve(<any>{
                        path: path,
                        loaded: true,
                        status: 'Loaded'
                    });
                };
            }
            node.onerror = (error: any) =>
                resolve(<any>{
                    path: path,
                    loaded: false,
                    status: 'Loaded'
                });
            document.getElementsByTagName('head')[0].appendChild(node);
        });
    }

    loadCss(path: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.list[path] === true) {
                resolve(<any>{
                    path: path,
                    loaded: true,
                    status: 'Loaded'
                });
                return;
            }

            this.list[path] = true;

            const node = document.createElement('link');
            node.rel = 'stylesheet';
            node.type = 'text/css';
            node.href = path;
            document.getElementsByTagName('head')[0].appendChild(node);
            resolve(<any>{
                path: path,
                loaded: true,
                status: 'Loaded'
            });
        });
    }
}
