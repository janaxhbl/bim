import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngxs/store";
import { catchError, Observable, throwError } from "rxjs";
import { AuthState, Logout } from "../store/auth.state";
import { Router } from "@angular/router";
import { NotificationService } from "../services/notification.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private store: Store,
        private router: Router,
        private notififaction: NotificationService
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // console.log("http intercepter is intercepting");
        const token = this.store.selectSnapshot(AuthState.token);
        // const token = sessionStorage.getItem("token");

        let cloned_req = req;

        if (token) {
            // console.log("token: " + token);
            cloned_req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
        return next.handle(cloned_req).pipe(
            catchError((error: HttpErrorResponse) => {
                console.log("catched error: ", error);
                if (error.status === 401) {
                    this.store.dispatch(new Logout());
                    sessionStorage.setItem("token", "");

                    this.notififaction.show("Session expired. Please log in!", 5000, "danger");
                    this.router.navigate(["/login"]);
                }
                return throwError(() => error);
            })
        );
    }
}