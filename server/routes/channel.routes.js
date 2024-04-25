import { Router } from 'express'
import ChannelController from '../controllers/channel.controller.js'
import auth from'../middleware/auth.middleware.js'

const router = Router()

router.post(  '/channel',              auth, ChannelController.createChannel)
router.get(   '/channels/:project_id', auth, ChannelController.getChannels)
// router.get(   '/channel/:id',          auth, ChannelController.getChannel)
router.patch( '/channel/:id',          auth, ChannelController.updateChannel)
router.delete('/channel/:id',          auth, ChannelController.deleteChannel)

router.get('/:uuid', ChannelController.getChannel)
router.get('/getfrom', ChannelController.getTargetLink)

export default router