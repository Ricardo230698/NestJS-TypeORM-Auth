// Hablando de relaciones ManyToMany (Muchos a Muchos):
// Algo importante a tener en cuenta es que, al trabajar en una relación ManyToMany (Muchos a Muchos), a pesar de que TypeORM creará una tabla ternaria por nosotros, esta tabla se limitará únicamente a tener la relación entre las dos tablas. Es decir, si, por ejemplo, tenemos una relación MUCHOS A MUCHOS entre las tablas Product y Order, se creará una tabla ternaria con solamente dos columnas (product_id y order_id)
// Sin embargo, si, en ese mismo ejemplo entre Product y Order, queremos añadir una columna más, por ejemplo para saber cuantos productos son parte de esa order, tendríamos que crear una relación Muchos a Muchos PERSONALIZADA, es decir, crear esa tabla ternaria POR NOSOTROS MISMOS.
// Esta tabla ternaria creada POR NOSOTROS MISMOS es esta (order-item.entity.ts):

import {
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Entity,
  Column,
  ManyToOne,
} from 'typeorm';

import { Exclude } from 'class-transformer';

import { Product } from '../../products/entities/product.entity';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  // Cada uno de los siguientes campos es creado a nuestra elección, siguiendo el principio mencionado arriba: Podemos crear una tabla ternaria de una relación entre otras 2 entidades en la cual podamos agregar los campos que nosotros queramos:

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  createAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateAt: Date;

  @Column({ type: 'int' })
  quantity: number;

  // Se crea la relación a Product de forma 'unidireccional' (la desventaja de esto es que desde la tabla Product, no podremos acceder a saber las Orders a las que están relacionadas cada uno de los productos. Solo lo podremos saber desde aquí)
  @ManyToOne(() => Product)
  product: Product;

  // Se crea la relación a Order de forma 'bidireccional' (tanto la orden (en Order) puede acceder a qué items tiene, así como el orderItem puede acceder a qué Order pertenece)
  @ManyToOne(() => Order, (order) => order.items)
  order: Order;
}
