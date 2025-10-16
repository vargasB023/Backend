import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Sesion from './sesion';
import Microciclo from './microciclo';

@Table({ tableName: 'Rel_Microciclo_Sesion', timestamps: false })
export class Rel_Microciclo_Sesion extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  declare ID_Micro_Sesion: number;

  @Column({ type: DataType.TINYINT.UNSIGNED, allowNull: true })
  declare dia_Semana: number;

  @ForeignKey(() => Microciclo)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare ID_Microciclo: number;

  @ForeignKey(() => Sesion)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare ID_Sesion: number;

  @BelongsTo(() => Microciclo)
  declare microciclo: Microciclo;

  @BelongsTo(() => Sesion)
  declare sesion: Sesion;
}

export default Rel_Microciclo_Sesion;
