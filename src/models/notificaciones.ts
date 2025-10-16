import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Deportista from './deportista';
import Entrenador from './entrenador';
import Evaluacion_Deportiva from './evaluacion_Deportiva';

@Table({tableName: 'Notificaciones',timestamps: true})
export class Notificaciones extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  declare ID_Notificacion: number;

  @Column({ type: DataType.DATE, allowNull: true })
  declare fecha: Date;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare titulo: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare descripcion: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare tipo: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  declare leida: boolean;

  @ForeignKey(() => Deportista)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare ID_Deportista: number;

  @ForeignKey(() => Entrenador)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare ID_Entrenador: number;

  @ForeignKey(() => Evaluacion_Deportiva)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare ID_Evaluacion_De: number;

  @BelongsTo(() => Deportista)
  declare deportista: Deportista;

  @BelongsTo(() => Entrenador)
  declare entrenador: Entrenador;

  @BelongsTo(() => Evaluacion_Deportiva)
  declare evaluacion: Evaluacion_Deportiva;

}

export default Notificaciones;
