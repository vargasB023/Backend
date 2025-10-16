import { BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import Entrenador from "./entrenador";
import Rel_Deportista_Equipo from "./rel_Deportista_Equipo";
import Deportista from "./deportista";
import Cronograma from "./Cronograma";
import plan_De_Entrenamiento from "./plan_de_entrenamiento";


@Table({ tableName: 'Equipo', timestamps: true})
export class Equipo extends Model<Equipo>{
  @Column({ primaryKey: true, autoIncrement: true })
  declare ID_Equipo: number;

  @Column({ type: DataType.STRING(30), allowNull: false })
  declare nombre_Equipo: string;
  
  @Column({ type: DataType.ENUM('INFANTIL', 'JUVENIL', 'MAYOR'), allowNull: false })
  declare categoria: string;

  @Column({ type: DataType.STRING(250), allowNull: true })
  declare foto_Equipo?: string;
  
  @Column({ type: DataType.ENUM('MASCULINO', 'FEMENINO', 'MIXTO'), allowNull: false })
  declare liga: string;

  @Column({ type: DataType.ENUM('ACTIVO', 'INACTIVO'), allowNull: false })
  declare estado_Equipo: string;
  
  @HasMany(() =>Cronograma)
  declare cronograma :Cronograma[];

  @HasMany(() =>plan_De_Entrenamiento)
  declare plan_de_entrenamiento :plan_De_Entrenamiento[];


  @ForeignKey(() => Entrenador)
  @Column({allowNull : false})
  declare ID_Entrenador: number 

  @BelongsToMany (()=> Deportista, ()=> Rel_Deportista_Equipo)
    declare deportista : Deportista[];
}
export default Equipo;