import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { UMeditorComponent } from './umeditor.component';
import { ScriptService } from './script.service';

@NgModule({
  imports: [CommonModule],
  providers: [ ScriptService ],
  declarations: [UMeditorComponent],
  exports: [UMeditorComponent]
})
export class UMeditorModule {
}
