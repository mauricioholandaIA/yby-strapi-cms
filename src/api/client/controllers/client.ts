/**
 * client controller
 */

import { factories } from "@strapi/strapi";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::client.client", ({ strapi }) => ({
  async create(ctx) {
    console.log(ctx.request.body.data);

    const { data } = ctx.request.body;

    const adressData = data.adress_data;
    delete data.adress_data;

    const client = await strapi.documents("api::client.client").create({
      data,
    });

    // Associa os endereços ao cliente e retorna os ids dos endereços
    const createdAddress = await Promise.all(
      adressData.map(async (adress: any) => {
        console.log(adress);

        return strapi.documents("api::adress.adress").create({
          data: {
            ...adress,
            client_data: client.id,
            status: "published",
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
        status: "published",
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
