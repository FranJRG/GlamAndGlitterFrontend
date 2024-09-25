import { Routes } from '@angular/router';
import { LandingPageComponent } from './shared/landing-page/landing-page.component';

export const routes: Routes = [
    {
        path:'',
        component:LandingPageComponent
    },
    {
        path:'auth',
        loadChildren: () => import("./auth/routes").then(mod => mod.routes)
    }
];
