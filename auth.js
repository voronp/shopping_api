
const getAuthUser = async (req) => {
    // should be logic to get actual auth user, for now it just checks token
    return req.headers && req.headers.authorization === 'Bearer X' ? {name: 'User1', id: 1} : {name: 'Unknown', id: null}
}

const useAuth = () => async (req, res, next) => {
    // middleware that extends request with current auth user
    req.user = await getAuthUser(req);
    next();
}

module.exports = {
    getAuthUser,
    useAuth,
}
