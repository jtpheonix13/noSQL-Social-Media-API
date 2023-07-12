const router = require('express').Router();

const {
    getUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    removeFriend,

} = require('../../controllers/user-controller');

// /api/users
router.route('/').get(getUsers).post(createUser);

// user id routes
router.route('/:userId').get(getSingleUser).put(updateUser).delete(deleteUser);

// friend routes
router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend);

module.exports = router;