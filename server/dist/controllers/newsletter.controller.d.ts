import { Request, Response } from 'express';
export declare const subscribe: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const unsubscribe: (req: Request, res: Response) => Promise<void>;
export declare const getAllSubscribers: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=newsletter.controller.d.ts.map