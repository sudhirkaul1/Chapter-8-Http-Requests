import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
//import { FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { PostsService } from './posts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit , OnDestroy{

  isFetching: boolean = true;
  error : string | null = null;
  errorSubscription = new Subscription;

  loadedPosts: Post[] = [];

  baseUrl : string = 'https://angular-4b290-default-rtdb.firebaseio.com/';

  constructor(private httpClient: HttpClient, private postService: PostsService){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

   this.errorSubscription = this.postService.errorSubject.subscribe(errorMessage => {
    this.error = errorMessage  ;

   })

    this.isFetching = true;

    this.fetchPosts();


  }

  onCreatePost(postData: Post){
    this.postService.createandstoreposts(postData.title,postData.content);


  }


private  fetchPosts(){
    this.isFetching = true;
    this.postService.fetchposts()
      .subscribe({
        next: (posts) => {
          this.isFetching = false;
          this.loadedPosts = posts;
       //   this.error = null;
        },
        error: (error) => {
          this.isFetching = false;
          this.error = error.message;

        }
      });

  }


  onFetchPosts(){
    this.isFetching = true;

    this.fetchPosts();

  }

  onClearPosts(){
    this.postService.deletePosts()
     .subscribe(() => {
      this.loadedPosts = [];
     });

  }

  onErrorHandler(){
    this.error = null;
  }

  ngOnDestroy(): void {
      this.errorSubscription.unsubscribe();
  }

}




