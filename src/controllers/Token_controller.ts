import { Request, Response } from "express";
import Token from "../models/token";

interface TokenRequestBody {
  ID_Deportista?: number;
  ID_Entrenador?: number;
  tokenFCM: string;
}

export class TokenController {

  static guardarToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { ID_Deportista, ID_Entrenador, tokenFCM }: TokenRequestBody = req.body;

      // Validaciones
      if (!tokenFCM || typeof tokenFCM !== 'string' || tokenFCM.trim() === '') {
        res.status(400).json({ 
          success: false, 
          msg: "El token FCM es obligatorio y debe ser una cadena válida" 
        });
        return;
      }

      // Validar que solo venga un tipo de usuario
      if (ID_Deportista && ID_Entrenador) {
        res.status(400).json({ 
          success: false, 
          msg: "No se puede asociar un token a deportista y entrenador al mismo tiempo" 
        });
        return;
      }

      if (!ID_Deportista && !ID_Entrenador) {
        res.status(400).json({ 
          success: false, 
          msg: "Debe especificar ID_Deportista o ID_Entrenador" 
        });
        return;
      }

      // Validar que los IDs sean números válidos
      if (ID_Deportista && (typeof ID_Deportista !== 'number' || ID_Deportista <= 0)) {
        res.status(400).json({ 
          success: false, 
          msg: "ID_Deportista debe ser un número entero positivo" 
        });
        return;
      }

      if (ID_Entrenador && (typeof ID_Entrenador !== 'number' || ID_Entrenador <= 0)) {
        res.status(400).json({ 
          success: false, 
          msg: "ID_Entrenador debe ser un número entero positivo" 
        });
        return;
      }

      // Buscar si el token ya está registrado
      const existingToken = await Token.findOne({ where: { tokenFCM: tokenFCM.trim() } });

