import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Prominence } from './prominence/prominence';
import { Nexus } from './nexus/nexus';
import { Gearbound } from './gearbound/gearbound';
import { NotFound } from './not-found/not-found'

export const routes: Routes = [
	{ path: '', component: Home },
	{ path: 'prominence', component: Prominence },
	{ path: 'nexus', component: Nexus },
	{ path: 'gearbound', component: Gearbound },
	{ path: '**', component: NotFound }
];
