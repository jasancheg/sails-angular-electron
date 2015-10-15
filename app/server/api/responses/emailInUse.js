/* global module */

/**
 * Usage:
 *
 * ```
 * res.emailInUse();
 * ```
 *
 */

module.exports = function emailInUse (){

    // Get access to `res`
    // (since the arguments are up to us)
    var res = this.res,
        req = this.req;
    res.status(409);
    return res.json({
        err: 'E_VALIDATION',
        summary: '409 already taken',//req.__('409User'),
        model: 'User',
        data: {
            email: [
                {
                    rule: 'unique',
                    message: 'email already exists' 
                }
            ]
        }
    });
};