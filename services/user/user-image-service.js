import dotenv from 'dotenv';
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });
import config from 'config';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import db from '../../db/index.js';
import tokenService from '../token/token-service.js';
import jwtService from '../token/jwt-service.js';
import ApiError from '../../exceptions/api-error.js';
import SuccessDto from '../../dtos/response/success-dto.js';
import RefreshDto from '../../dtos/auth/refresh-dto.js';
import RoleDto from '../../dtos/auth/role-dto.js';
import mailService from '../mail/mail-service.js';
import MailerForms from '../../constants/forms/mailer-forms.js';
import fs from 'fs';

/**
 * Контроллер для работы с изображениями
 */
class UserImageService {
    /**
     * Добавление нового изображения
     * @param {*} data Данные
     * @param {*} image Изображение
     * @returns 
     */
    async imagesAdd(data, image) {
        const t = await db.sequelize.transaction();

        try {
            const { users_id } = data;

            const resImage = await db.Images.create({
                users_id: users_id,
                filename: image.filename,
                filepath: image.path,
            }, { transaction: t });

            await t.commit();

            return resImage;
        } catch (e) {
            fs.unlinkSync(image.path);

            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Удаление изображения
     * @param {*} data Данные
     * @returns 
     */
    async imagesDelete(data) {
        const t = await db.sequelize.transaction();

        try {
            const {
                users_id,
                images_id,
            } = data;

            const image = await db.Images.findOne(({
                where: {
                    id: images_id,
                    users_id: users_id,
                }
            }));

            if (!image) {
                throw ApiError.NotFound(`Изображения с идентификатором ${images_id} не найдено`);
            }

            const images = [];
            images.push(image.filepath);

            await image.destroy({ transaction: t });

            await t.commit();

            for (let i = 0; i < images.length; i++) {
                if (fs.existsSync(images[i])) {
                    fs.unlinkSync(images[i]);
                }
            }

            return data;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Редактирование изображения
     * @param {*} data Данные
     * @param {*} image Изображение
     * @returns 
     */
    async imagesEdit(data, image) {
        const t = await db.sequelize.transaction();

        try {
            const {
                images_id,
                users_id
            } = data;

            const resImage = await db.Images.findOne(({
                where: {
                    id: images_id,
                    users_id: users_id
                }
            }));

            if (!resImage) {
                throw ApiError.NotFound(`Изображения с идентификатором ${images_id} не найдено`);
            }

            const ref = `${resImage.filepath}`;

            resImage.filepath = image.path;
            resImage.filename = image.filename;
            await resImage.save({ transaction: t });

            await t.commit();

            if (fs.existsSync(ref)) {
                fs.unlinkSync(ref);
            }

            return data;
        } catch (e) {
            fs.unlinkSync(image.path);

            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Получение конкретного изображения
     * @param {*} data Данные
     */
    async imagesGet(data) {
        try {
            const {
                users_id,
                images_id,
            } = data;

            const image = await db.Images.findOne(({
                where: {
                    id: images_id,
                    users_id: users_id
                }
            }));

            image.dataValues.filepath = `${config.get("url.api")}/${image.dataValues.filepath}`;

            return image;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Получение всех изображений
     * @param {*} data Данные
     * @returns 
     */
    async imagesGetAll(data) {
        try {
            const {
                users_id,
            } = data;

            const images = await db.Images.findAll(({
                where: {
                    users_id: users_id
                },
                order: [['created_at', 'DESC']]
            }));

            for(let i = 0; i < images.length; i++){
                const filepath = images[i].filepath;
                images[i].dataValues.filepath = `${config.get("url.api")}/${filepath}`;
            }

            return images;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }
}

export default new UserImageService();