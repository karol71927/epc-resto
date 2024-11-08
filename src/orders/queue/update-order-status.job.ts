export class UpdateOrderStatusJob {
  name = UpdateOrderStatusJob.name;

  constructor(public readonly orderId: number) {}
}
