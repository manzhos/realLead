import { Router } from 'express'
import ProjectController from '../controllers/project.controller.js'
import auth from'../middleware/auth.middleware.js'

const router = Router()

router.post(  '/project',     auth, ProjectController.createProject)
router.get(   '/project',     auth, ProjectController.getProjects)
router.get(   '/project/:id', auth, ProjectController.getProject)
router.patch( '/project/:id', auth, ProjectController.updateProject)
router.delete('/project/:id', auth, ProjectController.deleteProject)

export default router