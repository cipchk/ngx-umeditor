/* tslint:disable */
import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { UMeditorComponent } from '../../../lib';

declare const UE: any;

@Component({
    selector: 'dev',
    templateUrl: './dev.component.html',
    styleUrls: ['./dev.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DevComponent {
    @ViewChild('full') full: UMeditorComponent;
    full_source: string = `<p>Hello ${+new Date}</p>`;
    status: string = '初始中';

    onReady(comp: UMeditorComponent) {
        this.status = '初始化完成';
        console.log(comp);
    }
}
