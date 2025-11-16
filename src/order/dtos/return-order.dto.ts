import { ReturnUserDto } from 'src/user/dtos/returnUser.dto';
import { OrderEntity } from '../entities/order.entity';
import { ReturnAddressDto } from 'src/address/dtos/returnAddress.dto';
import { ReturnPaymentDto } from 'src/payment/dtos/return-payment.dto';
import { ReturnOrderProduct } from 'src/order-product/dtos/return-order-product.dto';

export class ReturnOrderDto {
  id: number;
  date:string;
  user?: ReturnUserDto;
  address?: ReturnAddressDto;
  payment?: ReturnPaymentDto;
  ordersProduct?: ReturnOrderProduct[];
  amountProducts?: number;

  constructor(order: OrderEntity) {
    this.id = order.id;
    this.date = order.date.toString();
    this.user = order.user ? new ReturnUserDto(order.user) : undefined;
    this.address = order.address
      ? new ReturnAddressDto(order.address)
      : undefined;

    this.payment = order.payment
      ? new ReturnPaymentDto(order.payment)
      :undefined;  

    this.ordersProduct = order.ordersProduct
      ? order.ordersProduct.map(
        (orderProduct) => new ReturnOrderProduct(orderProduct),
        )
      : undefined;
      
    this.amountProducts = order.amountProducts;  
  }
}