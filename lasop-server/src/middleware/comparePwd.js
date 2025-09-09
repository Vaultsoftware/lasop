const bcrypt = require('bcrypt');

const comparePwd = async (id, model) => {
    try {
        const user = await model.findOne({ email: id.email }).select('+password');

        if (!user) {
            throw new Error('No account found');
        }

        return await bcrypt.compare(id.password, user.password);
    } catch (error) {
        throw new Error(error);
    };
};

module.exports = comparePwd;