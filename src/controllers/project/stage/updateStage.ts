import { Stage } from "../../../entity/Stage";
import { db } from "../../../data-source";
import { Token } from "../../../entity/Token";
import { User } from "../../../entity/User";
import { ApiError } from "../../../errros/ApiError";

export const updateStage = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const { stageId } = req.params;
    console.log(typeof stageId);
    const {
      text,
      projectId,
    }: {
      text: string;
      projectId: number;
    } = req.body;

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
    });

    const haveEditAccess = user.trackingProjects.find(
      (project) => project.id === projectId
    );

    if (!haveEditAccess) {
      throw ApiError.BadRequest("user do not have access to this project");
    }

    currentStage.text = text;
    await stageRepo.save(currentStage);

    res.json({ currentStage });
  } catch (e) {
    next(e);
  }
};
