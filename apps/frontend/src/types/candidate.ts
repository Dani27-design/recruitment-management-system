export interface Candidate {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
}

export interface CandidateFormInput {
  full_name: string;
  email: string;
  phone_number: string;
}

export interface CandidateListParams {
  search?: string;
}
