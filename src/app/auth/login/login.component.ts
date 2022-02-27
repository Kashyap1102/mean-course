import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    isLoading = false;
    authStatusSubs: Subscription | null = null;

    constructor(private authService: AuthService) { }

    onLogin(form: NgForm) {
        if (form.invalid) {
            return;
        }
        this.authService.login(form.value.email, form.value.password);
    }

    ngOnDestroy(): void {
        this.authStatusSubs?.unsubscribe();
    }

    ngOnInit(): void {
        this.authStatusSubs = this.authService.getAutheticationStatusListener().subscribe(authStatus => {
            this.isLoading = authStatus;
        });
    }
}