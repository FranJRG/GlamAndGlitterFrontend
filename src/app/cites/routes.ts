import { Routes } from "@angular/router";
import { BookCiteComponent } from "./book-cite/book-cite.component";

export const routes:Routes = [
    {
        path:'bookCite/:serviceId',
        component:BookCiteComponent
    },
    {
        path:'updateCite/:id',
        component:BookCiteComponent
    }
]