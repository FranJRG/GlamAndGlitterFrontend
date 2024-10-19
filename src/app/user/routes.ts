import { Routes } from "@angular/router";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ProfileComponent } from "./profile/profile.component";
import { PendingReservesComponent } from "./pending-reserves/pending-reserves.component";
import { MyCitesComponent } from "./my-cites/my-cites.component";
import { WorkersComponent } from "./workers/workers.component";
import { RegisterStylistComponent } from "./register-stylist/register-stylist.component";
import { RegisterComponent } from "../auth/register/register.component";

export const routes:Routes = [
    {
        path:'forgotPassword',
        component:ForgotPasswordComponent
    },
    {
        path:'profile',
        component:ProfileComponent
    },
    {
        path:'pendingReserves',
        component:PendingReservesComponent
    },
    {
        path:'myCites',
        component:MyCitesComponent
    },
    {
        path:'workers/:id',
        component:WorkersComponent
    },
    {
        path:'registerStylist',
        component:RegisterComponent
    },
    {
        path:'completeSchedule',
        component:RegisterStylistComponent
    }
]