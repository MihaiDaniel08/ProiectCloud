import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length === 0) {
        throw new Error('The environment variable JWT_SECRET is not set.');
    }
    return secret;
};

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

export const verifyPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

export const signToken = async (payload) => {
    const secret = new TextEncoder().encode(getJwtSecretKey());
    const alg = 'HS256';

    return new SignJWT(payload)
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(secret);
};

export const verifyToken = async (token) => {
    try {
        const secret = new TextEncoder().encode(getJwtSecretKey());
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch (error) {
        return null;
    }
};
