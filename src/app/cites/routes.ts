import { Routes } from "@angular/router";
import { BookCiteComponent } from "./book-cite/book-cite.component";
import { jwtGuard } from "../shared/guards/jwt.guard";

export const routes:Routes = [
    {
        path:'bookCite/:serviceId',
        component:BookCiteComponent,
        canMatch:[jwtGuard]
    },
    {
        path:'updateCite/:id',
        component:BookCiteComponent,
        canMatch:[jwtGuard]
    }
]