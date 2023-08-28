import express from 'express';
import publicationRoutes from './publications.routes.js';
import userRoutes from './users.routes.js';
import roleRoutes from './roles.routes.js';
import publicationTypeRoutes from './publications-types.routes.js';
import publicationStateRoutes from './publications-states.routes.js';
import publicationCommentsRoutes from './publications-comments.routes.js';
import publicationRouteRoutes from './publications-routes.routes.js';
import authRoutes from './auth.routes.js';
import termsRoutes from './terms.routes.js';
import passport from 'passport';

const routes = express();
const authenticate = passport.authenticate('jwt', { session: false });

routes.use('/publications', publicationRoutes);
routes.use('/users', authenticate, userRoutes);
routes.use('/roles', authenticate, roleRoutes);
routes.use('/publications-types', authenticate, publicationTypeRoutes);
routes.use('/publications-states', authenticate, publicationStateRoutes);
routes.use('/publications-comments', authenticate, publicationCommentsRoutes);
routes.use('/publications-routes', authenticate, publicationRouteRoutes);
routes.use('/terms', authenticate, termsRoutes);
routes.use('/auth', authRoutes);

export default routes;