      if (existingToken) {
        // Actualizamos solo el campo correspondiente, manteniendo el otro como null
        if (ID_Deportista) {
          existingToken.ID_Deportista = ID_Deportista;
          existingToken.ID_Entrenador = null as any;
        } else if (ID_Entrenador) {
          existingToken.ID_Entrenador = ID_Entrenador;
          existingToken.ID_Deportista = null as any;
        }
        await existingToken.save();
        console.log(`✅ Token actualizado para ${ID_Deportista ? 'deportista' : 'entrenador'}: ${ID_Deportista || ID_Entrenador}`);
        
        res.json({ 
          success: true, 
          msg: "Token actualizado correctamente",
          data: {
            ID_Token: existingToken.ID_Token,
            ID_Deportista: existingToken.ID_Deportista,
            ID_Entrenador: existingToken.ID_Entrenador,
            tokenFCM: existingToken.tokenFCM
          }
        });
      } else {
        // Creamos un nuevo token
        const newToken = await Token.create({
          ID_Deportista: ID_Deportista || (null as any),
          ID_Entrenador: ID_Entrenador || (null as any),
          tokenFCM: tokenFCM.trim(),
        } as any);
        
        console.log(`✅ Token creado para ${ID_Deportista ? 'deportista' : 'entrenador'}: ${ID_Deportista || ID_Entrenador}`);
        
        res.status(201).json({ 
          success: true, 
          msg: "Token creado correctamente",
          data: {
            ID_Token: newToken.ID_Token,
            ID_Deportista: newToken.ID_Deportista,
            ID_Entrenador: newToken.ID_Entrenador,
            tokenFCM: newToken.tokenFCM
          }
        });
      }
    } catch (error) {
      console.error("Error en guardarToken:", error);
      res.status(500).json({ 
        success: false, 
        msg: "Error interno del servidor al guardar el token" 
      });
    }
  };

  static eliminarToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      // Validar que el ID sea un número válido
      const tokenId = parseInt(id);
      if (isNaN(tokenId) || tokenId <= 0) {
        res.status(400).json({ 
          success: false, 
          msg: "ID de token inválido" 
        });
        return;
      }

      const deleted = await Token.destroy({ where: { ID_Token: tokenId } });

      if (deleted > 0) {
        res.json({ 
          success: true, 
          msg: "Token eliminado correctamente" 
        });
      } else {
        res.status(404).json({ 
          success: false, 
          msg: "Token no encontrado" 
        });
      }
    } catch (error) {
      console.error("Error en eliminarToken:", error);
      res.status(500).json({ 
        success: false, 
        msg: "Error interno del servidor al eliminar el token" 
      });
    }
  };


  static obtenerTokensDeportista = async (req: Request, res: Response): Promise<void> => {
    try {
      const { ID_Deportista } = req.params;

      // Validar que el ID sea un número válido
      const deportistaId = parseInt(ID_Deportista);
      if (isNaN(deportistaId) || deportistaId <= 0) {
        res.status(400).json({ 
          success: false, 
          msg: "ID de deportista inválido" 
        });
        return;
      }

      const tokens = await Token.findAll({ 
        where: { ID_Deportista: deportistaId },
        attributes: ['ID_Token', 'ID_Deportista', 'tokenFCM']
      });

      res.json({ 
        success: true, 
        data: tokens,
        count: tokens.length
      });
    } catch (error) {
      console.error("Error en obtenerTokensDeportista:", error);
      res.status(500).json({ 
        success: false, 
        msg: "Error interno del servidor al obtener tokens del deportista" 
      });
    }
  };


  static obtenerTokensEntrenador = async (req: Request, res: Response): Promise<void> => {
    try {
      const { ID_Entrenador } = req.params;

      // Validar que el ID sea un número válido
      const entrenadorId = parseInt(ID_Entrenador);
      if (isNaN(entrenadorId) || entrenadorId <= 0) {
        res.status(400).json({ 
          success: false, 
          msg: "ID de entrenador inválido" 
        });
        return;
      }

      const tokens = await Token.findAll({ 
        where: { ID_Entrenador: entrenadorId },
        attributes: ['ID_Token', 'ID_Entrenador', 'tokenFCM']
      });

      res.json({ 
        success: true, 
        data: tokens,
        count: tokens.length
      });
    } catch (error) {
      console.error("Error en obtenerTokensEntrenador:", error);
      res.status(500).json({ 
        success: false, 
        msg: "Error interno del servidor al obtener tokens del entrenador" 
      });
    }
  };

  static limpiarTokensHuerfanos = async (req: Request, res: Response): Promise<void> => {
    try {
      // Eliminar tokens que no tienen ni deportista ni entrenador asociado
      const deleted = await Token.destroy({
        where: {
          ID_Deportista: null as any,
          ID_Entrenador: null as any
        }
      });

      console.log(`🧹 Tokens huérfanos eliminados: ${deleted}`);
      res.json({ 
        success: true, 
        msg: `${deleted} tokens huérfanos eliminados`,
        deletedCount: deleted
      });
    } catch (error) {
      console.error("Error en limpiarTokensHuerfanos:", error);
      res.status(500).json({ 
        success: false, 
        msg: "Error interno del servidor al limpiar tokens huérfanos" 
      });
    }
  };

  // Función adicional para obtener todos los tokens (útil para debugging)
  static obtenerTodosLosTokens = async (req: Request, res: Response): Promise<void> => {
    try {
      const tokens = await Token.findAll({
        attributes: ['ID_Token', 'ID_Deportista', 'ID_Entrenador', 'tokenFCM'],
        order: [['ID_Token', 'DESC']]
      });

      res.json({ 
        success: true, 
        data: tokens,
        count: tokens.length
      });
    } catch (error) {
      console.error("Error en obtenerTodosLosTokens:", error);
      res.status(500).json({ 
        success: false, 
        msg: "Error interno del servidor al obtener todos los tokens" 
      });
    }
  };
}
