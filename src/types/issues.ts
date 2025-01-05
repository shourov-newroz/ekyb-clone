export interface IIssue {
  trackingId: string;
  status: string;
  name: string;
  currentValue: string | null;
  reason: string;
  newValue: string;
  file: string | null;
  type: string;
  explanation: string;
  createdAt: string;
  responseAt: string;
}

export interface IIssueResponse {
  issues: {
    id: string;
    applicationId: string;
    approverId: string;
    approverEmail: string;
    status: string;
    applicationTracking: IIssue[];
    createdAt: string;
    updatedAt: string;
  };
}
