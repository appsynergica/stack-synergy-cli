import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Continent } from "./Continent";
import { Province } from "./Province";

@Index("slug_UNIQUE", ["code"], { unique: true })
@Index("name_UNIQUE", ["name"], { unique: true })
@Index("fk_country_continent1_idx", ["continentId"], {})
@Entity("country", { schema: "urbanshona_store" })
export class Country {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "code", unique: true, length: 45 })
  code: string;

  @Column("int", { name: "continent_id" })
  continentId: number;

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

  @ManyToOne(() => Continent, (continent) => continent.countries, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "continent_id", referencedColumnName: "id" }])
  continent: Continent;

  @OneToMany(() => Province, (province) => province.country)
  provinces: Province[];
}
