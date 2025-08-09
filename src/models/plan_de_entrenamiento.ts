import { Table, Column, Model, DataType, HasMany, ForeignKey, BelongsToMany } from 'sequelize-typescript';
import Microciclo from './microciclo';
import Entrenador from './entrenador';
import { Rel_Plan_Microciclo } from './rel_Plan_Microciclo';

@Table({ tableName: 'plan_De_Entrenamiento', timestamps: true,})

export class plan_De_Entrenamiento extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  declare ID_Plan: number;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare nombre_Plan: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare objetivo: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare duracion: number;
//
  @Column({ type: DataType.DATEONLY, allowNull: false, defaultValue: DataType.NOW})
  declare fecha_inicio: Date;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare fecha_fin: Date;

  @ForeignKey(() =>Entrenador)
  @Column({allowNull: false })
  declare ID_Entrenador: number;

  @BelongsToMany (()=> Microciclo, ()=>Rel_Plan_Microciclo)
    declare microciclo : Microciclo[];
}

export default plan_De_Entrenamiento;