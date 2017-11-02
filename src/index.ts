import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { ScriptService } from './components/script.service';
import { UMeditorComponent } from './components/umeditor.component';

export { UMeditorComponent } from './components/umeditor.component';

@NgModule({
  imports: [CommonModule],
  providers: [ ScriptService ],
  declarations: [UMeditorComponent],
  exports: [UMeditorComponent]
})
export class UMeditorModule {
}
