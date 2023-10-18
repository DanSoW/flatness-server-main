import { Router } from 'express';
import { check } from 'express-validator';
import adminController from '../controllers/admin-controller.js';
import AdminRoute from '../constants/routes/admin.js';
import authMiddleware from '../middlewares/auth-middleware.js';
import accessMiddleware from '../middlewares/access-middleware.js';
import converterTypeMiddleware from '../middlewares/converter-type-middleware.js';
import { v4 as uuid } from 'uuid';
import multer from 'multer';

// Конфигурирование файлового хранилища multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/');
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.');
        const extFile = ext[ext.length - 1];

        cb(null, `${uuid()}.${extFile}`);
    }
});

const upload = multer({ storage: storage });
const router = new Router();

const doorAddUpload = upload.fields([{ name: 'image_entry', maxCount: 1 }, { name: 'image_exit', maxCount: 1 }]);
router.post(
    AdminRoute.DOOR_ADD,
    [
        authMiddleware,
        accessMiddleware(["admin"]),
        doorAddUpload,
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    adminController.doorAdd
);

const doorCharacteristicAdd = upload.fields([{ name: 'images', maxCount: 7 }]);
router.post(
    AdminRoute.DOOR_CHARACTERISTIC_ADD,
    [
        authMiddleware,
        accessMiddleware(["admin"]),
        doorCharacteristicAdd,
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    adminController.doorCharacteristicAdd
);

router.get(
    AdminRoute.DOOR_GET_ALL,
    [
        authMiddleware,
        accessMiddleware(["admin"]),
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    adminController.doorGetAll
);

router.post(
    AdminRoute.DOOR_CHARACTERISTIC_DELETE,
    [
        authMiddleware,
        accessMiddleware(["admin"]),
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    adminController.doorCharacteristicDelete
);

router.post(
    AdminRoute.DOOR_DELETE,
    [
        authMiddleware,
        accessMiddleware(["admin"]),
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    adminController.doorDelete
);

router.post(
    AdminRoute.DOOR_INFO_EDIT,
    [
        authMiddleware,
        accessMiddleware(["admin"]),
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    adminController.doorInfoEdit
)

router.post(
    AdminRoute.DOOR_IMAGE_ENTRY_EDIT,
    [
        authMiddleware,
        accessMiddleware(["admin"]),
        doorAddUpload,
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    adminController.doorImageEntryEdit
)

router.post(
    AdminRoute.DOOR_IMAGE_EXIT_EDIT,
    [
        authMiddleware,
        accessMiddleware(["admin"]),
        doorAddUpload,
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    adminController.doorImageExitEdit
)

router.post(
    AdminRoute.DOOR_CHARACTERISTIC_INFO_EDIT,
    [
        authMiddleware,
        accessMiddleware(["admin"]),
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    adminController.doorCharacteristicInfoEdit
)

const doorCharacteristicImageAddUpload = upload.fields([{ name: 'image', maxCount: 1 }]);
router.post(
    AdminRoute.DOOR_CHARACTERISTIC_IMAGE_ADD,
    [
        authMiddleware,
        accessMiddleware(["admin"]),
        doorCharacteristicImageAddUpload,
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    adminController.doorCharacteristicImageAdd
)

router.post(
    AdminRoute.DOOR_CHARACTERISTIC_IMAGE_DELETE,
    [
        authMiddleware,
        accessMiddleware(["admin"]),
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    adminController.doorCharacteristicImageDelete
)

const filterInfoUpload = upload.fields([{ name: 'image', maxCount: 1 }]);
router.post(
    AdminRoute.FILTER_INFO_ADD,
    [
        authMiddleware,
        accessMiddleware(["admin"]),
        filterInfoUpload,
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    adminController.filterInfoAdd
)


export default router;