import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasOne } from 'sequelize-typescript';
import Deportista from './deportista';
import Entrenador from './entrenador';
import Evaluacion_Tecnica from './evaluacion_Tecnica';
import Evaluacion_Fisica from './evaluacion_Fisica';

@Table({ tableName: 'Evaluacion_Deportiva', timestamps: true })
export class Evaluacion_Deportiva extends Model {

  @Column({ primaryKey: true, autoIncrement: true })
  declare ID_Evaluacion_De: number;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare fecha: Date;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare resultados: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare observaciones?: string;

  @Column({type: DataType.ENUM('FISICA', 'TECNICA', 'TACTICA'),allowNull: false})
  declare tipo_Evaluacion: string;
  
  @ForeignKey(() => Deportista)
  @Column({ allowNull: false })
  declare ID_Deportista: number;

  @ForeignKey(() => Entrenador)
  @Column({ allowNull: false })
  declare ID_Entrenador: number;

  // CORRECCION: Cambiar @HasMany por @HasOne
  @HasOne(() => Evaluacion_Tecnica, 'ID_Evaluacion_De')
  declare evaluacion_tecnica: Evaluacion_Tecnica;

  //CORRECCION: Cambiar @HasMany por @HasOne
  @HasOne(() => Evaluacion_Fisica, 'ID_Evaluacion_De')
  declare evaluacion_fisica: Evaluacion_Fisica;

  @BelongsTo(() => Deportista)
  declare deportista: Deportista;
  
  @BelongsTo(() => Entrenador)
  declare entrenador: Entrenador;
}

export default Evaluacion_Deportiva;