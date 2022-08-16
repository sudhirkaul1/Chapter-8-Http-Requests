import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http"
import { Observable } from "rxjs";

export class AuthInterceptorService implements HttpInterceptor{
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   console.log('Request is on the way');
   console.log(req.url);
   const modifiedReq = req.clone({headers: req.headers.append('Auth', 'key')});


   //return next.handle(req);
   return next.handle(modifiedReq);
  }

}
