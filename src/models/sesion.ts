import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import Entrenador from './entrenador'; 
import Microciclo from "./microciclo";
import Rel_Microciclo_Sesion from "./rel_Microciclo_Sesion";
import Ejercicio from "./ejercicio";
import rel_Ejercicio_Sesion from "./rel_Ejercicio_Sesion";

@Table({ tableName: 'Sesion', timestamps: true })
export class Sesion extends Model {

  @Column({ primaryKey: true, autoIncrement: true })
  declare ID_Sesion: number;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare nombre_Sesion: string;

  @Column({ type: DataType.TIME, allowNull: false })
  declare hora_Inicio: string;

  @Column({ type: DataType.TIME, allowNull: false })
  declare hora_Fin: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare objetivo: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare observaciones: string;

  @ForeignKey(() => Entrenador)
  @Column({ allowNull: false })
  declare ID_Entrenador: number;

  @BelongsTo(() => Entrenador)
  declare entrenador: Entrenador;

  @BelongsToMany (()=> Microciclo, ()=> Rel_Microciclo_Sesion)
  declare microciclo: Microciclo[];

  @BelongsToMany (()=> Ejercicio, ()=> rel_Ejercicio_Sesion)
  declare ejercicio: Ejercicio[];

}

export default Sesion;
