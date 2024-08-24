import { User } from "../models/user.model.js";

export interface JwtPayload {
    id: string;
}

export interface AuthenticatedRequest extends Request {
    user?: typeof User;
}