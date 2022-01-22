import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

// https://github.com/angular/angular/blob/master/packages/common/http/src/xhr.ts#L18
const XSSI_PREFIX = /^\)\]\}',?\n/;

/**
 * Provide custom json parsing capabilities for api requests.
 * @export
 * @class JsonInterceptor
 */
@Injectable()
export class JsonInterceptor implements HttpInterceptor {

  /**
   * Custom http request interceptor
   * @public
   * @param {HttpRequest<any>} req
   * @param {HttpHandler} next
   * @returns {Observable<HttpEvent<any>>}
   * @memberof JsonInterceptor
   */
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.responseType !== 'json') {
      return next.handle(req);
    }

    return next.handle(req).lift((event: HttpResponse<string>) => {
      // Pass through everything except for the final response.
      if (!(event instanceof HttpResponse)) {
        return event;
      }
      return this.processJsonResponse(event);
    });
  }

  /**
   * Parse the json body using custom revivers.
   * @private
   * @param {HttpResponse<string>} res
   * @returns{HttpResponse<any>}
   * @memberof JsonInterceptor
   */
  private processJsonResponse(res: HttpResponse<string>): HttpResponse<any> {
    console.log('process JSON Response')
    let body = res.body;
    if (typeof body === 'string') {
      const originalBody = body;
      body = body.replace(XSSI_PREFIX, '');
      try {
        body = body !== '' ? JSON.parse(body, (key: any, value: any) => this.reviveUtcDate(key, value)) : null;
      } catch (error) {
        // match https://github.com/angular/angular/blob/master/packages/common/http/src/xhr.ts#L221
        throw new HttpErrorResponse({
          error: { error, text: originalBody },
          headers: res.headers,
          status: res.status,
          statusText: res.statusText,
          url: res.url || undefined,
        });
      }
    }
    return res.clone({ body });
  }

  /**
   * Detect a date string and convert it to a date object.
   * @private
   * @param {*} key json property key.
   * @param {*} value json property value.
   * @returns {*} original value or the parsed date.
   * @memberof JsonInterceptor
   */
  private reviveUtcDate(key: any, value: any): any {
    if (typeof value !== 'string') {
      return value;
    }
    if (value === '0001-01-01T00:00:00') {
      return null;
    }
    const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
    if (!match) {
      return value;
    }
    return new Date(value);
  }
}
