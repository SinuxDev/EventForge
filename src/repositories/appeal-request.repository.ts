import { BaseRepository } from './base.repository';
import { AppealRequest, IAppealRequest } from '../models/appeal-request.model';

class AppealRequestRepository extends BaseRepository<IAppealRequest> {
  constructor() {
    super(AppealRequest);
  }

  async findByReferenceCode(referenceCode: string) {
    return this.model.findOne({ referenceCode: referenceCode.toUpperCase() }).exec();
  }
}

export const appealRequestRepository = new AppealRequestRepository();
