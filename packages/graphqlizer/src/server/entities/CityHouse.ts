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
@Entity("city", { schema: "heroku_fb350fee95a093c" })
export class CityHouse {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", unique: true, length: 45 })
  name: string;

  @Column("int", { name: "province_id" })
  provinceId: number;

  @ManyToOne(() => Province, (province) => province.cities, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "province_id", referencedColumnName: "id" }])
  province: Province;

  @OneToMany(() => District, (district) => district.city)
  districts: District[];
}
