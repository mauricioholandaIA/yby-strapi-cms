/**
 * cooperative controller
 */

import { factories } from "@strapi/strapi";
import { Console } from "console";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::cooperative.cooperative",
  ({ strapi }) => ({
    async create(ctx) {
      const { data } = ctx.request.body;

      // cria o cooperado
      const cooperative = await strapi
        .documents("api::cooperative.cooperative")
        .create({
          data: {
            ...data,
            status: "published",
          },
        });

      const createdUser = await strapi
        .documents("plugin::users-permissions.user")
        .create({
          data: {
            status: "published",
            cooperative: cooperative.id,
            confirmed: true,
            blocked: false,
            username: cooperative.cooperative_code_access,
            password: cooperative.cooperative_code_access,
            email: `${cooperative.cooperative_code_access}@coop.com`,
            role: {
              connect: [
                {
                  id: 2,
                  name: "Public",
                },
              ],
            },
          },
        });

      //atualiza o cooperado com o usuário
      await strapi.documents("api::cooperative.cooperative").update({
        documentId: cooperative.documentId,
        data: {
          ...cooperative,
          user: createdUser.documentId,
          status: "published",
        },
      });

      // retorna os dados do cooperado e do usuário

      const cooperativeWithUser = await strapi
        .documents("api::cooperative.cooperative")
        .findOne({
          documentId: cooperative.documentId,
          populate: ["user"],
        });

      ctx.body = cooperativeWithUser;
      return cooperativeWithUser;
    },
  })
);

export default factories.createCoreController("api::cooperative.cooperative");
// plugin::users-permissions.user
