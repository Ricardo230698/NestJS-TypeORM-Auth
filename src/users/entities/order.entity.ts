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
  @Exclude() // Este decorador se importa de Class Transformer y sse utiliza para excluir informacion de la base de datos. No significa que se va a borrar de la base de datos, pero, por ejemplo, si hacemos una peticion para ver todas las cosas de una determinada cosa, en la respuesta no se incluira este campo. Esto puede ser util para esconder informacion sensible que tengamos en la base de datos
  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];

  // ----------------------------------------------------------

  @Expose() // Asi como podemos exluir informacion de nuestra base de datos (con Exclude), tambien podemos exponer nueva informacion o alterar la manera en que los datos se muestran (con Expose). En el siguiente ejemplo, ya que estamos exponiendo la propiedad 'items' (con Exluce arriba), en la siguiente funcion la vamos a mostrar pero de manera alterada.
  get products() {
    if (this.items) {
      return this.items
        .filter((item) => !!item)
        .map((item) => ({
          ...item.product, // Esta es la informacion que estamos mostrando de manera alterada
          quantity: item.quantity, // Esta es la informacion que estamos mostrando de manera alterada
          itemId: item.id, // Esta es la informacion que estamos mostrando de manera alterada
        }));
    }
    return [];
  }

  @Expose() // Este es otro ejemplo de como usar Expose. En el ejemplo anterior, solo hicimos una alteracion de como se mostraba la data previamente, pero ahora, tenemos un caso más funcional. En este caso, estamos agregando un nuevo campo a mostrarse. Esto lo logramos gracias a las bondades de la serialización que nos da NestJS
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
