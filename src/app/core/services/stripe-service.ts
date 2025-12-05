import { Injectable, inject } from '@angular/core';
import { ApiService } from './api-service';
import {map} from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class StripeService {

  private api = inject(ApiService);

  createCheckoutSession(orderId: number) {
  return this.api.post<{ url: string }>(
    `api/stripe/create-session/${orderId}`,
    {}
  ).pipe(
    map(res => {
      const url = res.url.toLowerCase();

      if (url.includes("success")) {
        return { isSuccess: true, url: res.url };
      }

      if (url.includes("cancel")) {
        return { isSuccess: false, url: res.url };
      }

      // fallback: unknown case
      return { isSuccess: false, url: res.url };
    })
  );
}

}
