export type ResponseTypes = {
  statusCode: number,
  data?: any,
  message: string,
  success: boolean
}


export class Response<T> {
  public statusCode: number;
  public data: T;
  public message: string;
  public success: boolean;

  constructor({ statusCode, data, message, success }: ResponseTypes) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = success;
  }
}
