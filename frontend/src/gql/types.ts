export interface File {
  id: string;
  url: string;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  role: string;
}

export interface Comment {
  id: string;
  author: User;
  text: string;
}

export interface Creation {
  id: string;
  name: string;
  description: string;
  status: string;
  liked: boolean;
  likes: number;
  tags: string[];
  comments: Comment[];
  file: null | File;
  pictures: File[];
  creator: User;
  createdAt: string;
  updatedAt: string;
}
