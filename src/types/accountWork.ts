export enum WorkInitiator {
  Worker = 'Worker',
  Employer = 'Employer',
}

export const workInitiators: WorkInitiator[] = [
  WorkInitiator.Employer,
  WorkInitiator.Worker,
];

export const defaultWorkInitiator = WorkInitiator.Employer;

export enum WorkStatus {
  Proposed = 'Proposed',
  Rejected = 'Rejected',
  Approved = 'Approved',
  Performed = 'Performed',
  Cancelled = 'Cancelled',
}

export const workStatuses: WorkStatus[] = [
  WorkStatus.Approved,
  WorkStatus.Cancelled,
  WorkStatus.Performed,
  WorkStatus.Rejected,
  WorkStatus.Proposed,
];

export const defaultWorkStatus = WorkStatus.Proposed;
