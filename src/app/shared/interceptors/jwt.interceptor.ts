import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    //Si existe
    req = req.clone({
      setHeaders:{Authorization:token} //Lo añadimos a la cabecera
    });
    console.log("Petición antes de enviarla:", req);
    console.log("Encabezado Authorization:", req.headers.get('Authorization'));
  }
  return next(req);
};
