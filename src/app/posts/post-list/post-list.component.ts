import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PostData } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
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
  constructor(public postsService: PostsService) {}

  posts: PostData[] = [];

  //To avoid memory leak if this object is destroyed since subscription will stay
  private postsSubscription!: Subscription;

  ngOnInit(): void {
    this.postsService.getPosts();
    this.postsSubscription = this.postsService
      .getPostsUpdatedListener()
      .subscribe((posts: PostData[]) => {
        this.posts = posts;
      });
  }

  onDeletePost(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy(): void {
    this.postsSubscription.unsubscribe();
  }
}
