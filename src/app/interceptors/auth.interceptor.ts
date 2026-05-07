import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PasswordService } from '../services/password.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const passwordService = inject(PasswordService);
  const password = passwordService.getPassword();

  if (password) {
    // Clone the request and add the password to the query parameters
    // We could also add it to headers, but "field pass" suggests query or body.
    // Query param is safest for all GET/POST requests without modifying body structure.
    const authReq = req.clone({
      params: req.params.set('pass', password)
    });
    return next(authReq);
  }

  return next(req);
};
