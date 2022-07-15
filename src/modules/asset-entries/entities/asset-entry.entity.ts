import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('asset_entry')
export class AssetEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: new Date().getDate()})
  acquireDay: number;

  @Column({default: new Date().getMonth()})
  acquireMonth: number;

  @Column({default: new Date().getFullYear()})
  acquireYear: number;

  @Column()
  description: string;

  @Column()
  value: number;

  @Column({default: true})
  tangible: boolean
}
