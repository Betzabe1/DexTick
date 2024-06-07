import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { UserService } from './user.service';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private userService: UserService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.userService.getToken();
    let authReq = req;

    if (accessToken) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
      });
    }

    return next.handle(authReq).pipe(
      catchError(error => {
        if (error.status === 401) {
          return this.userService.refreshToken().pipe(
            switchMap(() => {
              const newAccessToken = this.userService.getToken();
              if (newAccessToken) {
                const newAuthReq = req.clone({
                  headers: req.headers.set('Authorization', `Bearer ${newAccessToken}`)
                });
                return next.handle(newAuthReq);
              }
              return throwError(error);
            })
          );
        }
        return throwError(error);
      })
    );
  }
}
