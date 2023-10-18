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
 * Контроллер для работы с текстами
 */
class UserTextService {
    async textsAdd(data) {
        const t = await db.sequelize.transaction();

        try {
            const { users_id, text } = data;

            const resText = await db.Texts.create({
                users_id: users_id,
                text: text
            }, { transaction: t });

            await t.commit();

            return resText;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async textsDelete(data) {
        const t = await db.sequelize.transaction();

        try {
            const {
                users_id,
                texts_id,
            } = data;

            const text = await db.Texts.findOne(({
                where: {
                    id: texts_id,
                    users_id: users_id,
                }
            }));

            if (!text) {
                throw ApiError.NotFound(`Текста с идентификатором ${texts_id} не найдено`);
            }

            await text.destroy({ transaction: t });
            await t.commit();

            return data;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async textsEdit(data) {
        const t = await db.sequelize.transaction();

        try {
            const {
                users_id,
                texts_id,
                text
            } = data;

            const resText = await db.Texts.findOne(({
                where: {
                    id: texts_id,
                    users_id: users_id
                }
            }));

            if (!resText) {
                throw ApiError.NotFound(`Текста с идентификатором ${texts_id} не найдено`);
            }


            resText.text = text
            await resText.save({ transaction: t });

            await t.commit();

            return data;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async textsGet(data) {
        try {
            const {
                users_id,
                texts_id,
            } = data;

            const text = await db.Texts.findOne(({
                where: {
                    id: texts_id,
                    users_id: users_id
                }
            }));

            return text;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    async textsGetAll(data) {
        try {
            const {
                users_id,
            } = data;

            const images = await db.Texts.findAll(({
                where: {
                    users_id: users_id
                },
                order: [['created_at', 'DESC']]
            }));

            return images;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }
}

export default new UserTextService();