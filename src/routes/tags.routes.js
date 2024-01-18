const { Router } = require('express');

const TagsController = require('../controllers/TagsController');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

const tagsRoutes = Router();

function myMiddleware(req, res, next) {
  console.log('Você passou pelo middleware');

  next();
}



const tagsController = new TagsController();

tagsRoutes.get('/', ensureAuthenticated, tagsController.index);

module.exports = tagsRoutes;