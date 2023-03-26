import bcrypt from "bcrypt";

export const generateHash = (password: string) => {
    const salt = bcrypt.genSaltSync(12);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}

export const comparePassword = (password: string, hashPassword: string) => {
    return bcrypt.compareSync(password, hashPassword);
}