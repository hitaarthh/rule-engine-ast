import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface Rule {
    _id: string;
    name: string;
}
export interface EvaluationResult {
    result: boolean;
}
@Injectable({
    providedIn: 'root',
})
export class RuleService {
    private baseUrl = 'http://localhost:3000/api/rules';

    constructor(private http: HttpClient) { }

    createRule(ruleData: any): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        console.log('Sending rule data:', JSON.stringify(ruleData));

        return this.http.post(`${this.baseUrl}/create`, ruleData, { headers }).pipe(
            tap(response => console.log('Rule creation response:', response)),
            catchError(this.handleError)
        );
    }

    getRules(): Observable<Rule[]> {
        console.log('Fetching rules from:', this.baseUrl);
        return this.http.get<Rule[]>(this.baseUrl).pipe(
            tap(response => console.log('Fetched rules:', response)),
            catchError(this.handleError)
        );
    }

    deleteRule(ruleId: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${ruleId}`).pipe(
            catchError(this.handleError)
        );
    }

    combineRules(ruleIds: string[]): Observable<any> {
        return this.http.post(`${this.baseUrl}/combine`, { ruleIds }).pipe(
            catchError(this.handleError)
        );
    }

    evaluateRule(ruleId: string, data: any): Observable<EvaluationResult> {
        return this.http.post<EvaluationResult>(`${this.baseUrl}/evaluate/${ruleId}`, data).pipe(
            tap(response => console.log('Rule evaluation response:', response)),
            catchError(this.handleError)
        );
    }
    private handleError(error: HttpErrorResponse) {
        console.error('Full error object:', error);
        let errorMessage = 'An unknown error occurred';
        if (error.error instanceof ErrorEvent) {
            errorMessage = `Client-side error: ${error.error.message}`;
        } else {
            errorMessage = `Server-side error: ${error.status} ${error.statusText}`;
            if (error.error && typeof error.error === 'object') {
                errorMessage += `\nDetails: ${JSON.stringify(error.error)}`;
            }
        }
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}