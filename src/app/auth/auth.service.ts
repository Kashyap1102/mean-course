import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService {


    private token: string | null = null;
    private getAuthenticatedStatus = new Subject<boolean>();
    isAuthenticated: boolean = false;
    tokenTimer: any;
    userId: string | null = null;
    private BACKEND_URL = environment.apiUrl + "user/";

    constructor(private client: HttpClient, private router: Router) { }

    getToken() {
        return this.token;
    }

    getAuthStatus() {
        return this.isAuthenticated;
    }

    getUserId() {
        return this.userId;
    }

    getAutheticationStatusListener() {
        return this.getAuthenticatedStatus.asObservable();
    }

    createUser(email: string, password: string) {
        const authData: AuthData = {
            email: email, password: password
        };
        this.client.post(this.BACKEND_URL + 'signup/', authData).subscribe(response => {
            this.router.navigate(['/']);
        }, error => {
            this.getAuthenticatedStatus.next(false);
        })
    }

    login(email: string, password: string) {

        const authData: AuthData = {
            email: email, password: password
        };
        this.client.post<{ token: string, expiresIn: number, userId: string }>(this.BACKEND_URL + 'login', authData)
            .subscribe(response => {
                const token = response.token;
                this.token = token;
                if (token) {
                    this.setAuthTimer(response.expiresIn);
                    this.isAuthenticated = true;
                    this.userId = response.userId
                    this.getAuthenticatedStatus.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + response.expiresIn * 1000);
                    this.saveAuthData(token, expirationDate, this.userId);
                    this.router.navigate(['/'])
                }
            }, error => { this.getAuthenticatedStatus.next(false); })
    }

    autoAuthUser() {
        const authData = this.getAuthData();
        if (!authData) {
            return;
        }
        const now = new Date();
        const expiresIn = authData?.expirationDate.getTime() as number - now.getTime();
        if (expiresIn > 0) {
            this.token = authData?.token as string;
            this.isAuthenticated = true;
            this.userId = authData?.userId;
            this.setAuthTimer(expiresIn / 1000)
            this.getAuthenticatedStatus.next(this.isAuthenticated);
        }
    }

    private setAuthTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);

    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.userId = null;
        this.getAuthenticatedStatus.next(this.isAuthenticated);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/'])
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string) {
        localStorage.setItem("token", token)
        localStorage.setItem("userId", userId)
        localStorage.setItem("expiration", expirationDate.toISOString())
    }

    private clearAuthData() {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("expiration")
    }


    private getAuthData() {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const expirationDate = localStorage.getItem("expiration");
        if (!token || !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId
        }
    }

}