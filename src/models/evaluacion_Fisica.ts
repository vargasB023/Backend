import { Table, Column, Model, DataType, ForeignKey, BelongsTo, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import Evaluacion_Deportiva from './evaluacion_Deportiva';

@Table({ tableName: 'Evaluacion_Fisica', timestamps: true })
export class Evaluacion_Fisica extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  declare ID_Evaluacion_Fisica: number;

  @Column({ type: DataType.DECIMAL(5, 2), allowNull: false })
  declare peso: number;

  @Column({ type: DataType.DECIMAL(5, 2), allowNull: false })
  declare estatura: number;

  @Column({ type: DataType.DECIMAL(5, 2), allowNull: false })
  declare imc: number;

  @Column({ type: DataType.DECIMAL(4, 2), allowNull: false })
  declare tasa_Corporal: number;

  @Column({ type: DataType.DECIMAL(4, 2), allowNull: false })
  declare sprint: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare test_Course_Navette?: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare flexibilidad_Hombro: string;

  @Column({ type: DataType.DECIMAL(4, 2), allowNull: false })
  declare agilidad: number;

   @ForeignKey(() => Evaluacion_Deportiva)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare ID_Evaluacion_De: number;

  @BelongsTo(() => Evaluacion_Deportiva)
  declare evaluacion_deportiva: Evaluacion_Deportiva;
}

export default Evaluacion_Fisica;