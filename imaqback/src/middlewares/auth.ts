const MISSING_ROLE = "Usted no posee con los permisos adecuados para consumir este recurso."

const isAdmin = (req: any, res: any, next: any) => {
    const role: number = parseInt(req.session.userInfo?.idRol)
    if (role === 1) {
        next();
    } else {
        res.status(403).json({ "ok": false, "message": MISSING_ROLE });
    }
}

const isManager = (req: any, res: any, next: any) => {
    const role: number = parseInt(req.session.userInfo?.idRol)
    if (role === 1 || role === 2) {
        next();
    } else {
        res.status(403).json({ "ok": false, "message": MISSING_ROLE });
    }
}

module.exports = {isAdmin, isManager}