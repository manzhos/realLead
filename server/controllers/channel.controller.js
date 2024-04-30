import ShortUniqueId from 'short-unique-id'
import Channel from '../models/appModels/Channel.js'
import Project from '../models/appModels/Project.js'

class ChannelController { 
  async createChannel(req, res){
    console.log('createChannel:', req.body);
    let { channelId, name, projectId, linkFrom, linkTo} = req.body
    const { randomUUID } = new ShortUniqueId({ length: 10 })
    const uuid = randomUUID()
    if(!linkFrom) linkFrom = `${process.env.URL}/${uuid}`
    if(!channelId) channelId = Date.now()

    if(!name || !projectId) return;
    try{
      const channel = new Channel({ channelId: channelId, name: name, projectId: projectId,  linkFrom: linkFrom, linkTo: linkTo, uuid: uuid })
      await channel.save()
      console.log('New channel:', channel)
      return res.status(201).json({ message: 'Channel created', channel: channel })
    } catch(error){
      console.error('Error:', error)
      res.status(500).json({ message:'Something wrong...' })
    }    

  }

  async getChannels(req, res){
    // console.log('getChannels')
    const projectId = req.params.project_id
    if(!projectId) return
    try{
      const channels = await Channel.find({ projectId: projectId, removed: false })
      // console.log('channels:', channels);
      return res.status(201).json({ message: 'channels found', channels: channels })
    } catch(error){
      console.error('Error:', error)
      res.status(500).json({ message:'Something wrong...' })
    }     
  }

  async getChannel(req, res){
    // console.log('new click on the link >>> getChannel by UUID :::', req.params);
    const uuid =  req.params.uuid
    if(!uuid) return

    const channel = await Channel.findOne({ uuid: uuid })
    if(!channel) return res.json({'msg':'no channel yet'})
    // console.log('channel:', channel, '\n', channel.projectId.toHexString())
    // if(!channel.projectId.toHexString()) return
    // const project = await Project.findOne({ _id: channel.projectId.toHexString() })
    // if(!project.ownerId.toHexString()) return
    channel.click ? channel.click++ : channel.click = 1
    await channel.save()
    // console.log('channel.click:', channel.click)

    res.status(301).redirect(channel.linkTo)
  }

  async updateChannel(req, res){
    const {id} = req.params
    const {name, linkTo} = req.body
    // console.log('updateChannel:', id, name, linkTo);
    if(!id || !(name && linkTo)) return;
    try{
      const channel = await Channel.findByIdAndUpdate(id, { name: name, linkTo: linkTo })
      // console.log('updated project:', project)
      return res.status(201).json({ message: 'Channel updated', channel: channel })
    } catch(error){
      console.error('Error:', error)
      res.status(500).json({ message:'Something wrong...' })
    }
  }

  async deleteChannel(req, res){
    // console.log('deleteChannel:', req.params)
    const {id} = req.params
    if(!id) return

    try{
      const channel = await Channel.findByIdAndUpdate(id, { removed: true })
      // console.log('deleted Channel:', channel)
      return res.status(201).json({ message: 'Channel removed', channel: channel })
    } catch(error){
      console.error('Error:', error)
      res.status(500).json({ message:'Something wrong...' })
    }
  }

  async getTargetLink(req, res){
    // console.warn('new click on the link')
    const {user_id, project_id, channel_id} = req.query
    // console.log('params:', user_id, project_id, channel_id)
    if(!user_id || !project_id || !channel_id) return

    const channel = await Channel.findOne({ channelId: channel_id })
    // console.log('channel:', channel, '\n', channel.projectId.toHexString())
    if(channel.projectId.toHexString() !== project_id) return

    const project = await Project.findOne({ _id: project_id })
    // console.log('project:', project)
    if(project.ownerId.toHexString() !== user_id) return
    channel.click ? channel.click++ : channel.click = 1
    await channel.save()
    // console.log('channel.click:', channel.click)

    // res.status(301).redirect(channel.linkTo)
    res.redirect(301, channel.linkTo)
  }
}

export default new ChannelController()