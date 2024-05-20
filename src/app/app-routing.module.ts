import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpeechToTextComponent } from './speech-to-text/speech-to-text.component';


const routes: Routes = [
  {
    path: 'speech-to-text',
    component: SpeechToTextComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
