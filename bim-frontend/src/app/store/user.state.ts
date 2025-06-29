import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { UserService } from "../services/user.service";
import { tap } from "rxjs";

export class GetAllUsers {
    static readonly type = "[User] Get All";
}

export class GetIdUser {
    static readonly type = "[User] Get Id";
    constructor(public id: number) {}
}

export class CreateUser {
    static readonly type = "[User] Create";
    constructor(public payload: Partial<User>) {}
}

export class UpdateUser {
    static readonly type = "[User] Update";
    constructor(public id: number, public payload: Partial<User>) {}
}

export class DeleteUser {
    static readonly type = "[User] Delete";
    constructor(public id: number) {}
}

export interface UserStateModel {
    users: User[];
    currentUser?: User;
}

@State<UserStateModel>({
    name: "user",
    defaults: {
        users: []
    }
})
@Injectable()
export class UserState {
    constructor(private service: UserService) {}

    @Selector()
    static users(state: UserStateModel) {
        return state.users;
    }

    @Selector()
    static currentUser(state: UserStateModel) {
        return state.currentUser;
    }

    @Action(GetAllUsers)
    getAll(ctx: StateContext<UserStateModel>) {
        return this.service.getUsers().pipe(
            tap(users => {
                ctx.patchState({users});
            })
        )
    }

    @Action(GetIdUser)
    getId(ctx: StateContext<UserStateModel>, action: GetIdUser) {
        return this.service.getUserById(action.id).pipe(
            tap((user) => {
                // const user = {
                //     id: res.id,
                //     userName: res.userName,
                //     email: res.email,
                //     isAdmin: res.isAdmin
                // }
                ctx.patchState({ currentUser: user})
            })
        )
    }

    @Action(CreateUser)
    create(ctx: StateContext<UserStateModel>, action: CreateUser) {
        return this.service.createUser(action.payload).pipe(
            tap(() => {
                ctx.dispatch(new GetAllUsers())
            })
        )
    }

    @Action(UpdateUser)
    update(ctx: StateContext<UserStateModel>, action: UpdateUser) {
        return this.service.updateUser(action.id, action.payload).pipe(
            tap(() => {
                ctx.dispatch(new GetAllUsers())
            })
        )
    }

    @Action(DeleteUser)
    delete(ctx: StateContext<UserStateModel>, action: DeleteUser) {
        return this.service.deleteUser(action.id).pipe(
            tap(() => {
                ctx.dispatch(new GetAllUsers())
            })
        )
    }
}