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
@Entity("continent", { schema: "heroku_fb350fee95a093c" })
export class Continent {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "code", unique: true, length: 45 })
  code: string;

  @Column("varchar", { name: "name", nullable: true, unique: true, length: 45 })
  name: string | null;

  @OneToMany(() => Country, (country) => country.continent)
  countries: Country[];
}
