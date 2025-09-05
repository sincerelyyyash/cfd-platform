
type RequestType = {
  service: string,
  action: string,
  data: any,
  message: string
}

export class Request<T> {
  public service: string;
  public action: string;
  public message: string;
  public data: T;


  constructor({ service, data, message, action }: RequestType) {
    this.service = service;
    this.action = action;
    this.data = data;
    this.message = message;
  }

}
