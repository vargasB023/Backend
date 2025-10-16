import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Evaluacion_Deportiva from './evaluacion_Deportiva';

@Table({ tableName: 'Evaluacion_Tecnica', timestamps: true })
export class Evaluacion_Tecnica extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  declare ID_EvaluacionTec: number;

  @Column({ type: DataType.ENUM('POTENCIA', 'TECNICA', 'CONSISTENCIA', 'DIFICULTAD'), allowNull: false })
  declare SAQUE: 'POTENCIA' | 'TECNICA' | 'CONSISTENCIA' | 'DIFICULTAD';

  @Column({ type: DataType.ENUM('1', '2', '3'), allowNull: false })
  declare potencia_1: '1' | '2' | '3';

  @Column({ type: DataType.ENUM('1', '2', '3'), allowNull: false })
  declare tecnica_1: '1' | '2' | '3';

  @Column({ type: DataType.ENUM('1', '2', '3'), allowNull: false })
  declare consistencia: '1' | '2' | '3';

  @Column({ type: DataType.ENUM('1', '2', '3'), allowNull: false })
  declare dificultad: '1' | '2' | '3';

  @Column({ type: DataType.ENUM('TECNICA', 'PRESICION', 'CONTROL', 'DESPLAZAMIENTO'), allowNull: false })
  declare RECEPCION: 'TECNICA' | 'PRESICION' | 'CONTROL' | 'DESPLAZAMIENTO';

  @Column({ type: DataType.ENUM('1', '2', '3'), allowNull: false })
  declare tecnica_2: '1' | '2' | '3';

  @Column({ type: DataType.ENUM('1', '2', '3'), allowNull: false })
  declare presicion: '1' | '2' | '3';

  @Column({ type: DataType.ENUM('1', '2', '3'), allowNull: false })
  declare control: '1' | '2' | '3';

  @Column({ type: DataType.ENUM('1', '2', '3'), allowNull: false })
  declare desplazamiento: '1' | '2' | '3';

  @Column({ type: DataType.ENUM('TECNICA', 'POTENCIA', 'DIRECCION', 'COLOCACION', 'VARIEDAD DE GOLPES'), allowNull: false })
  declare ATAQUE: 'TECNICA' | 'POTENCIA' | 'DIRECCION' | 'COLOCACION' | 'VARIEDAD DE GOLPES';

  @Column({ type: DataType.ENUM('1', '2', '3'), allowNull: false })
  declare tecnica_3: '1' | '2' | '3';

  @Column({ type: DataType.ENUM('1', '2', '3'), allowNull: false })
  declare potencia_2: '1' | '2' | '3';

  @Column({ type: DataType.ENUM('1', '2', '3'), allowNull: false })
  declare direccion: '1' | '2' | '3';

  @Column({ type: DataType.ENUM('1', '2', '3'), allowNull: false })
  declare colocacion: '1' | '2' | '3';

  @Column({ type: DataType.ENUM('1', '2', '3'), allowNull: false })
  declare variedad_De_Golpes: '1' | '2' | '3';

  @Column({ type: DataType.ENUM('1', '2', '3'), allowNull: true })
  declare BLOQUEO?: '1' | '2' | '3';

  @Column({ type: DataType.ENUM('1', '2', '3'), allowNull: true })
  declare DEFENSA?: '1' | '2' | '3';


  @ForeignKey(() => Evaluacion_Deportiva)
  @Column({ allowNull: false }) 
  declare ID_Evaluacion_De: number;

  @BelongsTo(() => Evaluacion_Deportiva)
  declare evaluacion_deportiva: Evaluacion_Deportiva;
}

export default Evaluacion_Tecnica;