import {Table,Column,Model,DataType,ForeignKey,BelongsTo,} from "sequelize-typescript";
import Entrenador from "./entrenador";
import Deportista from "./deportista";

@Table({ tableName: "Tokens", timestamps: false })
export class Token extends Model<Token> {
  @Column({ primaryKey: true, autoIncrement: true })
  declare ID_Token: number;

  @ForeignKey(() => Deportista)
  @Column({ allowNull: true })
  declare ID_Deportista: number;

  @BelongsTo(() => Deportista)
  declare deportista: Deportista;

  @ForeignKey(() => Entrenador)
  @Column({ allowNull: true })
  declare ID_Entrenador: number;

  @BelongsTo(() => Entrenador,)
  declare entrenador: Entrenador;

  @Column({ type: DataType.STRING(500), allowNull: false, unique: true })
  declare tokenFCM: string;
}

export default Token;
