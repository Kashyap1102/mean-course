import { Injectable } from '@angular/core';
import { PostData } from './post.model';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { identifierName } from '@angular/compiler';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: PostData[] = [];
  private postsUpdated = new Subject<PostData[]>();

  constructor(private httpClient: HttpClient, private router: Router) { }

  getPosts(): void {
    this.httpClient
      .get<{
        message: string;
        posts: {
          title: string;
          content: string;
          _id: string;
          imagePath: string;
        }[];
      }>('http://localhost:3000/api/posts')
      .pipe(
        map((postData) => {
          return postData.posts.map(
            (post: {
              title: string;
              content: string;
              _id: string;
              imagePath: string;
            }) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
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

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.httpClient
      .post<{ message: string; post: PostData }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe((response) => {
        const post = {
          id: response.post.id,
          title: title,
          content: content,
          imagePath: response.post.imagePath,
        };
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(
    postId: string | Blob | null,
    title: string,
    content: string,
    image: File | string
  ) {

    console.log(postId);

    let postData: PostData | FormData;
    if (typeof (image) === 'object') {

      console.log('Form Data');

      postData = new FormData();
      postData.append('id', postId as string);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('imagePath', image, title);
    } else {

      console.log('Post Data');

      postData = {
        id: postId,
        title: title,
        content: content,
        imagePath: image,
      };
    }
    this.httpClient
      .put('http://localhost:3000/api/posts/' + postId, postData)
      .subscribe((response) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex((p) => p.id == postId);
        const post: PostData = {
          id: postId,
          title: title,
          content: content,
          imagePath: 'image',
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string | null | undefined | Blob) {
    this.httpClient
      .delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        this.posts = this.posts.filter((post) => post.id != postId);
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPost(postId: string | null): Observable<{
    _id: string;
    title: string;
    content: string;
    imagePath: string;
  }> {
    return this.httpClient.get<{
      _id: string,
      title: string,
      content: string,
      imagePath: string
    }>('http://localhost:3000/api/posts/' + postId);
  }
}
