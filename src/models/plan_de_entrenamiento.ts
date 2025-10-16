import { Table, Column, Model, DataType, HasMany, ForeignKey, BelongsToMany, BelongsTo } from 'sequelize-typescript';
import Microciclo from './microciclo';
import Entrenador from './entrenador';
import { Rel_Plan_Microciclo } from './rel_Plan_Microciclo';
import Equipo from './equipo';

@Table({ tableName: 'Plan_De_Entrenamiento', timestamps: true,})

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
  declare fecha_Inicio: Date;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare fecha_fin: Date;

  @Column({type: DataType.ENUM("PENDIENTE","EN CURSO", "FINALIZADO"),allowNull: false})
  declare estado: "PENDIENTE" | "EN CURSO" | "FINALIZADO";

  @ForeignKey(() =>Entrenador)
  @Column({allowNull: false })
  declare ID_Entrenador: number;

  @ForeignKey(() =>Equipo)
  @Column({allowNull: false })
  declare ID_Equipo: number;

  @BelongsTo(() => Equipo)
  declare equipo: Equipo;

  @BelongsToMany (()=> Microciclo, ()=>Rel_Plan_Microciclo)
    declare microciclo : Microciclo[];
}

export default plan_De_Entrenamiento;