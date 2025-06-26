import { Action, Selector, State, StateContext } from "@ngxs/store";
import { CodeSnippet } from "../models/codeSnippet.model";
import { Injectable } from "@angular/core";
import { CodeSnippetService } from "../services/code-snippet.service";
import { tap } from "rxjs";

export class GetAllCodeSnippets {
    static readonly type = "[CodeSnippet] Get All";
}

export class GetIdCodeSnippet {
    static readonly type = "[CodeSnippet] Get Id";
    constructor(public id: number) {}
}

export class GetUserCodeSnippet {
    static readonly type = "[CodeSnippet] Get User";
    constructor(public userId: number) {}
}

export class CreateCodeSnippet {
    static readonly type = "[CodeSnippet] Create";
    constructor(public payload: Partial<CodeSnippet>) {}
}

export class UpdateCodeSnippet {
    static readonly type = "[CodeSnippet] Update";
    constructor(public id: number, public payload: Partial<CodeSnippet>) {}
}

export class DeleteCodeSnippet {
    static readonly type = "[CodeSnippet] Delete";
    constructor(public id: number) {}
}

export interface CodeSnippetStateModel {
    codeSnippets: CodeSnippet[];
    selectedSnippet?: CodeSnippet;
}


@State<CodeSnippetStateModel>({
    name: "codeSnippets",
    defaults: {
        codeSnippets: []
    }
})
@Injectable()
export class CodeSnippetState {
    constructor(private service: CodeSnippetService) {}

    @Selector()
    static codeSnippets(state: CodeSnippetStateModel) {
        return state.codeSnippets;
    }

    @Action(GetAllCodeSnippets)
    getAll(ctx: StateContext<CodeSnippetStateModel>) {
        return this.service.getSnippets().pipe(
            tap((codeSnippets) => {
                ctx.patchState({ codeSnippets })
            })
        )
    }

    @Action(GetIdCodeSnippet)
    getId(ctx: StateContext<CodeSnippetStateModel>, action: GetIdCodeSnippet) {
        return this.service.getSnippetById(action.id).pipe(
            tap((codeSnippet) => {
                ctx.patchState({ selectedSnippet: codeSnippet })
            })
        )
    }

    @Action(GetUserCodeSnippet)
    getUser(ctx: StateContext<CodeSnippetStateModel>, action: GetUserCodeSnippet) {
        return this.service.getSnippetsByUser(action.userId).pipe(
            tap((codeSnippets) => {
                ctx.patchState({ codeSnippets });
            })
        )
    }

    @Action(CreateCodeSnippet)
    create(ctx: StateContext<CodeSnippetStateModel>, action: CreateCodeSnippet) {
        return this.service.createSnippet(action.payload).pipe(
            tap(() => {
                ctx.dispatch(new GetAllCodeSnippets());
            })
        )
    }

    @Action(UpdateCodeSnippet)
    update(ctx: StateContext<CodeSnippetStateModel>, action: UpdateCodeSnippet) {
        return this.service.updateSnippet(action.id, action.payload).pipe(
            tap(() => {
                ctx.dispatch(new GetAllCodeSnippets());
            })
        )
    }

    @Action(DeleteCodeSnippet)
    delete(ctx: StateContext<CodeSnippetStateModel>, action: DeleteCodeSnippet) {
        return this.service.deleteSnippet(action.id).pipe(
            tap(() => {
                ctx.dispatch(new GetAllCodeSnippets());
            })
        )
    }
}