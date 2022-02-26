import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PostData } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { BlockScrollStrategy } from '@angular/cdk/overlay';
import { AuthService } from 'src/app/auth/auth.service';
// @Component({
//   selector:'app-post-list',
//   templateUrl:'./post-list.component.html',
//   styleUrls:['./post-list.component.css']
// })
// export class PostListComponent{
//   // posts = [
//   //   {title:'First Post',content:'This is first post'},
//   //   {title:'Second Post',content:'This is second post'},
//   //   {title:'Third Post',content:'This is third post'},
//   // ]

//   @Input() posts:PostData[] = []
// }

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  constructor(public postsService: PostsService, private authService: AuthService) { }

  posts: PostData[] = [];
  isLoading = false;
  //To avoid memory leak if this object is destroyed since subscription will stay
  private postsSubscription!: Subscription;
  totalPosts: number = 0;
  pageSizeOptions = [1, 2, 5, 10];
  postsPerPage = 10;
  currentPage = 1
  isUserAuthenticated: boolean = false;
  getAuthStatusSub: Subscription = new Subscription();

  ngOnInit(): void {
    this.isLoading = true;

    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSubscription = this.postsService
      .getPostsUpdatedListener()
      .subscribe((postData: { posts: PostData[], postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
    this.isUserAuthenticated = this.authService.getAuthStatus();
    this.getAuthStatusSub = this.authService.getAutheticationStatusListener().subscribe(isAuthenticated => {
      this.isUserAuthenticated = isAuthenticated;
    })
  }

  onDeletePost(postId: string | null | undefined | Blob) {
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy(): void {
    this.postsSubscription.unsubscribe();
    this.getAuthStatusSub.unsubscribe();
  }
}
