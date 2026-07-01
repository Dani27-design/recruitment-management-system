import type { RecruitmentStageName } from '@prisma/client';
import {
  RecruitmentStageRepository,
  type RecruitmentStageWithAssignee,
} from '../repositories/recruitment-stage.repository';
import { RecruitmentRepository } from '../repositories/recruitment.repository';
import { AppError } from '../utils/app-error';
import type { RecruitmentStageStatusUpdateInput } from '../validations/recruitment-stage.validation';

const WORKFLOW_STAGES: RecruitmentStageName[] = [
  'APPLIED',
  'SCREENING',
  'TECHNICAL_TEST',
  'INTERVIEW',
  'ACCEPTANCE',
];

export class RecruitmentStageService {
  constructor(
    private readonly recruitmentStageRepository = new RecruitmentStageRepository(),
    private readonly recruitmentRepository = new RecruitmentRepository(),
  ) {}

  async listByRecruitmentId(
    recruitmentId: string,
  ): Promise<RecruitmentStageWithAssignee[]> {
    const recruitment = await this.recruitmentRepository.findById(recruitmentId);

    if (!recruitment) {
      throw new AppError('Recruitment not found', 404);
    }

    const stages = await this.recruitmentStageRepository.listByRecruitmentId(recruitmentId);

    return this.sortByWorkflow(stages);
  }

  async updateStatus(
    stageId: string,
    input: RecruitmentStageStatusUpdateInput,
  ): Promise<RecruitmentStageWithAssignee> {
    const stage = await this.recruitmentStageRepository.findById(stageId);

    if (!stage) {
      throw new AppError('Recruitment stage not found', 404);
    }

    const stages = await this.recruitmentStageRepository.listByRecruitmentId(stage.recruitment_id);
    const sortedStages = this.sortByWorkflow(stages);

    this.ensureStageIsActive(stage, sortedStages);
    this.ensureRejectedWorkflowCanNotContinue(stage, sortedStages);

    if (!input.status) {
      return this.recruitmentStageRepository.update(stage.id, {
        notes: input.notes,
      });
    }

    this.ensurePreviousStagesPassed(stage, sortedStages);

    const completedAt = new Date();
    const updateData = {
      status: input.status,
      completed_at: completedAt,
      ...(input.notes === undefined ? {} : { notes: input.notes }),
    };

    if (input.status === 'REJECTED') {
      return this.recruitmentStageRepository.completeStage(stage.id, updateData);
    }

    this.ensureFutureStagesDoNotExist(stage, sortedStages);

    const nextStageName = this.getNextStage(stage.stage);

    return this.recruitmentStageRepository.completeStage(
      stage.id,
      updateData,
      nextStageName
        ? {
            recruitment_id: stage.recruitment_id,
            stage: nextStageName,
            status: 'PENDING',
          }
        : undefined,
    );
  }

  private sortByWorkflow(
    stages: RecruitmentStageWithAssignee[],
  ): RecruitmentStageWithAssignee[] {
    return [...stages].sort(
      (left, right) => this.getStageIndex(left.stage) - this.getStageIndex(right.stage),
    );
  }

  private ensureStageIsActive(
    stage: RecruitmentStageWithAssignee,
    stages: RecruitmentStageWithAssignee[],
  ) {
    if (stage.status !== 'PENDING' || stage.completed_at) {
      throw new AppError('Completed stages cannot be modified', 400);
    }

    const pendingStages = stages.filter((currentStage) => currentStage.status === 'PENDING');

    if (pendingStages.length !== 1 || pendingStages[0]?.id !== stage.id) {
      throw new AppError('Only one active stage is allowed', 400);
    }
  }

  private ensureRejectedWorkflowCanNotContinue(
    stage: RecruitmentStageWithAssignee,
    stages: RecruitmentStageWithAssignee[],
  ) {
    const rejectedStage = stages.find(
      (currentStage) => currentStage.status === 'REJECTED' && currentStage.id !== stage.id,
    );

    if (rejectedStage) {
      throw new AppError('Rejected recruitment workflow cannot be modified', 400);
    }
  }

  private ensurePreviousStagesPassed(
    stage: RecruitmentStageWithAssignee,
    stages: RecruitmentStageWithAssignee[],
  ) {
    const currentIndex = this.getStageIndex(stage.stage);

    for (const requiredStageName of WORKFLOW_STAGES.slice(0, currentIndex)) {
      const previousStage = stages.find(
        (currentStage) => currentStage.stage === requiredStageName,
      );

      if (!previousStage || previousStage.status !== 'PASSED') {
        throw new AppError('Previous stages must be passed before continuing', 400);
      }
    }
  }

  private ensureFutureStagesDoNotExist(
    stage: RecruitmentStageWithAssignee,
    stages: RecruitmentStageWithAssignee[],
  ) {
    const currentIndex = this.getStageIndex(stage.stage);
    const futureStage = stages.find(
      (currentStage) => this.getStageIndex(currentStage.stage) > currentIndex,
    );

    if (futureStage) {
      throw new AppError('Workflow stages cannot be skipped or reordered', 400);
    }
  }

  private getNextStage(stage: RecruitmentStageName): RecruitmentStageName | undefined {
    const nextStage = WORKFLOW_STAGES[this.getStageIndex(stage) + 1];

    return nextStage;
  }

  private getStageIndex(stage: RecruitmentStageName) {
    const index = WORKFLOW_STAGES.indexOf(stage);

    if (index === -1) {
      throw new AppError('Unknown recruitment stage', 400);
    }

    return index;
  }
}
