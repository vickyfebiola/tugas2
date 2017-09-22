import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InputBiodata } from './input-biodata';

@NgModule({
  declarations: [
    InputBiodata,
  ],
  imports: [
    IonicPageModule.forChild(InputBiodata),
  ],
})
export class InputBiodataModule {}
