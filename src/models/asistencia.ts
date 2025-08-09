import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Deportista from './deportista';

@Table({ tableName: 'asistencia', 
    timestamps: true})

export class Asistencia extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  declare ID_Asistencia: number;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare fecha: Date;

  @Column({ 
  type: DataType.ENUM('ASISTIO', 'NO_ASISTIO'), 
  allowNull: false })
  declare estado: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare observaciones?: string;

  @ForeignKey(() => Deportista)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare ID_Deportista: number;

  @BelongsTo(() => Deportista)
  declare deportista: Deportista;

}

export default Asistencia;