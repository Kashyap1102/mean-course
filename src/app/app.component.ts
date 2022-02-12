import { Component } from '@angular/core';
import { PostData } from './posts/post.model';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css'],
// })
// export class AppComponent {
//   title = 'mean-course';

//   storedPosts: PostData[] = [];

//   onAddPost(post: PostData): void {
//     this.storedPosts.push(post);
//   }
// }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'mean-course';
}
