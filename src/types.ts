export interface Article {
  id?: number;
  title: string;
  description?: string;
  published?: Boolean;
  body_markdown?: string;
  cover_image?: string;
  tags?: string[];
  canonical_url?: string;
  series?: string;
}

export interface DevtoError {
  error: string;
  status: number;
}

export interface LocalArticle {
  body_markdown: string;
}
