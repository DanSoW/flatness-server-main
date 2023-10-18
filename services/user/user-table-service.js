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
class UserTableService {
    async tablesAdd(data) {
        const t = await db.sequelize.transaction();

        try {
            const { users_id, headers } = data;

            const resText = await db.Tables.create({
                users_id: users_id,
                headers: headers
            }, { transaction: t });

            await t.commit();

            return resText;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async tablesDelete(data) {
        const t = await db.sequelize.transaction();

        try {
            const {
                users_id,
                tables_id,
            } = data;

            const headers = await db.Tables.findOne(({
                where: {
                    id: tables_id,
                    users_id: users_id,
                }
            }));

            if (!headers) {
                throw ApiError.NotFound(`Таблицы с идентификатором ${tables_id} не найдено`);
            }

            await headers.destroy({ transaction: t });
            await t.commit();

            return data;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async tablesEdit(data) {
        const t = await db.sequelize.transaction();

        try {
            const {
                users_id,
                tables_id,
                headers
            } = data;

            const resText = await db.Tables.findOne(({
                where: {
                    id: tables_id,
                    users_id: users_id
                }
            }));

            if (!resText) {
                throw ApiError.NotFound(`Таблицы с идентификатором ${tables_id} не найдено`);
            }


            resText.headers = headers
            await resText.save({ transaction: t });

            await t.commit();

            return data;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async tablesGet(data) {
        try {
            const {
                users_id,
                tables_id,
            } = data;

            const headers = await db.Tables.findOne(({
                where: {
                    id: tables_id,
                    users_id: users_id
                }
            }));

            return headers;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    async tablesGetAll(data) {
        try {
            const {
                users_id,
            } = data;

            const images = await db.Tables.findAll(({
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

export default new UserTableService();