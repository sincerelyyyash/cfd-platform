type Response = {
  statusCode: number,
  data: any,
  message: string,
  success: boolean
}


export class kafkaResponse<T> {
  public statusCode: number;
  public data: T;
  public message: string;
  public success: boolean;

  constructor({ statusCode, data, message, success }: Response) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = success;
  }
}
