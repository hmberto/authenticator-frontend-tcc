import { HttpHeaders } from '@angular/common/http';

export const environment = {
    production: true,
    apiUrl: 'https://api.example.com/api',
    registerEmail: '/register/email',
    registerName: '/register/name',
    validateOtp: '/validate/otp',
    validateAccessLink: '/validate/access-link',
    checkAccessLink: '/check/access-link/',
    checkSessionToken: '/check/session',
    logout: '/logout',
    httpOptions: {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }
};  