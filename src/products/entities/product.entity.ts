import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Index,
  JoinColumn,
} from 'typeorm';

import { Brand } from './brand.entity';
import { Category } from './category.entity';

@Entity({ name: 'products' }) // Modificando el naming, esto es una buena practica. Esta entidad se llama Product, pero, cuando trabajamos con bases de datos, no es recomendable que las tablas de guarden en nombre singular, sino en plural, esa es la buena practica. No obstante, en vez de ir aqui a la entidad y cambiarle el nombre directamente, ya que eso puede causar problemas en nuestro codigo, podemos usar la propiedad 'name' aqui dentro del operador 'Entity', eso creara o modificara la tabla en nuestra base de datos con el nombre pasado como valor aqui por nosotros
@Index(['price', 'stock']) // TypeORM nos permite poner indexadores en las columnas de las tablas. La buena practica es que no pasemos todas las propiedad o campos como indices, porque, como dice el dicho 'Si todo es importante, nada lo es'
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 215, unique: true })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Index() // TypeORM nos permite poner indexadores en las columnas de las tablas. La buena practica es que no pasemos todas las propiedad o campos como indices, porque, como dice el dicho 'Si todo es importante, nada lo es'
  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'int' })
  stock: number;

  @Column({ type: 'varchar' })
  image: string;

  @CreateDateColumn({
    name: 'create_at', // Modificando el naming, esto es una buena practica. Cuando trabajamos con bases de datos, no es bueno usar caracteres en los nombres de las tablas/columnas. En este caso, createAt no sigue aquella buena practica porque tiene una mayuscula y las mayusculas son consideradas como un caracter especial por TypeORM o las bases de datos. Por lo tanto, debemos cambiar aquello. TypeORM nos da la oportunidad de hacerlo sin necesidad de cambiar directamente aqui el nombre. Podemos hacerlo con la propiedad 'name' dentro del decorador 'CreateDateColumn'
    type: 'timestamp',
  })
  createAt: Date;

  @UpdateDateColumn({
    name: 'update_at', // // Modificando el naming, esto es una buena practica. Cuando trabajamos con bases de datos, no es bueno usar caracteres en los nombres de las tablas/columnas. En este caso, createAt no sigue aquella buena practica porque tiene una mayuscula y las mayusculas son consideradas como un caracter especial por TypeORM o las bases de datos. Por lo tanto, debemos cambiar aquello. TypeORM nos da la oportunidad de hacerlo sin necesidad de cambiar directamente aqui el nombre. Podemos hacerlo con la propiedad 'name' dentro del decorador 'CreateDateColumn'
    type: 'timestamp',
  })
  updateAt: Date;

  @ManyToOne(() => Brand, (brand) => brand.products)
  @JoinColumn({ name: 'brand_id' }) // { name: 'brand_id' }: Especifica el nombre de la columna en la tabla de la entidad Product que almacena la clave foránea de la entidad Brand. En este caso, la columna será brand_id.
  brand: Brand;

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable({
    // @JoinTable: Este decorador se usa en relaciones muchos-a-muchos y define la tabla intermedia (de unión) que conecta las dos entidades (Product y Category). Dado que en una relación muchos-a-muchos no puedes almacenar las claves foráneas en una sola tabla, se necesita una tabla extra que almacene las asociaciones entre productos y categorías.
    name: 'products_categories', // name: 'products_categories': Especifica el nombre de la tabla de unión. En este caso, la tabla que conecta productos y categorías se llamará products_categories.
    joinColumn: {
      // joinColumn: { name: 'product_id' }: Define la columna de la tabla intermedia (products_categories) que hace referencia a la entidad actual, que en este caso es Product. Aquí, product_id será la clave foránea que referencia a la tabla de productos.
      name: 'product_id',
    },
    inverseJoinColumn: {
      // inverseJoinColumn: { name: 'category_id' }: Define la columna de la tabla intermedia que hace referencia a la entidad relacionada, que es Category. Aquí, category_id será la clave foránea que referencia a la tabla de categorías.
      name: 'category_id',
    },
  })
  categories: Category[];
}
