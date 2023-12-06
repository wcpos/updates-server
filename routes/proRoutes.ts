import { Elysia, t } from 'elysia';
import { proController } from '../controllers/proController';

export const proRoutes = (app) => {
  app.get('/pro/update/:version', 
    async ({ params }) => {
      return await proController.getUpdateDetails(params.version);
    },
    {
      params: t.Object({
        version: t.String(),
      }),
    }
  );

  app.post('/pro/license/status', 
    async ({ body }) => {
      return await proController.getLicenseStatus(body.key, body.instance);
    },
    {
      body: t.Object({
        key: t.String(),
        instance: t.String(),
      }),
    }
  );

  app.post('/pro/license/activate', 
    async ({ body }) => {
      return await proController.activateLicense(body.key, body.instance);
    },
    {
      body: t.Object({
        key: t.String(),
        instance: t.String(),
      }),
    }
  );

  app.post('/pro/license/deactivate', 
    async ({ body }) => {
      return await proController.deactivateLicense(body.key, body.instance);
    },
    {
      body: t.Object({
        key: t.String(),
        instance: t.String(),
      }),
    }
  );

  app.get('/pro/download/:version', 
    async ({ params, query }) => {
      return await proController.downloadProPlugin(params.version, query.key, query.instance);
    },
    {
      params: t.Object({
        version: t.String(),
      }),
      query: t.Object({
        key: t.String(),
        instance: t.String(),
      }),
    }
  );
};
