import { Routes } from "@angular/router";
import { PdfComponent } from "./pdf.component";
import { adminGuard } from "../shared/guards/admin.guard";

export const routes:Routes = [
    
    {
        path:'serviceSummary',
        component:PdfComponent,
        canMatch:[adminGuard]
    }

]