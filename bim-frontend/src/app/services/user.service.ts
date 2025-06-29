import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../models/user.model";


@Injectable({
    providedIn: "root"
})
export class UserService {
    private readonly API_URL = "https://localhost:3000/api";

    constructor(private http: HttpClient) {}

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.API_URL}/users`);
    }

    getUserById(id: number): Observable<User> {
        return this.http.get<User>(`${this.API_URL}/users/${id}`);
    }

    createUser(data: Partial<User>): Observable<User> {
        return this.http.post<User>(`${this.API_URL}/users`, data);
    }

    updateUser(id: number, data: Partial<User>): Observable<User> {
        return this.http.put<User>(`${this.API_URL}/users/${id}`, data);
    }

    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/users/${id}`);
    }
}