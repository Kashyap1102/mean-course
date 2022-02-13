import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PostData } from '../post.model';
import { PostsService } from '../posts.service';
// @Component({
//   selector: 'app-post-create',
//   templateUrl: './post-create.component.html',
//   styleUrls: ['./post-create.component.css'],
// })
// export class PostCreateComponent {
//   enteredTitle = '';
//   enteredContent = '';

//   @Output() PostCreated = new EventEmitter<PostData>();

//   //   onAddPost(postInput:HTMLTextAreaElement){
//   //   this.newPost = postInput.value;
//   // }
//   onAddPost(form: NgForm) {
//     if (form.invalid) {
//       return;
//     }
//     const post: PostData = {
//       title: form.value.title,
//       content: form.value.content,
//     };
//     this.PostCreated.emit(post);
//   }
// }

// @Component({
//   selector: 'app-post-create',
//   templateUrl: './post-create.component.html',
//   styleUrls: ['./post-create.component.css'],
// })
// export class PostCreateComponent {
//   enteredTitle = '';
//   enteredContent = '';

//   @Output() PostCreated = new EventEmitter<PostData>();

//   //   onAddPost(postInput:HTMLTextAreaElement){
//   //   this.newPost = postInput.value;
//   // }
//   onAddPost(form: NgForm) {
//     if (form.invalid) {
//       return;
//     }
//     const post: PostData = {
//       title: form.value.title,
//       content: form.value.content,
//     };
//     this.PostCreated.emit(post);
//   }
// }
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  @Output() PostCreated = new EventEmitter<PostData>();

  post: PostData | null = null;
  isLoading = false;
  private postId: string | null = null;
  private mode: string | null = 'create';

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((route) => {
      if (route.has('postId')) {
        this.postId = route.get('postId');
        this.mode = 'edit';
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
          };
        });
      } else {
        this.postId = null;
        this.mode = 'create';
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode == 'create') {
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
      this.postsService.updatePost(
        this.postId,
        form.value.title,
        form.value.content
      );
    }
    form.reset();
  }
}
