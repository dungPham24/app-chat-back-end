const {
  addMessage,
  getAllMessage,
} = require("../controllers/messageControllers");
const {} = require("../controllers/usersControllers");

const router = require("express").Router();
router.post("/addmsg", addMessage);
router.post("/getmsg", getAllMessage);

module.exports = router;
