export interface RednoteResponse {
  status: string;
  code: string;
  msg: string;
  info: string;
  data: {
    title: string;
    url: string;
    videourl: string;
    cover: string;
    coverurl: string;
    images: string[];
    pics: string[];
    time: string;
    ip: string;
    download_image: string;
    down: string;
    realurl: string;
    type: string;
    mp3: string;
    bigFile: boolean;
    t: number;
  };
} 