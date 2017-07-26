import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HighlightJsModule } from 'ngx-highlight-js';

import { UMeditorModule } from 'ngx-umeditor';

import { AppComponent } from './app.component';
import { DemoComponent } from './components/demo.component';
import { DevComponent } from './components/dev.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
        { path: '', component: DemoComponent },
        { path: 'dev', component: DevComponent }
    ], { useHash: true }),
    CommonModule,
    HighlightJsModule,

    UMeditorModule
  ],
  declarations: [
    AppComponent,
    DemoComponent,
    DevComponent
  ],
  providers: [  ],
  bootstrap: [AppComponent]
})

export class AppDemoModule {
}
