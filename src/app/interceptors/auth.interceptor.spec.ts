import { HttpRequest } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { of } from 'rxjs';

describe('authInterceptor', () => {
  it('should set withCredentials to true on outgoing requests', (done) => {
    const req = new HttpRequest('GET', '/api/test');

    const next = (r: HttpRequest<any>) => {
      try {
        expect(r.withCredentials).toBe(true);
        done();
      } catch (err) {
        fail(err);
        done();
      }
      return of(null);
    };

    authInterceptor(req, next as any).subscribe();
  });
});
