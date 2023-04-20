import { Directive, ViewChild, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
    selector: '[emailAutocomplete]',
    exportAs: 'emailAutocomplete'
})
export class EmailAutocompleteDirective {
    @ViewChild('inputEmail', { static: false }) inputEmail?: ElementRef;
    @Output() suggestionSelected = new EventEmitter<string>();

    private suggestions: string[] = [];
    private activeSuggestionIndex = 0;
    private readonly emailDomains = [
        "gmail.com",
        "yahoo.com",
        "hotmail.com",
        "aol.com",
        "outlook.com"
    ];

    constructor(private el: ElementRef) { }

    get suggestionList(): string[] {
        return this.suggestions;
    }

    clearSuggestions() {
        this.suggestions = [];
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

            this.suggestions = matchingDomains.map(domain => typedUsername + '@' + domain);
            this.activeSuggestionIndex = 0;

            if (this.emailDomains.includes(typedDomain)) {
                this.suggestions = [];
            }
        } else if (index === value.length - 1) {
            this.suggestions = this.emailDomains.map(domain => typedUsername + '@' + domain);
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
            console.log(this.activeSuggestionIndex)
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            this.activeSuggestionIndex = Math.min(
                this.activeSuggestionIndex + 1,
                this.suggestions.length - 1
            );
        } else if (event.key === 'Enter' && this.suggestions.length > 0) {
            event.preventDefault();
            const suggestion = this.suggestions[this.activeSuggestionIndex];
            this.suggestions = [];
            this.activeSuggestionIndex = 0;
            
            this.suggestionSelected.emit(suggestion);
        }
    }
}