import { Project } from "./../../entity/Project";

import { db } from "./../../data-source";

export const getProjects = async (req, res, next) => {
  try {
    const projectRepo = db.getRepository(Project);
    const projects = await projectRepo.find({
      relations: {
        created_by: true,
      },
    });
    res.json(projects);
  } catch (err) {
    next(err);
  }
};
