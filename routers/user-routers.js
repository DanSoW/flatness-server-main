import { Router } from 'express';
import { check } from 'express-validator';
import authController from '../controllers/auth-controller.js';
import AuthRoute from '../constants/routes/auth.js';
import authMiddleware from '../middlewares/auth-middleware.js';
import LogoutDto from '../dtos/auth/logout-dto.js';
import RefreshDto from '../dtos/auth/refresh-dto.js';
import UserRoute from '../constants/routes/user/index.js';
import userController from '../controllers/user-controller.js';
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

const uploader = multer({ storage: storage });
const router = new Router();

const imageUpload = uploader.fields([{ name: 'image', maxCount: 1 }]);

/* ----------- IMAGES ----------- */
router.post(
    UserRoute.IMAGES_ADD,
    [
        authMiddleware,
        imageUpload,
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    userController.imagesAdd
);

router.post(
    UserRoute.IMAGES_EDIT,
    [
        authMiddleware,
        imageUpload,
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('images_id', 'Некорректный идентификатор изображения').isInt({ min: 1 })
    ],
    userController.imagesEdit
);

router.post(
    UserRoute.IMAGES_DELETE,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('images_id', 'Некорректный идентификатор изображения').isInt({ min: 1 })
    ],
    userController.imagesDelete
);

router.post(
    UserRoute.IMAGES_GET,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('images_id', 'Некорректный идентификатор изображения').isInt({ min: 1 })
    ],
    userController.imagesGet
);

router.post(
    UserRoute.IMAGES_GET_ALL,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    userController.imagesGetAll
);

/* ----------- TEXTS ----------- */
router.post(
    UserRoute.TEXTS_ADD,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    userController.textsAdd
);

router.post(
    UserRoute.TEXTS_DELETE,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('texts_id', 'Некорректный идентификатор текста').isInt({ min: 1 }),
    ],
    userController.textsDelete
);

router.post(
    UserRoute.TEXTS_EDIT,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('texts_id', 'Некорректный идентификатор текста').isInt({ min: 1 }),
    ],
    userController.textsEdit
);

router.post(
    UserRoute.TEXTS_GET,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('texts_id', 'Некорректный идентификатор текста').isInt({ min: 1 }),
    ],
    userController.textsGet
);

router.post(
    UserRoute.TEXTS_GET_ALL,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
    ],
    userController.textsGetAll
);

/* ----------- VIDEOS ----------- */
router.post(
    UserRoute.VIDEOS_ADD,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    userController.videosAdd
);

router.post(
    UserRoute.VIDEOS_DELETE,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('videos_id', 'Некорректный идентификатор текста').isInt({ min: 1 }),
    ],
    userController.videosDelete
);

router.post(
    UserRoute.VIDEOS_EDIT,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('videos_id', 'Некорректный идентификатор текста').isInt({ min: 1 }),
    ],
    userController.videosEdit
);

router.post(
    UserRoute.VIDEOS_GET,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('videos_id', 'Некорректный идентификатор текста').isInt({ min: 1 }),
    ],
    userController.videosGet
);

router.post(
    UserRoute.VIDEOS_GET_ALL,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
    ],
    userController.videosGetAll
);

/* ----------- TABLES ----------- */
router.post(
    UserRoute.TABLES_ADD,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    userController.tablesAdd
);

router.post(
    UserRoute.TABLES_DELETE,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('tables_id', 'Некорректный идентификатор текста').isInt({ min: 1 }),
    ],
    userController.tablesDelete
);

router.post(
    UserRoute.TABLES_EDIT,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('tables_id', 'Некорректный идентификатор текста').isInt({ min: 1 }),
    ],
    userController.tablesEdit
);

router.post(
    UserRoute.TABLES_GET,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('tables_id', 'Некорректный идентификатор текста').isInt({ min: 1 }),
    ],
    userController.tablesGet
);

router.post(
    UserRoute.TABLES_GET_ALL,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
    ],
    userController.tablesGetAll
);

export default router;