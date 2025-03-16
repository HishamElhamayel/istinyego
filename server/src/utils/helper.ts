import { UserDocument } from "#/models/user.model";

export const generateToken = (length: number) => {
    let opt = "";

    for (let i = 0; i < length; i++) {
        opt += Math.floor(Math.random() * 10);
    }

    return opt;
};

export const formatProfile = (user: UserDocument) => {
    return {
        id: user._id,
        studentId: user.studentId,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        verified: user.verified,
        favoriteRoutes: user.favoriteRoutes,
        wallet: user.wallet,
    };
};
