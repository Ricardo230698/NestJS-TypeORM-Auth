import {
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  Entity,
  OneToMany,
} from 'typeorm';
import { Customer } from './customer.entity'; // Importamos la entidad 'Customer' debido a que la usaremos para trabajar en nuestra relación OneToMany o ManyToOne. En este caso, tenemos que una 'Order' tendrá únicamente un 'Customer'
import { OrderItem } from './order-item.entity';

import { Exclude, Expose } from 'class-transformer';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  createAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateAt: Date;

  // En la siguiente relación, trabajaremos con una relación 'ManyToOne'
  // En este caso, tenemos que una 'Order' tendrá únicamente un 'Customer'
  // 'customer' resolverá una entidad de tipo 'Customer'
  // En la tabla/entidad 'Customer', el campo en el cual se encontrará la relación, será el campo 'orders'
  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Customer;

  // La siguiente es la relación que está dirigida a nuestra tabla ternaria CREADA POR NOSOTROS MISMOS en order-item.entity.ts
  @Exclude()
  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];

  // ----------------------------------------------------------

  @Expose()
  get products() {
    if (this.items) {
      return this.items
        .filter((item) => !!item)
        .map((item) => ({
          ...item.product,
          quantity: item.quantity,
          itemId: item.id,
        }));
    }
    return [];
  }

  @Expose()
  get total() {
    if (this.items) {
      return this.items
        .filter((item) => !!item)
        .reduce((total, item) => {
          const totalItem = item.product.price * item.quantity;
          return total + totalItem;
        }, 0);
    }
    return 0;
  }
}
