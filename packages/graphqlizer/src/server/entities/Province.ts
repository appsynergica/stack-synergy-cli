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
import { Country } from "./Country";

@Index("slug_UNIQUE", ["name"], { unique: true })
@Index("fk_province_country1_idx", ["countryId"], {})
@Entity("province", { schema: "heroku_fb350fee95a093c" })
export class Province {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", unique: true, length: 45 })
  name: string;

  @Column("varchar", { name: "postal_code", nullable: true, length: 45 })
  postalCode: string | null;

  @Column("int", { name: "country_id" })
  countryId: number;

  @OneToMany(() => City, (city) => city.province)
  cities: City[];

  @ManyToOne(() => Country, (country) => country.provinces, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "country_id", referencedColumnName: "id" }])
  country: Country;
}
