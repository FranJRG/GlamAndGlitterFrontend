import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { finalize } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const googleToken = localStorage.getItem('googleAccessToken');
  const loader = inject(NgxUiLoaderService);

  loader.start();
  if (token) {
    //Si existe
    if(googleToken && req.url.includes("https://www.googleapis.com/calendar/v3")){
      req = req.clone({
        setHeaders:{Authorization: `Bearer ${googleToken}`} //Lo añadimos a la cabecera
      });
    }else{
      req = req.clone({
        setHeaders:{Authorization:token} //Lo añadimos a la cabecera
      });
    }
  }
  return next(req).pipe(finalize(() => loader.stop()));
};
