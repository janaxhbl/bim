import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CodeSnippet } from "../models/codeSnippet.model";

@Injectable({
    providedIn: "root"
})
export class CodeSnippetService {
    private readonly API_URL = "https://localhost:3000/api";

    constructor(private http: HttpClient) {}

    getSnippets(): Observable<CodeSnippet[]> {
        return this.http.get<CodeSnippet[]>(`${this.API_URL}/code_snippets`);
    }

    getSnippetById(id: number): Observable<CodeSnippet> {
        return this.http.get<CodeSnippet>(`${this.API_URL}/code_snippets/${id}`);
    }

    getSnippetsByUser(userID: number): Observable<CodeSnippet[]> {
        return this.http.get<CodeSnippet[]>(`${this.API_URL}/code_snippets/user/${userID}`);
    }

    createSnippet(data: Partial<CodeSnippet>): Observable<CodeSnippet> {
        return this.http.post<CodeSnippet>(`${this.API_URL}/code_snippets`, data);
    }

    updateSnippet(id: number, data: Partial<CodeSnippet>): Observable<CodeSnippet> {
        return this.http.put<CodeSnippet>(`${this.API_URL}/code_snippets/${id}`, data);
    }

    deleteSnippet(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/code_snippets/${id}`);
    }
}