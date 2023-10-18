import { validationResult } from "express-validator";
import ApiError from "../exceptions/api-error.js";
import userService from "../services/user/user-service.js";
import userImageService from "../services/user/user-image-service.js";
import userTextService from "../services/user/user-text-service.js";
import userVideoService from "../services/user/user-video-service.js";
import userTableService from "../services/user/user-table-service.js";

/**
 * Главный контроллер пользовательских запросов
 */
class UserController {
    /* ----------- IMAGES ----------- */
    async imagesAdd(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await userImageService.imagesAdd(req.body, req.files['image'][0]);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async imagesEdit(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await userImageService.imagesEdit(req.body, req.files['image'][0]);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async imagesDelete(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await userImageService.imagesDelete(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async imagesGet(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await userImageService.imagesGet(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async imagesGetAll(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await userImageService.imagesGetAll(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    /* ----------- TEXTS ----------- */
    async textsAdd(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await userTextService.textsAdd(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async textsEdit(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await userTextService.textsEdit(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async textsDelete(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await userTextService.textsDelete(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async textsGet(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await userTextService.textsGet(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async textsGetAll(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await userTextService.textsGetAll(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    /* ----------- VIDEOS ----------- */
    async videosAdd(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await userVideoService.videosAdd(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async videosEdit(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await userVideoService.videosEdit(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async videosDelete(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await userVideoService.videosDelete(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async videosGet(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await userVideoService.videosGet(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async videosGetAll(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await userVideoService.videosGetAll(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    /* ----------- TABLES ----------- */
    async tablesAdd(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await userTableService.tablesAdd(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async tablesEdit(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await userTableService.tablesEdit(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async tablesDelete(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await userTableService.tablesDelete(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async tablesGet(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await userTableService.tablesGet(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async tablesGetAll(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await userTableService.tablesGetAll(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }
}

export default new UserController();