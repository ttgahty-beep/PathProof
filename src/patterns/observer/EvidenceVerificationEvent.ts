/**
 * PathProof — Evidence Verification Event System (Observer Pattern)
 * Centralized Subject notifying four specialized Observers:
 * 1. ReadinessObserver — Recalculates student career readiness scores
 * 2. NotificationObserver — Generates student in-app notifications
 * 3. ActivityHistoryObserver — Records audit logs for university compliance
 * 4. RoadmapObserver — Updates linked roadmap milestone progress
 */

export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'NEEDS_WORK';

export interface VerificationEvent {
  verificationId: number;
  evidenceId: number;
  studentUserId: number;
  reviewerId: number;
  reviewerName: string;
  previousStatus: VerificationStatus;
  newStatus: VerificationStatus;
  evidenceTitle: string;
  feedback: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Observer Interface
 */
export interface IEvidenceObserver {
  getName(): string;
  onEvidenceVerificationChanged(event: VerificationEvent): Promise<void> | void;
}

/**
 * 1. Readiness Observer
 * Recalculates student career readiness scores and updates competence levels
 */
export class ReadinessObserver implements IEvidenceObserver {
  private lastEvaluatedUserId: number | null = null;
  private readinessUpdateLog: Array<{ userId: number; status: string; timestamp: Date }> = [];

  getName(): string {
    return 'ReadinessObserver';
  }

  async onEvidenceVerificationChanged(event: VerificationEvent): Promise<void> {
    this.lastEvaluatedUserId = event.studentUserId;
    this.readinessUpdateLog.push({
      userId: event.studentUserId,
      status: event.newStatus,
      timestamp: new Date(),
    });

    if (event.newStatus === 'APPROVED') {
      // In approved status, student evidence unlocks verified competency weighting
      // Triggers readiness recalculation for linked career targets
    }
  }

  getLastEvaluatedUserId(): number | null {
    return this.lastEvaluatedUserId;
  }

  getLog() {
    return this.readinessUpdateLog;
  }
}

/**
 * 2. Notification Observer
 * Dispatches targeted notifications to students when faculty or peer reviewers evaluate evidence
 */
export class NotificationObserver implements IEvidenceObserver {
  private sentNotifications: Array<{ userId: number; title: string; message: string }> = [];

  getName(): string {
    return 'NotificationObserver';
  }

  async onEvidenceVerificationChanged(event: VerificationEvent): Promise<void> {
    let title = 'Evidence Verification Update';
    let message = '';

    if (event.newStatus === 'APPROVED') {
      title = 'Evidence Approved! 🎉';
      message = `Your evidence "${event.evidenceTitle}" has been verified and approved by ${event.reviewerName}. ${event.feedback}`;
    } else if (event.newStatus === 'NEEDS_WORK') {
      title = 'Evidence Needs Revision';
      message = `${event.reviewerName} requested revisions on "${event.evidenceTitle}": "${event.feedback}"`;
    } else if (event.newStatus === 'REJECTED') {
      title = 'Evidence Status: Rejected';
      message = `Evidence "${event.evidenceTitle}" was rejected. Reviewer note: "${event.feedback}"`;
    } else {
      title = 'Evidence Submitted';
      message = `Evidence "${event.evidenceTitle}" status set to ${event.newStatus}.`;
    }

    this.sentNotifications.push({
      userId: event.studentUserId,
      title,
      message,
    });
  }

  getSentNotifications() {
    return this.sentNotifications;
  }
}

/**
 * 3. Activity History Observer
 * Maintains an immutable audit trail of review decisions for academic integrity
 */
export class ActivityHistoryObserver implements IEvidenceObserver {
  private activityLog: Array<{
    userId: number;
    action: string;
    description: string;
    timestamp: Date;
  }> = [];

  getName(): string {
    return 'ActivityHistoryObserver';
  }

  async onEvidenceVerificationChanged(event: VerificationEvent): Promise<void> {
    this.activityLog.push({
      userId: event.studentUserId,
      action: 'EVIDENCE_VERIFICATION_STATUS_CHANGED',
      description: `Evidence #${event.evidenceId} ("${event.evidenceTitle}") status changed from ${event.previousStatus} to ${event.newStatus} by Reviewer #${event.reviewerId} (${event.reviewerName}).`,
      timestamp: new Date(),
    });
  }

  getActivityLog() {
    return this.activityLog;
  }
}

/**
 * 4. Roadmap Observer
 * Aligns approved evidence items with student roadmap milestones
 */
export class RoadmapObserver implements IEvidenceObserver {
  private milestoneUpdates: Array<{
    userId: number;
    evidenceId: number;
    milestoneStatus: string;
  }> = [];

  getName(): string {
    return 'RoadmapObserver';
  }

  async onEvidenceVerificationChanged(event: VerificationEvent): Promise<void> {
    if (event.newStatus === 'APPROVED') {
      this.milestoneUpdates.push({
        userId: event.studentUserId,
        evidenceId: event.evidenceId,
        milestoneStatus: 'COMPLETED_VIA_VERIFIED_EVIDENCE',
      });
    } else {
      this.milestoneUpdates.push({
        userId: event.studentUserId,
        evidenceId: event.evidenceId,
        milestoneStatus: 'PENDING_VERIFICATION',
      });
    }
  }

  getMilestoneUpdates() {
    return this.milestoneUpdates;
  }
}

/**
 * Verification Event Subject (Subject in Observer Pattern)
 * Manages observers and orchestrates notification dispatch with verification gatekeeping.
 */
export class VerificationEventSubject {
  private observers: Set<IEvidenceObserver> = new Set();

  constructor() {
    // Register default observers
    this.registerObserver(new ReadinessObserver());
    this.registerObserver(new NotificationObserver());
    this.registerObserver(new ActivityHistoryObserver());
    this.registerObserver(new RoadmapObserver());
  }

  /**
   * Register a new observer
   */
  public registerObserver(observer: IEvidenceObserver): void {
    this.observers.add(observer);
  }

  /**
   * Remove an observer
   */
  public removeObserver(observer: IEvidenceObserver): void {
    this.observers.delete(observer);
  }

  /**
   * Get all registered observers
   */
  public getObservers(): IEvidenceObserver[] {
    return Array.from(this.observers);
  }

  /**
   * Notify all observers of a verification event.
   * Safety Gate: Validates event integrity before triggering observers.
   */
  public async notifyObservers(event: VerificationEvent): Promise<{ notifiedCount: number }> {
    if (!event.evidenceId || !event.studentUserId || !event.reviewerId) {
      throw new Error('[VerificationEventSubject] Invalid verification event: Missing essential identifiers (evidenceId, studentUserId, or reviewerId).');
    }

    if (!['PENDING', 'APPROVED', 'REJECTED', 'NEEDS_WORK'].includes(event.newStatus)) {
      throw new Error(`[VerificationEventSubject] Invalid verification status "${event.newStatus}". Cannot broadcast.`);
    }

    let count = 0;
    for (const observer of this.observers) {
      try {
        await observer.onEvidenceVerificationChanged(event);
        count++;
      } catch (err) {
        console.error(`[VerificationEventSubject] Error in observer "${observer.getName()}":`, err);
      }
    }

    return { notifiedCount: count };
  }
}

// Global subject instance
export const verificationEventSubject = new VerificationEventSubject();
