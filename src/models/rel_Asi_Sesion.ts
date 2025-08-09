import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import Asistencia from "./asistencia";
import Sesion from "./sesion";

@Table({ tableName: 'rel_asi_sesion', timestamps: true })
export class rel_Asi_Sesion extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  declare ID_Rel_Asi_sesion: number;
  

  @ForeignKey(() => Asistencia)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare ID_Deportista: number;

  @ForeignKey(() => Sesion)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare ID_Entrenador: number;
}

export default rel_Asi_Sesion;