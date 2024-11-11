import { Routes } from "@angular/router";
import { WorkerScheduleComponent } from "./worker-schedule/worker-schedule.component";
import { adminGuard } from "../shared/guards/admin.guard";

export const routes:Routes = [
    {
        path:'changeSchedule/:id',
        component:WorkerScheduleComponent,
        canMatch:[adminGuard]
    }
]