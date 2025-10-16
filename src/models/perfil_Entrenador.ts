import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import Entrenador from "../models/entrenador";

@Table({ tableName: 'Perfil_Entrenador', timestamps: true})

export class Perfil_Entrenador extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  declare ID_Perfil_Entrenador: number;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare foto_Perfil: string;

  @ForeignKey(() => Entrenador)
  @Column({allowNull: true})
  declare ID_Entrenador :number;

  @BelongsTo(() => Entrenador, {foreignKey: 'ID_Entrenador', as: 'Entrenador'})
  declare entrenador: Entrenador;
}
export default Perfil_Entrenador;