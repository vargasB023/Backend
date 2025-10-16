import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import Deportista from './deportista';
import Entrenador from './entrenador';

@Table({ tableName: 'Rel_Deportista_Entrenador', timestamps: true })
export class rel_Deportista_Entrenador extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  declare ID_Tiene: number;
  

  @ForeignKey(() => Deportista)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare ID_Deportista: number;

  @ForeignKey(() => Entrenador)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare ID_Entrenador: number;
}

export default rel_Deportista_Entrenador;
