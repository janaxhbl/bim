import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root"})
export class AuthService {
    private readonly API_URL = "https://localhost:3000";

    constructor(private http: HttpClient) {}

    register(data: {
        user_name: string;
        email: string;
        password: string
    }) {
        return this.http.post(`${this.API_URL}/register`, data);
    }

    login(data: {
        email: string;
        password: string
    }) {
        return this.http.post(`${this.API_URL}/login`, data);
    }
}