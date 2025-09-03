import type { Response, Request } from "express";

export const getSupportedAssets = async (req: Request, res: Response) => {

  try {
    //get asset from db or pub sub queue
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: (err as Error).message,
    })
  }

}
