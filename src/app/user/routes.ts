import { Routes } from "@angular/router";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ProfileComponent } from "./profile/profile.component";
import { PendingReservesComponent } from "./pending-reserves/pending-reserves.component";
import { MyCitesComponent } from "./my-cites/my-cites.component";
import { RegisterStylistComponent } from "./register-stylist/register-stylist.component";
import { RegisterComponent } from "../auth/register/register.component";
import { PendingSchedulesComponent } from "./pending-schedules/pending-schedules.component";

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
        path:'registerStylist',
        component:RegisterComponent
    },
    {
        path:'stylists',
        component:PendingSchedulesComponent
    },
    {
        path:'completeSchedule/:id',
        component:RegisterStylistComponent
    }
]