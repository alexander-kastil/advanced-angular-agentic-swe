import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Voucher } from './voucher.model';

@Injectable({
  providedIn: 'root',
})
export class VouchersService {
  http = inject(HttpClient);

  getVouchers(): Observable<Voucher[]> {
    return this.http.get<Voucher[]>(`${environment.api}vouchers`);
  }

  getVoucher(id: number) {
    return this.getVouchers().pipe(
      map((v) => v.find((v: Voucher) => v.ID == id))
    );
  }
}
