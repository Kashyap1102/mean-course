import { Component, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
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
export class PostCreateComponent {
  @Output() PostCreated = new EventEmitter<PostData>();

  constructor(public postsService: PostsService) {}

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.postsService.addPost(form.value.title, form.value.content);
    form.reset();
  }
}
