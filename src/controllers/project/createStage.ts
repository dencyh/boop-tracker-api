import { Stage } from "./../../entity/Stage";
import { db } from "../../data-source";
import { Token } from "../../entity/Token";
import { User } from "../../entity/User";
import { ApiError } from "../../errros/ApiError";

export const createStage = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const {
      text,
      nextId,
      userId,
      projectId,
    }: {
      text: string;
      nextId: null | number;
      userId: number;
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

    const project = user.trackingProjects.find(
      (project) => project.id === Number(projectId)
    );

    if (!project) {
      throw ApiError.BadRequest("user do not have access to this project");
    }

    const stageRepo = db.getRepository(Stage);

    const nextStage = nextId
      ? await stageRepo.findOne({
          relations: { next: { next: true }, project: true },
          where: { id: nextId },
        })
      : null;

    const currentStage = db.manager.create(Stage, {
      text,
      project,
    });

    const allStages = await stageRepo.find({
      relations: {
        next: true,
        project: true,
      },
    });
    const prevLast = allStages.find(
      (prev) => prev.next === null && prev.project.id === projectId
    );

    const beforeNext = allStages.find(
      (before) => before.next?.id === nextId && before.project.id === projectId
    );

    // Save new latest
    await stageRepo.save(currentStage);

    if (beforeNext?.next) {
      beforeNext.next = currentStage;
      await stageRepo.save(beforeNext);
    }

    currentStage.next = nextStage;

    await stageRepo.save(currentStage);
    if (prevLast && !nextStage) {
      // Add new to previuous latest with next === null
      prevLast.next = currentStage;
      // Save old latest
      await stageRepo.save(prevLast);
    }

    console.log(nextStage?.id, "nextStage");
    console.log(prevLast?.id, "prevLast");
    console.log(currentStage?.id, "currentStage");
    console.log(beforeNext?.id, "beforeNext");
    console.log("#".repeat(40));

    // const prevStage = allStages.find((prev) => prev.next.id === nextId);

    res.json({ prevLast, currentStage, nextStage });
    // currentStage.next = nextStage;
    // await db.manager.save(currentStage);
    // const prevStages = await stageRepo.find({
    //   relations: {
    //     next: true,
    //   },
    // });
    // const prevStage = nextStage?.next?.id
    //   ? prevStages.find((stage) => stage.next?.id === nextId)
    //   : prevStages.find(
    //       (stage) => stage.next === null || stage.next?.id === nextId
    //     );

    // if (Boolean(prevStage?.id)) {
    //   prevStage.next = currentStage;
    //   await db.manager.save(prevStage);
    // }

    // currentStage.next = nextStage;
    // await db.manager.save(currentStage);
  } catch (e) {
    next(e);
  }
};
