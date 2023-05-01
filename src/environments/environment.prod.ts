import { HttpHeaders } from '@angular/common/http';

const apiUsername = 'username';
const apiPassword = 'password';
const basic = window.btoa(`${apiUsername}:${apiPassword}`);

export const environment = {
    production: false,
    apiUrl: 'http://localhost:8080',
    apiUser: 'username',
    apiPass: 'password',
    registerEmail: '/api/register/email',
    registerName: '/api/register/name',
    validateOtp: '/api/validate/otp',
    validateAccessLink: '/api/validate/access-link',
    checkAccessLink: '/api/check/access-link/',
    checkSessionToken: '/api/check/session',
    getUserData: '/api/users/',
    logout: '/api/logout',
    httpOptions: {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + basic
        })
    }
};