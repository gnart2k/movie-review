type AuthorDetails = {
  id: string
  name: string | null;
  username: string;
  avatar_path: string | null;
  rating: number | null;
};

type Review = {
  filmId: number;
  author: string;
  author_details: AuthorDetails;
  content: string;
  created_at: string;
  id: string;
  updated_at: string;
  url: string;
};