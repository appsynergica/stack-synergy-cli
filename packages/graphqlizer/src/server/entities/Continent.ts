import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Country } from "./Country";

@Index("slug_UNIQUE", ["code"], { unique: true })
@Index("name_UNIQUE", ["name"], { unique: true })
@Entity("continent", { schema: "urbanshona_store" })
export class Continent {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "code", unique: true, length: 45 })
  code: string;

  @Column("varchar", { name: "name", nullable: true, unique: true, length: 45 })
  name: string | null;

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

  @OneToMany(() => Country, (country) => country.continent)
  countries: Country[];
}
