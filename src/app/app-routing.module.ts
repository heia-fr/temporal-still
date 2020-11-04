import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { HowToComponent } from './howto/howto.component';

const routes: Routes = [
	{ path: 'about', component: AboutComponent },
	{ path: 'howto', component: HowToComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
