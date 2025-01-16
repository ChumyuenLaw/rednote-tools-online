export interface RednoteData {
  title: string;
  videoUrl?: string;
  coverUrl?: string;
  images?: string[];
}

export interface RednoteResponse {
  status: string;
  message: string;
  data: RednoteData;
} 