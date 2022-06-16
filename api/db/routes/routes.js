const express = require('express');
const publicationRoutes = require('./publication-routes.js');
const userRoutes = require('./user-routes.js');
const roleRoutes = require('./role-routes.js');
const publicationTypeRoutes = require('./publication-type-routes.js');
const publicationStateRoutes = require('./publication-state-routes.js');
const publicationCommentsRoutes = require('./publication-comment-routes.js');
const publicationRouteRoutes = require('./publication-route-routes.js');
const authRoutes = require('./auth-routes.js');
const termsRoutes = require('./term-routes.js');
const passport = require('passport');

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

module.exports = routes;
