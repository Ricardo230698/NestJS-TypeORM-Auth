import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from './../entities/order.entity';
import { Customer } from './../entities/customer.entity';
import { User } from '../entities/user.entity';
import { CreateOrderDto, UpdateOrderDto } from './../dtos/order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  findAll() {
    return this.orderRepo.find();
  }

  async findOne(id: number) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'items.product'], // el 'items.product' nos permite ir mas allá de la relación. Es decir, solo con 'items' podemos traer también la relación con los items de esta entidad. Sin embargo, esa entidad 'items' también tiene una relación dentro de sí que se llama 'product'. Por lo tanto, 'items.product' nos permite ir más allá de la relación para así poder traer detalles más específicos
    });
    if (!order) {
      throw new NotFoundException('not found');
    }
    return order;
  }

  ordersByCustomer(customerId: number) {
    if (!customerId || typeof customerId !== 'number') {
      throw new Error('Invalid customer ID');
    }
    return this.orderRepo.find({
      where: { customer: { id: customerId } }, // Por qué funciona customer: { id: customerId }: TypeORM descompone automáticamente esta estructura en una consulta SQL que compara el campo customerId en la base de datos.
      // where: {
      //   customer: {
      //     user: {
      //       id: customerId
      //     }
      //   }
      // },
    });
  }

  // A mi no me traía las ordenes del cliente, debido a que el JWT el sub viene firmado con el id del usuario y no del customer. Mi solución fue la siguiente: Inyecté el repositorio de usuario en el constructor de OrdersService: @InjectRepository(User) private userRepo: Repository<User>. Luego modifiqué el método de la lectura de la siguiente manera. Y así ya me trae las ordenes de mi cliente y con sus respectivos productos por orden:
  // async ordersByCustomer(userId: number) {
  //   const customerId = (await this.userRepo.findOne({
  //     where: { id: userId },
  //     relations: ["customer"]
  //   })).customer.id;
  //   return this.orderRepo.find({
  //     where: {
  //       customer: { id: customerId},
  //     },
  //     relations: ['items', 'items.product'], // el 'items.product' nos permite ir mas allá de la relación. Es decir, solo con 'items' podemos traer también la relación con los items de esta entidad. Sin embargo, esa entidad 'items' también tiene una relación dentro de sí que se llama 'product'. Por lo tanto, 'items.product' nos permite ir más allá de la relación para así poder traer detalles más específicos
  //   });
  // }

  // Para hacer lo mismo pero sin tener que inyectar el modelo de User y en "una sola línea":
  // ordersByUser(id: number) {
  //   return this.orderRepo.findOne({
  //     where: {
  //       customer: { // customer: Se espera que la entidad Order tenga una relación con una entidad Customer.
  //         user: { id } // user: Dentro de la relación con Customer, se accede a otra entidad User. --- { id }: Se filtra la búsqueda para incluir solo las órdenes asociadas a un usuario con el id proporcionado.
  //       }
  //     },
  //     relations: {
  //       customer: true, // customer: true: Incluye la información completa de la relación customer en los resultados.
  //       items: { // items: Se asume que la entidad Order tiene una relación con una lista de items
  //         product: true, // product: true: Dentro de los items, incluye la información completa del product asociado.
  //       }
  //     }
  //   });
  // }

  async create(data: CreateOrderDto) {
    const order = new Order();
    if (data.customerId) {
      const customer = await this.customerRepo.findOneBy({
        id: data.customerId,
      });
      order.customer = customer;
    }
    return this.orderRepo.save(order);
  }

  async update(id: number, changes: UpdateOrderDto) {
    const order = await this.orderRepo.findOneBy({ id });
    if (changes.customerId) {
      const customer = await this.customerRepo.findOneBy({
        id: changes.customerId,
      });
      order.customer = customer;
    }
    return this.orderRepo.save(order);
  }

  remove(id: number) {
    return this.orderRepo.delete(id);
  }
}
