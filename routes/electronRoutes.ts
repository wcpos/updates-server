import { Elysia, t } from 'elysia';
import { electronController } from '../controllers/electronController';

export const electronRoutes = (app) => {
  app.get('/electron/:platform/:version', 
    async ({ params }) => {
      return await electronController.getLatest(params.platform, params.version, '');
    },
    {
      params: t.Object({
        platform: t.String(),
        version: t.String(),
        // channel: t.Union([t.String(), t.Undefined()]), 
      }),
    }
  );
};
