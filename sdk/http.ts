// HTTP request anatomy:
// GET / HTTP/1.1
// Host: example.com
// Connection: close
//
// BODY_CONTENT

import { host } from "./index";

export class HttpRequest {
  private readonly content: string;

  public constructor(content: string) {
    this.content = content;
  }

  public send(): HttpResponse {
    const response = host.http_request(this.content);
    return new HttpResponse(response);
  }
}

export class HttpResponse {
  public content: string;

  public constructor(content: string) {
    this.content = content;
  }
}

export class HttpRequestBuilder {
  private _headers: Map<string, string> = new Map();
  private _queries: Map<string, string> = new Map();
  private _method: string = "GET";
  private _path: string = "/";
  private _body: string = "";
  private _version: string = "HTTP/1.1";

  public constructor(host: string) {
    this._headers.set("host", host);
    this._headers.set("connection", "close");
  }

  public header(key: string, value: string): HttpRequestBuilder {
    this._headers.set(key.toLowerCase(), value);
    return this;
  }

  public query(key: string, value: string): HttpRequestBuilder {
    this._queries.set(key, value);
    return this;
  }

  public method(value: string): HttpRequestBuilder {
    this._method = value;
    return this;
  }

  public path(value: string): HttpRequestBuilder {
    this._path = value;
    return this;
  }

  public body(value: string): HttpRequestBuilder {
    this._body = value;
    return this;
  }

  public version(value: string): HttpRequestBuilder {
    this._version = value;
    return this;
  }

  public build(): HttpRequest {
    const queryString = this.renderQueryString();
    this.setDefaultContentLengthHeader();
    const headers = this.renderHeaders();
    const method = this._method;
    const path = this._path;
    const version = this._version;
    const body = this._body;
    const content = `${method} ${path}${queryString} ${version}\r\n${headers}\r\n${body}`;
    return new HttpRequest(content);
  }

  private setDefaultContentLengthHeader(): void {
    if (this._headers.has("content-length")) {
      return;
    }
    this._headers.set("content-length", this._body.length.toString());
  }

  public send(): HttpResponse {
    return this.build().send();
  }

  private renderHeaders(): string {
    let headers = "";
    const keys = this._headers.keys();
    const values = this._headers.values();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = values[i];
      headers += `${key}: ${value}\r\n`;
    }
    return headers;
  }

  private renderQueryString(): string {
    let queryString = "";
    const keys = this._queries.keys();
    if (keys.length > 0) {
      queryString += "?";
    }
    const values = this._queries.values();
    for (let i = 0; i < keys.length; i++) {
      if (i > 0) {
        queryString += "&";
      }
      const key = keys[i];
      const value = values[i];
      queryString += `${key}=${value}`;
    }
    return queryString;
  }
}
