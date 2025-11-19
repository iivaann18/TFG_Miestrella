import { Request, Response } from 'express';
export declare const getAllCoupons: (req: Request, res: Response) => Promise<void>;
export declare const getCouponByCode: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const validateCoupon: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createCoupon: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateCoupon: (req: Request, res: Response) => Promise<void>;
export declare const deleteCoupon: (req: Request, res: Response) => Promise<void>;
export declare const toggleCoupon: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=coupons.controller.d.ts.map