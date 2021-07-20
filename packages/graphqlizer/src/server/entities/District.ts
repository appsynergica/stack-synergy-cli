import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { City } from "./City";

@Index("slug_UNIQUE", ["name"], { unique: true })
@Index("fk_district_city1_idx", ["cityId"], {})
@Entity("district", { schema: "heroku_fb350fee95a093c" })
export class District {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", unique: true, length: 45 })
  name: string;

  @Column("varchar", { name: "postal_code", nullable: true, length: 250 })
  postalCode: string | null;

  @Column("int", { name: "city_id" })
  cityId: number;

  @ManyToOne(() => City, (city) => city.districts, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "city_id", referencedColumnName: "id" }])
  city: City;
}
