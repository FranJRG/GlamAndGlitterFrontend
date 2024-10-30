import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { finalize } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const loader = inject(NgxUiLoaderService);

  loader.start();
  if (token) {
    //Si existe
    req = req.clone({
      setHeaders:{Authorization:token} //Lo añadimos a la cabecera
    });
  }
  return next(req).pipe(finalize(() => loader.stop()));
};
