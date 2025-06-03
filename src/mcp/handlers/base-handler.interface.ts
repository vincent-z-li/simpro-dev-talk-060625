export interface MpcHandlerInterface {
  handle(args: any): Promise<any>;
}
