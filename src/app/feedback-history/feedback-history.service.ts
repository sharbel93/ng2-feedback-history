
import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';


const BASE_URL = 'http://localhost:8002/etl/poc-user-feedback/1000/1501770200.477992';


@Injectable()
export class FeedBackService {

    constructor(private http: Http) {
    }
    getScrollMessages(): Observable<any> {
        return this.http.get(BASE_URL)
        .map(res => res.json())
        // errors if any
        .catch((error: any) => Observable.throw(error.json.error || 'Server error'));
    }

    public formatMsg(msgs: any[]) {
        let arr: any[];
        arr = [];
        msgs.forEach(msg => {

             // phone
              const m = msg.text.split('\n', 4);
              const p = m.slice(2, 3);
              const j = p.map((item: any)=> item.replace(' *Phone:* ', ''));

             // location
              const l = m.slice(1, 2);
              const k = l.map((item: any) => item.replace(' *Location:* ', ''));

              // from
              const f = m.slice(0, 1);
              const g = f.map((item: any) => item.replace('*From* ', ''));

              // messages
              const r = msg.text.split('\n');
              const z = r.slice(4);
              const b = z.map((item: any) => item.replace('```', ''));
              const c = b.map((item: any) => item.replace('```', ''));

               const arrInner = [g, k, j, c, msg.ts ];
              if (msg.username === 'bot') {
                arr.push(arrInner);
              }
            });
            return arr;
            }

}
