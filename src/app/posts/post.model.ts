export interface PostData {
  id?: string|Blob|null;
  title?: string;
  content?: string;
  imagePath?:string;
  creator?:string|null;
}
