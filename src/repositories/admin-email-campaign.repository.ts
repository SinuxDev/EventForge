import { BaseRepository } from './base.repository';
import { AdminEmailCampaign, IAdminEmailCampaign } from '../models/admin-email-campaign.model';

class AdminEmailCampaignRepository extends BaseRepository<IAdminEmailCampaign> {
  constructor() {
    super(AdminEmailCampaign);
  }

  async listWithPagination(page: number, limit: number) {
    return this.findWithPagination({}, page, limit, { createdAt: -1 });
  }
}

export const adminEmailCampaignRepository = new AdminEmailCampaignRepository();
