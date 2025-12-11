import { Request, Response, NextFunction } from "express";

// Interface para erros do Prisma
interface PrismaError extends Error {
  code?: string;
}

export class ErrorMiddleware {
  handle(
    error: Error | PrismaError,
    req: Request,
    res: Response,
    next: NextFunction
  ): Response {
    console.error("Error:", error);

    // Prisma errors
    const prismaError = error as PrismaError;
    if (prismaError.code) {
      // P2002: Unique constraint violation
      if (prismaError.code === "P2002") {
        return res.status(409).json({
          success: false,
          message: "Registro duplicado",
          error: "DUPLICATE_ERROR",
        });
      }

      // P2025: Record not found
      if (prismaError.code === "P2025") {
        return res.status(404).json({
          success: false,
          message: "Registro não encontrado",
          error: "NOT_FOUND",
        });
      }

      // P2003: Foreign key constraint violation
      if (prismaError.code === "P2003") {
        return res.status(400).json({
          success: false,
          message: "Violação de integridade referencial",
          error: "FOREIGN_KEY_ERROR",
        });
      }
    }

    // Validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
        error: "VALIDATION_ERROR",
      });
    }

    // JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token inválido",
        error: "INVALID_TOKEN",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expirado",
        error: "EXPIRED_TOKEN",
      });
    }

    // Default error
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
      error: "INTERNAL_SERVER_ERROR",
    });
  }
}