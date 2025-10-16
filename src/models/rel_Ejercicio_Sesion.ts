import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import Ejercicio from "./ejercicio";
import Sesion from "./sesion";

@Table({ tableName: 'Rel_Ejercicio_Sesion', timestamps: true})
export class rel_Ejercicio_Sesion extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  declare ID_Ejercicio_Sesion: number;

  @Column({ type: DataType.ENUM('CALENTAMIENTO','PARTE_PRINCIPAL','RECUPERACION'), allowNull: false })
  declare fase: string;

  @Column({ type: DataType.TINYINT.UNSIGNED, allowNull: true })
  declare orden: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: true })
  declare series: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: true })
  declare repeticiones: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false })
  declare duracion_min: number;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare observaciones: string;

  @ForeignKey(() => Ejercicio)
  @Column({allowNull: true})
  declare ID_Ejercicio :number;

  @ForeignKey(() => Sesion)
  @Column({allowNull: true})
  declare ID_Sesion :number;

}
export default rel_Ejercicio_Sesion;