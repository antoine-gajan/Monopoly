import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./user/login/login.component";
import { RegistrationComponent } from "./user/registration/registration.component";

const appRoutes = [
  { path: "", component: AppComponent, pathMatch: "full" },
  { path: "login", component: LoginComponent, pathMatch: "full" },
  { path: "register", component: RegistrationComponent, pathMatch: "full" }
];

//export const routing = RouterModule.forRoot(appRoutes);