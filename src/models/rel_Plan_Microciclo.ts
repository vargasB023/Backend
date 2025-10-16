import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import Microciclo from "./microciclo";
import plan_De_Entrenamiento from "./plan_de_entrenamiento";

@Table({ tableName: 'Rel_Plan_Microciclo', timestamps: false })
export class Rel_Plan_Microciclo extends Model {

  @Column({ primaryKey: true, autoIncrement: true })
  declare ID_Rel_Plan_Microciclo: number;

  @ForeignKey(() => Microciclo)
  @Column({ allowNull: false })
  declare ID_Microciclo: number;

  @ForeignKey(() => plan_De_Entrenamiento)
  @Column({ allowNull: false })
  declare ID_Plan: number;
}

export default Rel_Plan_Microciclo;