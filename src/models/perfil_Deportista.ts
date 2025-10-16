import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import Deportista from "../models/deportista";


@Table({ tableName: 'Perfil_Deportista', timestamps: true})

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