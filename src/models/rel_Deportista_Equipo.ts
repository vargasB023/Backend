import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import Equipo from "./equipo";
import Deportista from "./deportista";

@Table({ tableName: 'Rel_Deportista_Equipo', timestamps: true})
export class Rel_Deportista_Equipo extends Model<Rel_Deportista_Equipo> {
  @Column({ primaryKey: true, autoIncrement: true })
  declare ID_Relacion: number;
  
  @Column({ type: DataType.DATE, allowNull: false })
  declare fecha_Asignacion: Date;

  @Column({ type: DataType.ENUM('ACTIVO', 'INACTIVO'), allowNull: false })
  declare estado: string;
  
  @ForeignKey(() => Deportista)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare ID_Deportista: number;

  @ForeignKey(() => Equipo)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare ID_Equipo: number;
}

export default Rel_Deportista_Equipo;