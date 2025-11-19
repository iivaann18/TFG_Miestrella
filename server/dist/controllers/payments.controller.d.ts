import { Request, Response } from 'express';
export declare const createPaymentIntent: (req: Request, res: Response) => Promise<void>;
export declare const confirmPayment: (req: Request, res: Response) => Promise<void>;
export declare const getPaymentStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const handleWebhook: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=payments.controller.d.ts.map