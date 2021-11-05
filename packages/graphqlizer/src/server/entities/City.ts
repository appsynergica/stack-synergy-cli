import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Province } from "./Province";
import { District } from "./District";

@Index("slug_UNIQUE", ["name"], { unique: true })
@Index("fk_city_province1_idx", ["provinceId"], {})
@Entity("city", { schema: "urbanshona_store" })
export class City {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", unique: true, length: 45 })
  name: string;

  @Column("int", { name: "province_id" })
  provinceId: number;

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

  @ManyToOne(() => Province, (province) => province.cities, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "province_id", referencedColumnName: "id" }])
  province: Province;

  @OneToMany(() => District, (district) => district.city)
  districts: District[];

}
