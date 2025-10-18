import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'address'})
export class addressEntity {

  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({name: 'user_id', nullable: false})
  user_id: number;

  @Column({name: 'complement', nullable: true})
  complement: string;

  @Column({name: 'number', nullable: false})
  numberAddress: number;

  @Column({name: 'cep', nullable: false})
  cep: string;

  @Column({name: 'city_id', nullable: false})
  city_id: number;

  @Column({name: 'created_at'})
  createdAt: Date;

  @Column({name: 'updated_at'})
  updatedAt: Date;
}
