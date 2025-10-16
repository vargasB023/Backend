import { Table, Column, Model, DataType, ForeignKey, BelongsTo, BelongsToMany } from 'sequelize-typescript';
import Plan_De_Entrenamiento, { plan_De_Entrenamiento } from './plan_de_entrenamiento';
import Sesion from './sesion';
import Rel_Microciclo_Sesion from './rel_Microciclo_Sesion';
import { Rel_Plan_Microciclo } from './rel_Plan_Microciclo';

@Table({ tableName: 'Microciclo', timestamps: true,})
  export class Microciclo extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  declare ID_Microciclo: number;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare nombre_Microciclo: string;

  @Column({ type: DataType.DATEONLY, allowNull: false, defaultValue: DataType.NOW })
  declare fecha_Inicio: Date;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare fecha_Fin: Date;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare descripcion: string;

  @Column({ type: DataType.STRING(250), allowNull: true })
  declare objetivos: string;

  @Column({ type: DataType.STRING(50), allowNull: true })
  declare intensidad: string;

  @BelongsToMany (()=> Sesion, ()=> Rel_Microciclo_Sesion)
    declare sesion : Sesion[];
  
  @BelongsToMany (()=> plan_De_Entrenamiento, ()=> Rel_Plan_Microciclo)
    declare plan_de_entrenamiento : Plan_De_Entrenamiento[];
  
}
export default Microciclo;