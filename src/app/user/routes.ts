import { Routes } from "@angular/router";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ProfileComponent } from "./profile/profile.component";
import { PendingReservesComponent } from "./pending-reserves/pending-reserves.component";
import { MyCitesComponent } from "./my-cites/my-cites.component";
import { RegisterStylistComponent } from "./register-stylist/register-stylist.component";
import { RegisterComponent } from "../auth/register/register.component";
import { PendingSchedulesComponent } from "./pending-schedules/pending-schedules.component";
import { AllServicesAdminComponent } from "./all-services-admin/all-services-admin.component";
import { jwtGuard } from "../shared/guards/jwt.guard";
import { adminGuard } from "../shared/guards/admin.guard";
import { AllWorkersComponent } from "./all-workers/all-workers.component";

export const routes:Routes = [
    {
        path:'forgotPassword',
        component:ForgotPasswordComponent
    },
    {
        path:'profile',
        component:ProfileComponent,
        canMatch:[jwtGuard]
    },
    {
        path:'pendingReserves',
        component:PendingReservesComponent,
        canMatch:[adminGuard]
    },
    {
        path:'myCites',
        component:MyCitesComponent,
        canMatch:[jwtGuard]
    },
    {
        path:'registerStylist',
        component:RegisterComponent,
        canMatch:[adminGuard]
    },
    {
        path:'stylists',
        component:PendingSchedulesComponent,
        canMatch:[adminGuard]
    },
    {
        path:'completeSchedule/:id',
        component:RegisterStylistComponent,
        canMatch:[adminGuard]
    },
    {
        path:'manageServices',
        component:AllServicesAdminComponent,
        canMatch:[adminGuard]
    },
    {
        path:'allWorkersAdmin',
        component:AllWorkersComponent,
        canMatch:[adminGuard]
    }
]