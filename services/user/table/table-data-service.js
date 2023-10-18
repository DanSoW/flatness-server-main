import dotenv from 'dotenv';
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });
import config from 'config';
import db from '../../../db/index.js';
import ApiError from '../../../exceptions/api-error.js';

/**
 * Контроллер для работы с таблицами
 */
class TableDataService {
    async dataAdd(requestBody) {
        const t = await db.sequelize.transaction();

        try {
            const { users_id, data, tables_id } = requestBody;

            const table = await db.Tables.findOne({
                where: {
                    id: tables_id,
                    users_id: users_id
                }
            });

            if(!table){
                throw ApiError.NotFound(`Таблицы с идентификатором ${tables_id} не найдено`);
            }

            const resText = await db.DataTables.create({
                users_id: users_id,
                tables_id: tables_id,
                data: data
            }, { transaction: t });

            await t.commit();

            return resText;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async dataDelete(requestBody) {
        const t = await db.sequelize.transaction();

        try {
            const {
                users_id,
                data_id,
                tables_id,
            } = requestBody;

            const table = await db.Tables.findOne({
                where: {
                    id: tables_id,
                    users_id: users_id
                }
            });

            if(!table){
                throw ApiError.NotFound(`Таблицы с идентификатором ${tables_id} не найдено`);
            }

            const data = await db.DataTables.findOne(({
                where: {
                    id: data_id,
                    tables_id: tables_id,
                }
            }));

            if (!data) {
                throw ApiError.NotFound(`Данных таблицы с идентификатором ${data_id} не найдено`);
            }

            await data.destroy({ transaction: t });
            await t.commit();

            return data;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async dataEdit(requestBody) {
        const t = await db.sequelize.transaction();

        try {
            const {
                users_id,
                tables_id,
                data_id,
                data
            } = requestBody;

            const table = await db.Tables.findOne({
                where: {
                    id: tables_id,
                    users_id: users_id
                }
            });

            if(!table){
                throw ApiError.NotFound(`Таблицы с идентификатором ${tables_id} не найдено`);
            }

            const resText = await db.DataTables.findOne(({
                where: {
                    id: data_id,
                    users_id: users_id
                }
            }));

            if (!resText) {
                throw ApiError.NotFound(`Видео с идентификатором ${data_id} не найдено`);
            }


            resText.data = data
            await resText.save({ transaction: t });

            await t.commit();

            return data;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async dataGet(requestBody) {
        try {
            const {
                data_id,
                tables_id,
            } = requestBody;

            const data = await db.DataTables.findOne(({
                where: {
                    id: data_id,
                    tables_id
                }
            }));

            return data;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    async dataGetAll(data) {
        try {
            const {
                tables_id
            } = data;

            const images = await db.DataTables.findAll(({
                where: {
                    tables_id: tables_id
                },
                order: [['created_at', 'DESC']]
            }));

            return images;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }
}

export default new TableDataService();