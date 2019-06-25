import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from '../post-list/post.model';
import { PostsService } from '../post-list/posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  constructor(public postsService: PostsService) { }

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    // const post: Post = {
    //   title: form.value.title,
    //   content: form.value.content
    // };
    this.postsService.addPost(form.value.title, form.value.content);
    form.reset();
  }

  ngOnInit() {
  }


}
