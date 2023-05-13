const router = require("express").Router();
const signUp = require("./controllers/authController").signUp;
const login = require("./controllers/authController").login;
const validation = require("./validation/joiValidation");
const signUpSchema = require("./validation/validSchema").signUpSchema;
const loginSchema = require("./validation/validSchema").loginSchema;
const updateSchema = require("./validation/validSchema").updateSchema;
const getUsers = require("./controllers/usersController").getUsers;
const getUserById = require("./controllers/usersController").getUserById;
const updateUser = require("./controllers/usersController").updateUser;
const countUsers = require("./controllers/usersController").countUsers;
const {getUserProfileById, getFriendRequests, getFriends} = require("./controllers/usersController");

const isAdmin = require("./controllers/guardController").isAdmin;
const isUser = require("./controllers/guardController").isUser;
const { isAdminOrUserHimself, userFriend } = require("./controllers/guardController");
const { deleteUser } = require("./controllers/usersController");
const { postSchema, updatePostSchema, commentSchema, updateCommentSchema, categorySchema } = require("./validation/validSchema");
const { sendFriendRequest, cancelFriendRequest, acceptFriendRequest, deleteFriend, rejectFriendRequest } = require("./controllers/friendController");
const { getChatMssgs, postMssg, createChatGroup, joinChatGroup, getPublicGroups, postGroupMssg, getRoomMssgs } = require("./controllers/chatController");

const uploadProfile = require("./controllers/imgsController").uploadProfile;
const uploadMW = require("./controllers/imgsController").uploadMW;


router.post("/api/auth/signup" , validation(signUpSchema), signUp);
router.post("/api/auth/login" , validation(loginSchema) ,login );
router.get("/api/users" , isUser , getUsers );  // hena msh zy elBlog , hena ay 7d yshoof koll elUsers

router.get("/api/user/friendrequests" , isUser ,  getFriendRequests);

router.get("/api/user/:id" , getUserById);
router.put("/api/user/:id" , isUser , validation(updateSchema), updateUser);
router.get("/api/users/count" , isAdmin, countUsers);
router.delete("/api/user/:id" , isAdminOrUserHimself , deleteUser);

router.post("/api/user/upload-photo" , isUser , uploadMW.single("image") , uploadProfile );

// friend Routes
router.post("/api/friend/sendreq" , userFriend , sendFriendRequest );
router.delete("/api/friend/cancelreq/:id" , userFriend , cancelFriendRequest); 
router.post("/api/friend/accept" , userFriend , acceptFriendRequest );
router.delete("/api/friend/reject/:id" , userFriend , rejectFriendRequest );
router.delete("/api/friend/delete/:id" , userFriend , deleteFriend );

router.get("/api/friends" , isUser, getFriends);

router.get("/api/user/profile/:id" , getUserProfileById);

router.get("/api/chat/:id" , isUser , getChatMssgs);
router.post("/api/chat/addmssg" , isUser , postMssg);


router.post("/api/chat/create-group" , isUser, createChatGroup);

router.post("/api/chat/join-chat/:id" , isUser, joinChatGroup );

router.get("/api/rooms" , getPublicGroups);

router.post("/api/chat/addgroupmssg" , isUser , postGroupMssg);
router.get("/api/room/:id" , isUser , getRoomMssgs ); 

module.exports = router;