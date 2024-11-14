import userService from "../service/user-service.js";

const register = async (req, res, next) => {
    try {
        const result = await userService.register(req.body);
        res.status(201).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const login = async (req, res, next) => {
    try {
        const result = await userService.login(req.body);

        if (result.cookies && result.cookies.refreshToken) {
            res.cookie(
                'refreshToken',
                result.cookies.refreshToken.value,
                result.cookies.refreshToken.options
            );
        }

        res.status(200).json({
            name: result.name,
            accessToken: result.accessToken
        })
    } catch (e) {
        next(e);
    }
}

const get = async (req, res, next) => {
    try {
        const email = req.user.email;
        const result = await userService.get(email);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const refreshToken = async (req, res, next) => {
    try {
        const result = await userService.refreshToken(req);
        res.status(200).json({
            name: result.name,
            accessToken: result.accessToken
        });
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const username = req.user.username;
        const request = req.body;
        request.username = username;

        const result = await userService.update(request);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        //console.error('Error during update:', e); // Tambahkan logging
        next(e);
    }
}

// const logout = async (req, res, next) => {
//     try {
//         await userService.logout(req.user.id, req.user.email, req.cookies?.refreshToken);
//         res.clearCookie('refreshToken');
//         res.status(200).json({
//             data: "OK"
//         });
//     } catch (e) {
//         console.error('Error during logout:', e); // Tambahkan logging
//         next(e);
//     }
// }

const logout = async (req, res, next) => {
    try {
        // Ambil user ID dari req.user dan refresh token dari cookies
        const userId = req.user.id;
        const cookieRefreshToken = req.cookies?.refreshToken;

        // Panggil fungsi logout dengan ID pengguna dan refresh token
        await userService.logout(userId, cookieRefreshToken);
        
        // Hapus cookie refresh token setelah logout
        res.clearCookie('refreshToken');
        res.status(200).json({
            data: "OK"
        });
    } catch (e) {
        console.error('Error during logout:', e); // Tambahkan logging
        next(e);
    }
}

export default {
    register,
    login,
    get,
    update,
    logout,
    refreshToken
}