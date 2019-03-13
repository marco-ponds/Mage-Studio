const Config = require('../config');
const ProjectHelper = require('../helpers/ProjectHelper');
const SceneHelper = require('../helpers/SceneHelper');
const messages = require('../messages');
const path = require('path');
const electron = require('../electron');

class ProjectController {

    static getAllProjects(req, res) {
        // here we get the list of projects
        // return all projects listed inside workspace
        return res.json({message: 'OK', isDesktop: electron.isDesktop()});
    }

    static getProject(req, res) {
        // the project we want is in req.project

        // if electron get project config from withing the project itself
        // return config as json

        return res.json({ message: 'OK' });
    }

    static deleteProject(req, res) {
        // removing the project inside req.project
        return res
            .status(204)
            .json({message: 'OK'});
    }

    static createNewProject(req, res) {
        // we need project Name
        const projectName = req.body.project;
        const sceneName = req.body.scene;

        if (!sceneName || typeof sceneName !== 'string') {
            return res
                .status(messages.SCENE_NAME_MISSING.code)
                .json({ message: messages.SCENE_NAME_MISSING.text });
        }

        if (!projectName || typeof projectName !== 'string') {
            return res
                .status(messages.PROJECT_NAME_MISSING.code)
                .json({ message: messages.PROJECT_NAME_MISSING.text });
        }

        if (electron.isDesktop()) {
            // copy template folder to project folder
            const localconfig = Config.getLocalConfig();
            if (!localconfig) {
                return res
                    .status(messages.CONFIG_MISSING.code)
                    .json({ message: messages.CONFIG_MISSING.text });
            } else {
                const destination = Config.getProjectPath(projectName);

                req.setTimeout(60 * 4 * 1000);

                ProjectHelper.create(destination)
                    .then(() => SceneHelper.create(destination, sceneName))
                    .then(() => ProjectHelper.installDependencies(projectName))
                    .then(function() {
                        return res
                            .status(messages.PROJECT_CREATED.code)
                            .json({ message: messages.PROJECT_CREATED.text });
                    })
                    .catch(function() {
                        return res
                            .status(messages.PROJECT_NOT_CREATED.code)
                            .json({ message: messages.PROJECT_NOT_CREATED.text });
                    })
            }
        }
        // use api to create projects ( sync desktop with be )
        // when is done update config
        Config.updateLocalConfig({ project: projectName, scene: sceneName });
    }
}

module.exports = ProjectController;