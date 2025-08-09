import { BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import Entrenador from "./entrenador";
import Rel_Deportista_Equipo from "./rel_Deportista_Equipo";
import Deportista from "./deportista";
import Cronograma from "./Cronograma";


@Table({ tableName: 'equipo', timestamps: true})
export class Equipo extends Model<Equipo>{
  @Column({ primaryKey: true, autoIncrement: true })
  declare ID_Equipo: number;

  @Column({ type: DataType.STRING(30), allowNull: false })
  declare nombre_Equipo: string;
  
  @Column({ type: DataType.ENUM('INFANTIL', 'JUVENIL', 'MAYOR'), allowNull: false })
  declare categoria: string;
  
  @Column({ type: DataType.ENUM('MASCULINO', 'FEMENINO', 'MIXTO'), allowNull: false })
  declare liga: string;

  @Column({ type: DataType.ENUM('ACTIVO', 'INACTIVO'), allowNull: false })
  declare estado_Equipo: string;
  
  @HasMany(() =>Cronograma)
  declare cronograma :Cronograma[];

  @ForeignKey(() => Entrenador)
  @Column({allowNull : false})
  declare ID_Entrenador: number 

  @BelongsToMany (()=> Deportista, ()=> Rel_Deportista_Equipo)
    declare deportista : Deportista[];
}
export default Equipo;