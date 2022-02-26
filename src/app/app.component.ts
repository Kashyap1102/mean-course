import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
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
export class AppComponent implements OnInit {
  
  constructor(private authService:AuthService){}
  
  ngOnInit(): void {
    this.authService.autoAuthUser();
  }
  title = 'mean-course';
}
