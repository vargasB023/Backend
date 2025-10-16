import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Deportista from './deportista';
import Cronograma from './Cronograma';

@Table({ tableName: 'Asistencia', timestamps: true})

export class Asistencia extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  declare ID_Asistencia: number;

  @Column({ 
  type: DataType.ENUM('ASISTIO', 'NO_ASISTIO'), 
  allowNull: false })
  declare estado: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare observaciones?: string;

  @ForeignKey(() => Deportista)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare ID_Deportista: number;

  @ForeignKey(() => Cronograma)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare ID_Cronograma: number;

  @BelongsTo(() => Deportista,)
  declare deportista: Deportista;

  @BelongsTo(() => Cronograma,)
  declare cronograma: Cronograma;


}

export default Asistencia;