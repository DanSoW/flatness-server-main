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

class UserService {
    async doorGetAll(data) {
        try {
            const {
                count, limit,
                filter_by_min_price,
                filter_by_max_price,
                all_sizes,
                size780on2000,
                size800on2030,
                size860on2050,
                size900on2050,
                size960on2070,
                size980on2080,
                size1050on2070,
                for_apartment,
                for_home,
                left_opening,
                right_opening,
                mirror,
                without_defect,
                outdated_model,
                showcase_sample,
            } = data;

            let sum = count + limit;

            let doors = await db.Doors.findAll({
                include: {
                    model: db.Articles,
                    include: {
                        model: db.ArticlesImages
                    }
                },
                order: [['updated_at', 'DESC']]
            });

            for (let i = 0; i < doors.length; i++) {
                doors[i].image_entry = `${config.get("url.api")}/${doors[i].image_entry}`;
                doors[i].image_exit = `${config.get("url.api")}/${doors[i].image_exit}`;

                for (let j = 0; j < doors[i].articles.length; j++) {
                    doors[i].articles[j].dataValues.images = [];
                    for (let k = 0; k < doors[i].articles[j].articles_images.length; k++) {
                        doors[i].articles[j].dataValues.images.push({
                            url: `${config.get("url.api")}/${doors[i].articles[j].articles_images[k].filepath}`
                        });
                    }
                }
            }

            /*doors = doors.filter((item) => {
                const articles = item.filter((item) => {
                    let size = all_sizes;
                    const width = Number(item.dataValues.width);
                    const height = Number(item.dataValues.height);
                    if(!size){
                        const arrBool = [false];
                    }
                });

                return articles.length > 0
            });*/

            // Фильтрация по размерам
            if (!all_sizes) {
                const exps = [];

                if (size1050on2070) {
                    exps.push({
                        width: 1050,
                        height: 2070
                    });
                }

                if (size980on2080) {
                    exps.push({
                        width: 980,
                        height: 2080
                    });
                }

                if (size960on2070) {
                    exps.push({
                        width: 960,
                        height: 2070
                    });
                }

                if (size900on2050) {
                    exps.push({
                        width: 900,
                        height: 2050
                    });
                }

                if (size860on2050) {
                    exps.push({
                        width: 860,
                        height: 2050
                    });
                }

                if (size800on2030) {
                    exps.push({
                        width: 800,
                        height: 2030
                    });
                }

                if (size780on2000) {
                    exps.push({
                        width: 780,
                        height: 2000
                    });
                }

                if (exps.length > 0) {
                    for (let i = 0; i < doors.length; i++) {
                        doors[i].dataValues.articles = doors[i].dataValues.articles.filter((item) => {
                            let flag = false;
                            for (let j = 0; (j < exps.length) && !flag; j++) {
                                if ((item.dataValues.width === exps[j].width)
                                    && (item.dataValues.height === exps[j].height)) {
                                    flag = true;
                                }
                            }

                            return flag;
                        });
                    }

                    doors = doors.filter((item) => item.dataValues.articles.length > 0);
                }
            }

            // Фильтрация по назначению
            if (for_apartment || for_home) {
                const exps = [];
                if (for_apartment) {
                    exps.push("Квартирная");
                }

                if (for_home) {
                    exps.push("Для дома и дачи");
                }

                for (let i = 0; i < doors.length; i++) {
                    doors[i].dataValues.articles = doors[i].dataValues.articles.filter((item) => {
                        let flag = false;
                        for (let j = 0; (j < exps.length) && !flag; j++) {
                            if (item.dataValues.target === exps[j]) {
                                flag = true;
                            }
                        }

                        return flag;
                    });
                }

                doors = doors.filter((item) => item.dataValues.articles.length > 0);
            }

            // Фильтрация по левому / правому открыванию
            if (left_opening || right_opening) {
                const exps = [];
                if (left_opening) {
                    exps.push("Левое открывание");
                }

                if (right_opening) {
                    exps.push("Правое открывание");
                }

                for (let i = 0; i < doors.length; i++) {
                    doors[i].dataValues.articles = doors[i].dataValues.articles.filter((item) => {
                        let flag = false;
                        for (let j = 0; (j < exps.length) && !flag; j++) {
                            if ((exps[j] === "Левое открывание") && (!item.dataValues.opening_direction)) {
                                flag = true;
                            } else if ((exps[j] === "Правое открывание") && item.dataValues.opening_direction) {
                                flag = true;
                            }
                        }

                        return flag;
                    });
                }

                doors = doors.filter((item) => item.dataValues.articles.length > 0);
            }

            // Фильтрация по окну
            if (mirror) {
                for (let i = 0; i < doors.length; i++) {
                    doors[i].dataValues.articles = doors[i].dataValues.articles.filter((item) => {
                        return item.dataValues.mirror === true;
                    });
                }

                doors = doors.filter((item) => item.dataValues.articles.length > 0);
            }

            // Фильтрация по особенностям
            if (outdated_model || showcase_sample) {
                const exps = [];
                if (outdated_model) {
                    exps.push("Устаревшая модель");
                }

                if (showcase_sample) {
                    exps.push("Витринный образец");
                }

                for (let i = 0; i < doors.length; i++) {
                    doors[i].dataValues.articles = doors[i].dataValues.articles.filter((item) => {
                        let flag = false;
                        for (let j = 0; (j < exps.length) && !flag; j++) {
                            if (item.dataValues.additional_features === exps[j]) {
                                flag = true;
                            }
                        }

                        return flag;
                    });
                }

                doors = doors.filter((item) => item.dataValues.articles.length > 0);
            }

            // Фильтрация по дефекту
            if (without_defect) {
                for (let i = 0; i < doors.length; i++) {
                    doors[i].dataValues.articles = doors[i].dataValues.articles.filter((item) => {
                        return item.dataValues.is_defect === false;
                    });
                }

                doors = doors.filter((item) => item.dataValues.articles.length > 0);
            }

            // Фильтрация по цене (по убыванию цены)
            if ((filter_by_min_price !== null) && filter_by_min_price) {
                // В doors хранятся валидные данные обо всех дверях в системе
                // 1 Этап: выявление минимальных значений в наборах данных в рамках всех артиклей

                for (let i = 0; i < doors.length; i++) {
                    let minArticle = doors[i].dataValues.articles[0].dataValues.price;
                    for (let j = 1; j < doors[i].dataValues.articles.length; j++) {
                        if (minArticle >= doors[i].dataValues.articles[j].dataValues.price) {
                            minArticle = doors[i].dataValues.articles[j].dataValues.price;
                        }
                    }

                    // Получаем от каждой двери значения минимального артикля
                    doors[i].dataValues.min_article = minArticle;
                }

                // Таким образом, сейчас у нас есть минимальные значения цены в артиклях
                // 2 Этап: сортировка дверей по определённым минимальным значениям артиклей
                // Фильтруем сначала артикли
                for (let i = 0; i < doors.length; i++) {
                    doors[i].dataValues.articles.sort(function (a, b) {
                        if (a.dataValues.price > b.dataValues.price) {
                            return 1;
                        }
                        if (a.dataValues.price < b.dataValues.price) {
                            return -1;
                        }

                        return 0;
                    });
                }

                // А затем двери
                doors.sort(function (a, b) {
                    if (a.dataValues.min_article > b.dataValues.min_article) {
                        return 1;
                    }
                    if (a.dataValues.min_article < b.dataValues.min_article) {
                        return -1;
                    }

                    return 0;
                });
            }

            // Фильтрация по цене (по возрастанию цены)
            if ((filter_by_max_price !== null) && filter_by_max_price) {
                // В doors хранятся валидные данные обо всех дверях в системе
                // 1 Этап: выявление минимальных значений в наборах данных в рамках всех артиклей

                for (let i = 0; i < doors.length; i++) {
                    let maxArticle = doors[i].dataValues.articles[0].dataValues.price;
                    for (let j = 1; j < doors[i].dataValues.articles.length; j++) {
                        if (maxArticle <= doors[i].dataValues.articles[j].dataValues.price) {
                            maxArticle = doors[i].dataValues.articles[j].dataValues.price;
                        }
                    }

                    // Получаем от каждой двери значения минимального артикля
                    doors[i].dataValues.max_article = maxArticle;
                }

                // Таким образом, сейчас у нас есть минимальные значения цены в артиклях
                // 2 Этап: сортировка дверей по определённым минимальным значениям артиклей
                for (let i = 0; i < doors.length; i++) {
                    doors[i].dataValues.articles.sort(function (a, b) {
                        if (a.dataValues.price < b.dataValues.price) {
                            return 1;
                        }
                        if (a.dataValues.price > b.dataValues.price) {
                            return -1;
                        }

                        return 0;
                    });
                }

                doors.sort(function (a, b) {
                    if (a.dataValues.max_article < b.dataValues.max_article) {
                        return 1;
                    }
                    if (a.dataValues.max_article > b.dataValues.max_article) {
                        return -1;
                    }

                    return 0;
                });
            }

            if (count >= doors.length) {
                return [];
            }

            if (sum >= doors.length) {
                sum -= (sum - doors.length);
            }

            return {
                doors: doors.filter((item) => item.dataValues.articles.length > 0).slice(count, sum),
                count: (sum - count)
            };
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    async doorGetByMinPrice(data) {
        try {
            const { count, limit } = data;
            let sum = count + limit;
            const doors = await db.Doors.findAll({
                include: {
                    model: db.Articles,
                    include: {
                        model: db.ArticlesImages
                    }
                }
            });

            for (let i = 0; i < doors.length; i++) {
                doors[i].image_entry = `${config.get("url.api")}/${doors[i].image_entry}`;
                doors[i].image_exit = `${config.get("url.api")}/${doors[i].image_exit}`;

                for (let j = 0; j < doors[i].articles.length; j++) {
                    doors[i].articles[j].dataValues.images = [];
                    for (let k = 0; k < doors[i].articles[j].articles_images.length; k++) {
                        doors[i].articles[j].dataValues.images.push({
                            url: `${config.get("url.api")}/${doors[i].articles[j].articles_images[k].filepath}`
                        });
                    }
                }
            }

            // В doors хранятся валидные данные обо всех дверях в системе
            // 1 Этап: выявление минимальных значений в наборах данных в рамках всех артиклей

            for (let i = 0; i < doors.length; i++) {
                let minArticle = Number(doors[i].articles[0].price);
                for (let j = 1; j < doors[i].articles.length; j++) {
                    if (minArticle >= Number(doors[i].articles[j].price)) {
                        minArticle = Number(doors[i].articles[j].price);
                    }
                }

                // Получаем от каждой двери значения минимального артикля
                doors[i].min_article = minArticle;
            }

            // Таким образом, сейчас у нас есть минимальные значения цены в артиклях
            // 2 Этап: сортировка дверей по определённым минимальным значениям артиклей
            doors.sort(function (a, b) {
                if (a.min_article > b.min_article) {
                    return 1;
                }
                if (a.min_article < b.min_article) {
                    return -1;
                }

                return 0;
            });

            if (count >= doors.length) {
                return [];
            }

            if (sum >= doors.length) {
                sum -= (sum - doors.length);
            }

            return {
                doors: doors.filter((item) => item.articles.length > 0).slice(count, sum),
                count: (sum - count)
            };
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    async mailerCommonSend(data) {
        try {
            const { name, email, phone } = data;

            // Отправка уведомления администраторам системы
            const admins = config.get("admin_list");
            for (let i = 0; i < admins.length; i++) {
                const adminEmail = admins[i].email;
                await mailService.sendMail(
                    adminEmail,
                    "Отправка пользователем формы для обратной связи",
                    MailerForms.commonToAdmin(name, email, phone)
                );
            }

            // Отправка уведомления пользователю
            await mailService.sendMail(
                email,
                "Успешная отправка формы обратной связи",
                MailerForms.commonToUser(name)
            );

        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    async mailerOrderSend(data) {
        try {
            const { name, email, phone, door_title, article_title } = data;

            // Отправка уведомления администраторам системы
            const admins = config.get("admin_list");
            for (let i = 0; i < admins.length; i++) {
                const adminEmail = admins[i].email;
                await mailService.sendMail(
                    adminEmail,
                    "Отправка пользователем формы для обратной связи",
                    MailerForms.orderToAdmin(name, email, phone, door_title, article_title)
                );
            }

            // Отправка уведомления пользователю
            await mailService.sendMail(
                email,
                "Успешная отправка формы обратной связи",
                MailerForms.orderToUser(name, door_title, article_title)
            );

        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    async mailerOrderSend(data) {
        try {
            const { name, email, phone, door_title, article_title } = data;

            // Отправка уведомления администраторам системы
            const admins = config.get("admin_list");
            for (let i = 0; i < admins.length; i++) {
                const adminEmail = admins[i].email;
                await mailService.sendMail(
                    adminEmail,
                    "Отправка пользователем формы для обратной связи",
                    MailerForms.orderToAdmin(name, email, phone, door_title, article_title)
                );
            }

            // Отправка уведомления пользователю
            await mailService.sendMail(
                email,
                "Успешная отправка формы обратной связи",
                MailerForms.orderToUser(name, door_title, article_title)
            );

        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    async getFilterInfo(data) {
        try {
            const filterInfo = await db.FilterInfo.findOne();
            if (!filterInfo) {
                return {
                    url: `${config.get("url.api")}/${config.get("filter_image.url")}`
                }
            }

            const url = `${config.get("url.api")}/${filterInfo.filepath}`;

            return {
                url: url
            };
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }
}

export default new UserService();