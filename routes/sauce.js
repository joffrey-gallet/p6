const express = require('express')
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')
const router = express.Router();
const sauceCtrl = require('../controllers/sauce');

router.post("/", auth, multer, sauceCtrl.createSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.get("/", auth, sauceCtrl.getAllSauces);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.likeDislike);

module.exports = router;