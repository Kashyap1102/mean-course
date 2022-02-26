import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PostData } from '../post.model';
import { PostsService } from '../posts.service';
import { mimeType } from './mime-type.validator';
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
// @Component({
//   selector: 'app-post-create',
//   templateUrl: './post-create.component.html',
//   styleUrls: ['./post-create.component.css'],
// })
// export class PostCreateComponent implements OnInit {
//   @Output() PostCreated = new EventEmitter<PostData>();

//   post: PostData | null = null;
//   isLoading = false;
//   private postId: string | null = null;
//   private mode: string | null = 'create';

//   constructor(
//     public postsService: PostsService,
//     public route: ActivatedRoute
//   ) {}

//   ngOnInit(): void {
//     this.route.paramMap.subscribe((route) => {
//       if (route.has('postId')) {
//         this.postId = route.get('postId');
//         this.mode = 'edit';
//         this.isLoading = true;
//         this.postsService.getPost(this.postId).subscribe((postData) => {
//           this.isLoading = false;
//           this.post = {
//             id: postData._id,
//             title: postData.title,
//             content: postData.content,
//           };
//         });
//       } else {
//         this.postId = null;
//         this.mode = 'create';
//       }
//     });
//   }

//   onSavePost(form: NgForm) {
//     if (form.invalid) {
//       return;
//     }
//     this.isLoading = true;
//     if (this.mode == 'create') {
//       this.postsService.addPost(form.value.title, form.value.content);
//     } else {
//       this.postsService.updatePost(
//         this.postId,
//         form.value.title,
//         form.value.content
//       );
//     }
//     form.reset();
//   }
// }
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  post: PostData | null = null;
  isLoading = false;
  form: FormGroup | null = null;
  private postId: string | null = null;
  private mode: string | null = 'create';
  imagePreview: string | ArrayBuffer | null = null;
  formTitle: string | null = null;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
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
            imagePath:postData.imagePath
          };
           this.form?.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath,
          });
        });
      } else {
        this.postId = null;
        this.mode = 'create';
      }
    });
  }

  onImagePicked(event: Event) {
    const file: File | null | undefined = (
      event.target as HTMLInputElement
    ).files?.item(0);
    this.form?.patchValue({ image: file });
    this.form?.get('image')?.updateValueAndValidity();
    const reader: FileReader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file as File);
    console.log(file);
    console.log(this.form);
  }

  onSavePost() {
    if (this.form?.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode == 'create') {
      this.postsService.addPost(
        this.form?.value.title,
        this.form?.value.content,
        this.form?.value.image
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form?.value.title,
        this.form?.value.content,
        this.form?.value.image
      );
    }
    this.form?.reset();
  }
}
