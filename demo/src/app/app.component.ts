import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>ngx-umeditor</h1>
    <p>Angular2 百度UMeditor组件，有关更多细节见<a href="https://github.com/cipchk/ngx-umeditor/blob/master/README.md" target="_blank">README.md</a></p>
    <demo></demo>
  `,
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
}
