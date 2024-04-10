import Channel from '../models/appModels/Channel.js'
import Project from '../models/appModels/Project.js'

class ChannelController { 
  async createChannel(req, res){
    console.log('createChannel:', req.body);
    const { channelId, name, projectId, linkFrom, linkTo} = req.body
    if(!req.body || !channelId || !name || !projectId) return;
    try{
      const channel = new Channel({ channelId: channelId, name: name, projectId: projectId,  linkFrom: linkFrom, linkTo: linkTo})
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
      const channels = await Channel.find({ projectId: projectId })
      // console.log('channels:', channels);
      return res.status(201).json({ message: 'channels found', channels: channels })
    } catch(error){
      console.error('Error:', error)
      res.status(500).json({ message:'Something wrong...' })
    }     
  }

  async getChannel(req, res){
    console.log('getChannel');
  }

  async updateChannel(req, res){
    console.log('updateChannel');
  }

  async deleteChannel(req, res){
    console.log('deleteChannel');
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

    res.redirect(channel.linkTo)
  }
}

export default new ChannelController()