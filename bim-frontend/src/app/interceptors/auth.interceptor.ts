import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { AuthState } from "../store/auth.state";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private store: Store) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("http intercepter is intercepting");
        // const token = this.store.selectSnapshot(AuthState.token);
        const token = localStorage.getItem("token");

        if (token) {
            console.log("token: " + token);
            const cloned = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
            return next.handle(cloned);
        }
        return next.handle(req);
    }
}