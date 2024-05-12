import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseUrl: String =  'http://localhost:3034/openai';

  constructor(private http: HttpClient) { }

  chat(userMessage: string): Observable<any> {
    const threadId = sessionStorage.getItem('threadId');
    return this.http.post<any>(this.baseUrl + '/chat', { message: userMessage, threadId: 'thread_JJtV8yiiZ9PVUlrKb8CFQXpp' });
  }

  // Create a new thread for the conversation 
  getthread(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/thread');
  }
}
