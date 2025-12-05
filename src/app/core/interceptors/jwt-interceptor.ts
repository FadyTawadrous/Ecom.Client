import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  // 1. Get token from local storage
  const token = localStorage.getItem('token'); // Update this after auth service to prevent token sending if expired
  // example: const token = authService.getValidToken();

  // 2. Clone request and attach header if token exists
  if (token) { // can skip certain URLs if needed like:    !req.url.includes('/auth/login')
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // 3. Pass to next handler
  return next(req);
};
