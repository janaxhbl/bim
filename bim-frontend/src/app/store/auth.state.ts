import { Action, Selector, State, StateContext } from "@ngxs/store";
import { AuthStateModel } from "../models/authState.model";
import { Injectable } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { tap } from "rxjs";

export class Register {
    static readonly type = "[Auth] Register";
    constructor(public payload: {
        user_name: string;
        email: string;
        password: string
    }) {}
}

export class Login {
    static readonly type = "[Auth] Login";
    constructor(public payload: {
        email: string;
        password: string
    }) {}
}

export class Logout {
    static readonly type = "[Auth] Logout"
}

@State<AuthStateModel>({
    name: "auth",
    defaults: {
        token: null,
        email: null,
        id: null
    }
})
@Injectable()
export class AuthState {
    constructor(private authService: AuthService) {}

    @Selector()
    static isAuthenticated(state: AuthStateModel): boolean {
        return !!state.token
    }

    @Selector()
    static token(state: AuthStateModel): string | null {
        return state.token;
    }

    @Action(Register)
    register(ctx: StateContext<AuthStateModel>, action: Register) {
        return this.authService.register(action.payload);
    }

    @Action(Login)
    login(ctx: StateContext<AuthStateModel>, action: Login) {
        return this.authService.login(action.payload).pipe(
            tap((res :any) => {
                const token = res.token;
                const email = res.email;
                const id = res.id;
                ctx.patchState({ token, email, id });

                console.log(ctx.getState());

                localStorage.setItem("token", token);
            })
        )
    }

    @Action(Logout) 
    logout(ctx: StateContext<AuthStateModel>) {
        localStorage.removeItem("token");
        ctx.setState({ token: null, email: null, id: null})
    }
}