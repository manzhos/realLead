import Project from '../models/appModels/Project.js'

class ProjectController { 
  async createProject(req, res){
    if(!req.body.name || !req.user.userId) return;
    // console.log('createProject:', req.body.name);
    // console.log('createProject:', req.user.userId);
    try{
      const project = new Project({ name: req.body.name, ownerId: req.user.userId })
      await project.save()
      // console.log('New project:', project)
      return res.status(201).json({ message: 'Project created', project: project })
    } catch(error){
      console.error('Error:', error)
      res.status(500).json({ message:'Something wrong...' })
    }    
  }

  async getProjects(req, res){
    // console.log('getProjects');
    if(!req.user.userId) return
    try{
      const projects = await Project.find({ ownerId: req.user.userId })
      // console.log('projects:', projects);
      return res.status(201).json({ message: 'Projects found', projects: projects })
    } catch(error){
      console.error('Error:', error)
      res.status(500).json({ message:'Something wrong...' })
    }    
  }

  async getProject(req, res){
    console.log('getProject');
  }

  async updateProject(req, res){
    // console.log('updateProject:', req.body.name);
    // console.log('id:', req.params.id);
    const id = req.params.id
    if(!req.body.name || !id) return;
    try{
      const project = await Project.findByIdAndUpdate(id, { name: req.body.name })
      // console.log('updated project:', project)
      return res.status(201).json({ message: 'Project updated', project: project })
    } catch(error){
      console.error('Error:', error)
      res.status(500).json({ message:'Something wrong...' })
    }    

  }

  async deleteProject(req, res){
    if(!req.user.userId) return;
    try{
      const id = req.params.id
      if(!id) return res.status(401).json({ message: 'Project ID not present' })
      const delProject = await Project.deleteOne({ _id: id })
      // console.log('deleted project:', delProject);
      return res.status(201).json({ message: 'Project deleted' })
    } catch(error){
      console.error('Error:', error)
      res.status(500).json({ message:'Something wrong...' })
    }
  }

}

export default new ProjectController()