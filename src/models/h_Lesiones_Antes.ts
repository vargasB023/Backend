import { Table, Column, Model, DataType, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript';
import Deportista from './deportista';

@Table({ tableName: 'H_Lesiones_Antes', timestamps: true })
class h_Lesiones_Antes extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  declare ID_Lesiones_Antes: number;

  @Column({ type: DataType.STRING(200), allowNull: false })
  declare añadir_Lesion_Antes: string;

  @Column({ type: DataType.DATE, allowNull: false })
  declare fecha: string;

  @Column(DataType.STRING(200))
  declare detalles_Lesion: string;

  @Column(DataType.INTEGER)
  declare tiempo_Fuera_Competencia: number;

  @Column(DataType.ENUM('LEVE', 'GRAVE', 'MODERADO'))
  declare gravedad: string;

  @Column(DataType.ENUM('SI', 'NO'))
  declare recaidas: string;

  @Column(DataType.ENUM('SI', 'NO'))
  declare lesiones_Fuera: string;

  @Column(DataType.ENUM('SI', 'NO'))
  declare dolor_Molestia: string;

  @Column(DataType.ENUM('SI', 'NO'))
  declare cirugias: string;

  @Column(DataType.ENUM('CENTRAL', 'REMATADOR', 'LIBERO', 'ARMADOR', 'ZAGUERO DERECHO', 'ZAGUERO IZQUIERDO'))
  declare posicion: string;

  @ForeignKey(() => Deportista)
    @Column({allowNull: true })
    declare ID_Deportista: number;
  
    @BelongsTo(() => Deportista)
    declare deportista: Deportista;
  
  
}

export default h_Lesiones_Antes;
