import { Table, Column, Model, DataType, ForeignKey, BelongsTo} from 'sequelize-typescript';
import Entrenador from './entrenador';
import Deportista from './deportista';

@Table({ tableName: 'recomendaciones_Nutricion', timestamps: true })
export class recomendaciones_Nutricion extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  declare ID_Recomendacion: number;

  @Column({ type: DataType.DATE, allowNull: false })
  declare fecha: Date;

  @Column({type: DataType.TEXT,allowNull: false})
  declare descripcion: string;

  @Column({type: DataType.TEXT,allowNull: true})
  declare observaciones: string | null;

  @ForeignKey(() => Entrenador)
  @Column({allowNull: false })
  declare ID_Entrenador: number;

  @ForeignKey(() => Deportista)
  @Column({ allowNull: false })
  declare ID_Deportista: number;

  @BelongsTo(() => Deportista)
  declare deportista: Deportista;

  @BelongsTo(() => Entrenador)
  declare entrenador: Deportista;
}

export default recomendaciones_Nutricion;
