/**
 * cooperative controller
 */

import { factories } from "@strapi/strapi";
import cooperative from "../routes/cooperative";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::cooperative.cooperative",
  ({ strapi }) => ({
    async create(ctx) {
      const { data } = ctx.request.body;

      console.log(data);
      // cria o cooperado
      const cooperative = await strapi
        .documents("api::cooperative.cooperative")
        .create({
          data: {
            ...data,
          },
        });

      const createdUser = await strapi
        .documents("plugin::users-permissions.user")
        .create({
          data: {
            provider: "local",
            cooperative: cooperative.id,
            cooperative_id: cooperative.documentId,
            confirmed: true,
            blocked: false,
            username: data.cooperative_code_access,
            password: data.cooperative_code_access,
            email: `${cooperative.cooperative_code_access}@coop.com`,
            role: {
              id: 4,
              name: "cooperativa",
            },
          },
        });

      //atualiza o cooperado com o usuário
      await strapi.documents("api::cooperative.cooperative").update({
        documentId: cooperative.documentId,
        data: {
          ...cooperative,
          user: createdUser.documentId,
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
