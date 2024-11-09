import { Routes } from "@angular/router";
import { RatingComponent } from "./rating.component";
import { jwtGuard } from "../shared/guards/jwt.guard";

 export const routes:Routes = [
    {
        path:'addRating/:id',
        component:RatingComponent,
        canMatch:[jwtGuard]
    }
 ]