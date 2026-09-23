import { type JwtPayload } from 'jsonwebtoken';
declare global {
    namespace Express {
        interface Request {
            user?: string | JwtPayload;
        }
    }
}
//# sourceMappingURL=index.d.ts.map