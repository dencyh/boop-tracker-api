import { Stage } from "../../entity/Stage";
import { db } from "../../data-source";
import { Token } from "../../entity/Token";
import { User } from "../../entity/User";
import { ApiError } from "../../errros/ApiError";

export const deleteStage = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const { stageId } = req.params;

    const tokenRepo = db.getRepository(Token);
    const token = await tokenRepo.findOne({
      where: { refreshToken },
      relations: {
        user: {
          trackingProjects: true,
        },
      },
    });
    const user = token.user;

    const stageRepo = db.getRepository(Stage);
    const currentStage = await stageRepo.findOne({
      where: {
        id: Number(stageId),
      },
      relations: {
        project: true,
        next: true,
      },
    });

    const haveEditAccess = user.trackingProjects.find(
      (project) => project.id === currentStage.project.id
    );

    if (!haveEditAccess) {
      throw ApiError.BadRequest("user do not have access to this project");
    }

    const nextStage = currentStage.next || null;

    // Reset current
    currentStage.next = null;
    await stageRepo.save(currentStage);

    const allStages = await stageRepo.find({
      relations: {
        next: true,
        project: true,
      },
    });

    const beforeCurrent =
      allStages.find(
        (before) =>
          before.next?.id === currentStage.id &&
          before.project.id === currentStage.project.id
      ) || null;

    if (beforeCurrent) {
      beforeCurrent.next = nextStage;
      await stageRepo.save(beforeCurrent);
    }

    await stageRepo.delete(Number(stageId));

    res.json({ beforeCurrent });
  } catch (e) {
    next(e);
  }
};
