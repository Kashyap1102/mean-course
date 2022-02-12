import { Injectable } from '@angular/core';
import { PostData } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: PostData[] = [];
  private postsUpdated = new Subject<PostData[]>();

  constructor(private httpClient: HttpClient) {}

  getPosts(): void {
    this.httpClient
      .get<{
        message: string;
        posts: { title: string; content: string; _id: string }[];
      }>('http://localhost:3000/api/posts')
      .pipe(
        map((postData) => {
          return postData.posts.map(
            (post: { title: string; content: string; _id: string }) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
              };
            }
          );
        })
      )
      .subscribe((posts) => {
        this.posts = posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostsUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post = { id: '', title: title, content: content };
    this.httpClient
      .post<{ message: string; postId: string }>(
        'http://localhost:3000/api/posts',
        post
      )
      .subscribe((response) => {
        post.id = response.postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(postId: string) {
    this.httpClient
      .delete("http://localhost:3000/api/posts/" + postId)
      .subscribe(() => {
        this.posts = this.posts.filter((post) => post.id != postId);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
