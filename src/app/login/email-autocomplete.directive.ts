import { Directive, ViewChild, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

import { LoginComponent } from './login.component';

@Directive({
    selector: '[emailAutocomplete]',
    exportAs: 'emailAutocomplete'
})
export class EmailAutocompleteDirective {
    @ViewChild(LoginComponent, { static: false }) loginComponent?: LoginComponent;
    @ViewChild('inputEmail', { static: false }) inputEmail?: ElementRef;
    @Output() suggestionSelected = new EventEmitter<string>();

    private suggestions: string[] = [];
    private activeSuggestionIndex = 0;
    private readonly emailDomains = [
        "humbertoaraujo.com",
        "gmail.com",
        "yahoo.com",
        "outlook.com",
        "hotmail.com",
        "aol.com",
        "hotmail.com.br",
        "outlook.com.br"
    ];

    constructor(private el: ElementRef) { }

    get suggestionList(): string[] {
        return this.suggestions;
    }

    clearSuggestions() {
        this.suggestions = [];
    }

    onSuggestionClicked(suggestion: string) {
        if (this.loginComponent) {
            this.loginComponent.activeSuggestion = suggestion;
        }
        this.suggestionSelected.emit(suggestion);
    }

    @HostListener('input')
    onInput() {
        const value = this.el.nativeElement.value;

        if (value.length === 0) {
            this.suggestions = [];
            return;
        }

        const index = value.lastIndexOf('@');
        const typedUsername = value.substring(0, index);
        const typedDomain = value.substring(index + 1);

        if (index > 0 && index < value.length - 1) {
            const matchingDomains = this.emailDomains.filter(domain =>
                domain.startsWith(typedDomain)
            );

            this.suggestions = matchingDomains.map(domain => typedUsername + '@' + domain).slice(0, 5);
            this.activeSuggestionIndex = 0;

            if (this.emailDomains.includes(typedDomain)) {
                this.suggestions = [];
            }
        } else if (index === value.length - 1) {
            this.suggestions = this.emailDomains.map(domain => typedUsername + '@' + domain).slice(0, 5);
            this.activeSuggestionIndex = 0;
        } else {
            this.suggestions = [];
        }
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            this.activeSuggestionIndex = Math.max(this.activeSuggestionIndex - 1, 0);
        }
        else if (event.key === 'ArrowDown') {
            event.preventDefault();
            this.activeSuggestionIndex = Math.min(
                this.activeSuggestionIndex + 1,
                this.suggestions.length - 1
            );
        }
        else if (event.key === 'Enter' && this.suggestions.length > 0) {
            event.preventDefault();
            const suggestion = this.suggestions[this.activeSuggestionIndex];
            this.suggestions = [];
            this.activeSuggestionIndex = 0;

            this.suggestionSelected.emit(suggestion);
        }

        this.addSelectedClass();
    }

    @HostListener('keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        this.addSelectedClass();
    }

    @HostListener('mouseover', ['$event.target'])
    onMouseOver(target: any) {
        const suggestions = target.parentNode.getElementsByTagName('li');
        for (let i = 0; i < suggestions.length; i++) {
            if (suggestions[i] === target) {
                this.activeSuggestionIndex = i;
            }
        }
        this.addSelectedClass();
    }

    addSelectedClass() {
        if (this.loginComponent) {
            this.loginComponent.activeSuggestion = this.suggestions[this.activeSuggestionIndex];
        }

        const suggestionList = document.getElementById('emailAutocompleteList');
        if (suggestionList) {
            const suggestions = suggestionList.getElementsByTagName('li');
            for (let i = 0; i < suggestions.length; i++) {
                if (i === this.activeSuggestionIndex) {
                    suggestions[i].classList.add('selected');
                }
                else {
                    suggestions[i].classList.remove('selected');
                }
            }
        }
    }
}