/**
 * client controller
 */

import { factories } from "@strapi/strapi";
import client from "../routes/client";
// import client from "../routes/client";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::client.client", ({ strapi }) => ({
  async create(ctx: { request: { body: any }; body: any }) {
    const { data } = ctx.request.body;

    const adressData = data.adress_data;
    delete data.adress_data;

    // cria o cliente
    const client = await strapi.documents("api::client.client").create({
      data: {
        ...data,
      },
    });

    //  cliente ao usuário
    const createdUser = await strapi
      .documents("plugin::users-permissions.user")
      .create({
        data: {
          provider: "local",
          client: client.id,
          client_id: client.documentId,
          confirmed: true,
          blocked: false,
          username: client.social_name,
          password: data.password,
          email: client.email,
          role: {
            id: 5,
            name: "cliente",
          },
        },
      });

    // Associa o cliente ao usuario
    await strapi.documents("api::client.client").update({
      documentId: client.documentId,
      data: {
        ...client,
        user: createdUser.documentId,
      },
    });

    // Associa os endereços ao cliente e retorna os ids dos endereços
    const createdAddress = await Promise.all(
      adressData.map(async (adress: any) => {
        console.log("adress", adress);

        return strapi.documents("api::adress.adress").create({
          data: {
            ...adress,
            client_data: client.id,
          },
        });
      })
    );

    const getAddressDocumentId = createdAddress.map(
      (adress) => adress.documentId
    );

    // Atualiza o cliente com os enderecos
    await strapi.documents("api::client.client").update({
      documentId: client.documentId,
      data: {
        ...client,
        adress_data: getAddressDocumentId,
      },
    });

    // Retorna o cliente com os endereços relacionados
    const clientWithAddress = await strapi
      .documents("api::client.client")
      .findOne({
        documentId: client.documentId,
        populate: ["adress_data"],
      });

    ctx.body = clientWithAddress;
  },
}));

export default factories.createCoreController("api::client.client");
