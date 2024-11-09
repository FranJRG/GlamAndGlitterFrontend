import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export const adminGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService)
  const router = inject(Router);

  const admin = authService.getRole();

  if(admin === "admin"){
    return true;
  }else{
    Toastify({
      text: 'Access denied',
      duration: 3000,
      gravity: 'bottom',
      position: 'center',
      backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
    }).showToast()
    router.navigateByUrl("/");
    return false;
  }
};
