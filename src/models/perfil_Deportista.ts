import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import Deportista from "../models/deportista";
import h_Lesiones_Antes from "./h_Lesiones_Antes";
import Equipo from "./equipo";
import Rel_Deportista_Equipo from "./rel_Deportista_Equipo";

@Table({ tableName: 'perfil_Deportista', timestamps: true})

export class Perfil_Deportista extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  declare ID_Perfil_Deportista: number;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare foto_Perfil: string;

  @ForeignKey(() => Deportista)
  @Column({allowNull: true})
  declare ID_Deportista :number;

  @BelongsTo(() => Deportista)
  declare deportista: Deportista;

 
  }
export default Perfil_Deportista;