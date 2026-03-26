import { appealRequestRepository } from '../repositories/appeal-request.repository';

interface CreateAppealRequestPayload {
  fullName: string;
  workEmail: string;
  company: string;
  accountEmail: string;
  issueType:
    | 'account_suspension'
    | 'policy_warning'
    | 'payment_restriction'
    | 'content_violation'
    | 'other';
  timeline: string;
  whatHappened: string;
  correctiveActions: string;
  evidenceLinks?: string[];
  consent: boolean;
  source?: 'public-website' | 'authenticated-website';
}

class AppealRequestService {
  private generateReferenceCode(): string {
    const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `APR-${Date.now().toString(36).toUpperCase()}-${randomPart}`;
  }

  async create(payload: CreateAppealRequestPayload) {
    let referenceCode = this.generateReferenceCode();

    // Extremely low collision risk, still guarded.
    while (await appealRequestRepository.findByReferenceCode(referenceCode)) {
      referenceCode = this.generateReferenceCode();
    }

    return appealRequestRepository.create({
      ...payload,
      referenceCode,
      status: 'submitted',
      source: payload.source || 'public-website',
      evidenceLinks: payload.evidenceLinks || [],
    });
  }
}

export const appealRequestService = new AppealRequestService();
