import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { OrderDTO } from '../models/order.models';
import { CreateOrderDTO } from '../models/order-create.model';
import { HttpParams } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { environment} from '../../../environments/environment';
@Injectable({
      providedIn: 'root'
})
export class OrderService {

      private http = inject(HttpClient);

    private api = inject(ApiService);
    private apiUrl = environment.apiURL;


  getOrdersByUser(userId: string): Observable<OrderDTO[]> {
    return this.api.get<OrderDTO[]>(`api/order/user/${userId}`);
  }

  getOrderById(orderId: number): Observable<OrderDTO> {
    return this.api.get<OrderDTO>(`api/order/${orderId}`);
  }

  createOrder(shippingAddress: string) {

    const params = new HttpParams()
      .set("shippingAddress", shippingAddress);

    return this.http.post<{ result: any; isSuccess: boolean }>(
      `${this.apiUrl}/api/order/create`,
      {},          // empty body (backend doesn't accept body)
      { params }   // shippingAddress sent via query string
    );
  }


}
