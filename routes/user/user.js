const express = require('express');
const { usercontroller } = require('../../controller/user');
const { auth } = require('../../middleware/auth');
const multer = require('multer');
const router = express.Router();
const upload = multer();

router.post('/user/create', usercontroller?.createUser );
router.post('/login' , usercontroller?.loginUser );
router.post('/check-auth', auth, usercontroller?.checkAuth );
router.post('/logout' , usercontroller?.logoutUser );

router.post('/create-transection' , usercontroller?.createTransection );
router.get('/get-transferable-tarnsection',auth, usercontroller?.getTransferableTarnsection);
router.get('/get-receivables-tarnsection',auth, usercontroller?.getReceivablesTarnsection);

router.post('/receive-all-points',auth, usercontroller?.receiveAllPoints);
router.post('/reject-points',auth, usercontroller?.rejectPoints);
router.post('/cancel-points',auth, usercontroller?.cancelPoints);

router.post('/update-pin',auth, usercontroller?.updatePin);
router.post('/update-password',auth, usercontroller?.updatePassword);
router.post('/get-user',auth, usercontroller?.getUser);
router.post('/user/update' ,auth, usercontroller?.updateUser );
router.get('/get-my-users' ,auth, usercontroller?.getMyUser );

router.post('/list-pin-pass',auth, usercontroller?.listPinPass);
router.post('/update-pin-passwpord',auth, usercontroller?.updatePinPass);
router.post('/change-pin-pass',auth, usercontroller?.changePinPass);
router.post('/reset-pin-pass',auth, usercontroller?.resetPinPass);

//mobile api
router.post('/receive-all-points-app',upload.none(), usercontroller?.receiveAllPointsMobile);
router.post('/get-transferable-tarnsection',upload.none(), usercontroller?.getTransferableTarnsection);
router.post('/get-receivables-tarnsection', upload.none(),usercontroller?.getReceivablesTarnsection);
router.post('/reject-points-app',upload.none(),usercontroller?.rejectPointsMobile);
router.post('/cancel-points-app',upload.none(), usercontroller?.cancelPointsMobile);

//Application api
router.post('/userlogin' ,upload.none(),usercontroller?.loginAppUser );
router.post('/userupdatecoins' , upload.none(),usercontroller?.updateUserCoins );


module.exports = router ;
