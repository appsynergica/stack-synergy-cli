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
@Index("fk_state_country1_idx", ["countryId"], {})
@Entity("province", { schema: "urbanshona_store" })
export class Province {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", unique: true, length: 45 })
  name: string;

  @Column("varchar", { name: "postalcode", nullable: true, length: 45 })
  postalcode: string | null;

  @Column("int", { name: "country_id" })
  countryId: number;

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

  @OneToMany(() => City, (city) => city.province)
  cities: City[];

  @ManyToOne(() => Country, (country) => country.provinces, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "country_id", referencedColumnName: "id" }])
  country: Country;
}
