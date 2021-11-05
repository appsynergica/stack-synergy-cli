import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { City } from "./City";

@Index("slug_UNIQUE", ["name"], { unique: true })
@Index("fk_city_copy1_city1_idx", ["cityId"], {})
@Entity("district", { schema: "urbanshona_store" })
export class District {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", unique: true, length: 45 })
  name: string;

  @Column("int", { name: "city_id" })
  cityId: number;

  @Column("varchar", { name: "postal_code", nullable: true, length: 250 })
  postalCode: string | null;

  @Column("datetime", {
    name: "date_created",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  dateCreated: Date | null;

  @Column("datetime", {
    name: "date_updated",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  dateUpdated: Date | null;

  @ManyToOne(() => City, (city) => city.districts, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "city_id", referencedColumnName: "id" }])
  city: City;
}
