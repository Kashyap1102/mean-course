import { Injectable } from '@angular/core';
import { PostData } from './post.model';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: PostData[] = [];
  private postsUpdated = new Subject<{ posts: PostData[], postCount: number }>();

  private BACKEND_URL = environment.apiUrl + "posts/";
  constructor(private httpClient: HttpClient, private router: Router) { }

  getPosts(postsPerPage: number, currentPage: number): void {
    const queryParams = `?pageSize=${postsPerPage}&currentPage=${currentPage}`;
    this.httpClient
      .get<{
        message: string,
        posts: {
          title: string;
          content: string;
          _id: string;
          imagePath: string;
          creator: string;
        }[],
        maxPosts: number
      }>(this.BACKEND_URL + queryParams)
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map(
              (post: {
                title: string;
                content: string;
                _id: string;
                imagePath: string;
                creator: string;
              }) => {
                return ({
                  title: post.title,
                  content: post.content,
                  id: post._id,
                  imagePath: post.imagePath,
                  creator: post.creator
                });
              }
            ), maxPosts: postData.maxPosts
          }
        })
      )
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts.posts;
        this.postsUpdated.next({ posts: [...this.posts], postCount: transformedPosts.maxPosts });
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
        this.BACKEND_URL,
        postData
      )
      .subscribe((response) => {
        this.router.navigate(['/']);
      });
  }

  updatePost(
    postId: string | Blob | null,
    title: string,
    content: string,
    image: File | string
  ) {


    let postData: PostData | FormData;
    if (typeof (image) === 'object') {


      postData = new FormData();
      postData.append('id', postId as string);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {


      postData = {
        id: postId,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    this.httpClient
      .put(this.BACKEND_URL + postId, postData)
      .subscribe((response) => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string | null | undefined | Blob) {
    return this.httpClient
      .delete(this.BACKEND_URL + postId);
  }

  getPost(postId: string | null): Observable<{
    _id: string;
    title: string;
    content: string;
    imagePath: string;
    creator: string;
  }> {
    return this.httpClient.get<{
      _id: string,
      title: string,
      content: string,
      imagePath: string,
      creator: string
    }>(this.BACKEND_URL + postId);
  }
}
