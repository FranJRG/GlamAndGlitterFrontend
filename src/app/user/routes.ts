import { Routes } from "@angular/router";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ProfileComponent } from "./profile/profile.component";

export const routes:Routes = [
    {
        path:'forgotPassword',
        component:ForgotPasswordComponent
    },{
        path:'profile',
        component:ProfileComponent
    }
]