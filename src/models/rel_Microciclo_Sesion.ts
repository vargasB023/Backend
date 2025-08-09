import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import Sesion from './sesion';
import Microciclo from './microciclo';

@Table({ tableName: 'rel_Microciclo_Sesion', timestamps: false })
export class Rel_Microciclo_Sesion extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  declare ID_Micro_Sesion: number;

  @Column({ type: DataType.TINYINT.UNSIGNED, allowNull: true })
  declare dia_Semana: number;

  @ForeignKey(() => Microciclo)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare ID_Microciclo: number;

  @ForeignKey(() => Sesion)
  @Column({ allowNull: false })
  declare ID_Sesion: number;

}

export default Rel_Microciclo_Sesion;
