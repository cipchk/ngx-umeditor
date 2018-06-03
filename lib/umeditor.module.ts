import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { ScriptService } from './src/script.service';
import { UMeditorConfig } from './src/umeditor.config';
import { UMeditorComponent } from './src/umeditor.component';

@NgModule({
  imports: [CommonModule],
  providers: [ ScriptService ],
  declarations: [UMeditorComponent],
  exports: [UMeditorComponent]
})
export class UMeditorModule {
    static forRoot(config?: UMeditorConfig): ModuleWithProviders {
        return {
            ngModule: UMeditorModule,
            providers: [
                { provide: UMeditorConfig, useValue: config }
            ]
        };
    }
}
