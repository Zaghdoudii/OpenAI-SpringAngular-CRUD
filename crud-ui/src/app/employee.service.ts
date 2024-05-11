import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  baseUrl: string = "http://localhost:8080/api/v1/customers"

  constructor(private httpClient: HttpClient) { }

  getEmployeeList(): Observable<any> {
    return this.httpClient.get(this.baseUrl);
  }

  addEmployee(data: any): Observable<any> {
    return this.httpClient.post(this.baseUrl, data);
  }

  updateEmployee(id: number, data: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/${id}`, data);
  }

  deleteEmployee(id: number): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }
}
