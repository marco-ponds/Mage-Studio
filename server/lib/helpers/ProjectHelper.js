const ProjectServer = require('./ProjectServer');
const ncp = require('ncp').ncp;
const path = require('path');
const fs = require('fs');
const Config = require('../config');
const NpmHelper = require( './NpmHelper');
const StringTemplates = require('./StringTemplates');

const PROJECT_TEMPLATE_PATH = 'server/templates/project';

class ProjectHelper {

    static create(destination) {
        return new Promise(function(resolve, reject) {
            const source = path.resolve(PROJECT_TEMPLATE_PATH);

            ncp(source, destination, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    static installDependencies(project) {
        return new Promise((resolve, reject) => {
            ProjectHelper
                .exists(project)
                .then(projectPath => {
                    NpmHelper
                        .extract(projectPath)
                        .then(resolve);
                })
                .catch(reject);
        });
    }

    static runProject(project) {
        return new Promise((resolve, reject) => {
            ProjectHelper
                .exists(project)
                .then(NpmHelper.build)
                .then(ProjectServer.start)
                .then(resolve)
                .catch(reject);
        });
    }

    static stopProject(project) {
        return new Promise((resolve, reject) => {
            ProjectHelper
                .exists(project)
                .then(ProjectServer.stop)
                .then(resolve)
                .catch(reject);
        })
    }

    static updateIndexFile() {
        StringTemplates
            .buildInitScript()
            .then(data => {
                // write script in index file inside src
                const filename = 'index.js';

                const indexPath = path.join(
                    Config.getSrcRoot(),
                    filename
                );

                try {
                    fs.writeFileSync(indexPath, data);
                    return Promise.resolve();
                } catch(e) {
                    return Promise.reject(e);
                }
            });
    }

    static exists(project) {
        return new Promise((resolve, reject) => {
            const projectPath = Config.getProjectPath(project);
            fs.access(projectPath, fs.constants.F_OK, (err) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(projectPath);
                }
            });
        });
    }
}

module.exports = ProjectHelper;
