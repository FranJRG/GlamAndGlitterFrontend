import { Routes } from "@angular/router";
import { ServicesComponent } from "./services.component";

export const routes:Routes = [
    {
        path : 'services',
        component:ServicesComponent
    },
    {
        path: 'services/:id',
        component:ServicesComponent
    }
]