import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { FormComponent } from './form/form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/chat', pathMatch: 'full' },
  { path: 'chat', component: ChatComponent },
  { path: 'form', component: FormComponent },
  { path: '**', redirectTo: '/chat' }
];