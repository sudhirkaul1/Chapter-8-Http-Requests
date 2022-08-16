import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError,tap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

errorSubject = new Subject<string>();

baseUrl : string = 'https://angular-4b290-default-rtdb.firebaseio.com/';

constructor(private httpClient: HttpClient) { }

// createandstoreposts(title: string, content:string){
//   const postData : Post = {title: title, content: content};

//   return this.httpClient.post<{name : string}>(
//     this.baseUrl + '/posts.json',
//     postData)
//   .subscribe(responseData=>{
//     console.log(responseData);
//   });
// }



createandstoreposts(title: string, content:string){
  const postData : Post = {title: title, content: content};

  return this.httpClient.post<{name : string}>(
    this.baseUrl + '/posts.json',
    postData,
    {
      observe: 'response'
    }
    )
  .subscribe({
    next: (responseData) => {
      console.log(responseData);
    },
    error: (errorRes) => {
        this.errorSubject.next(errorRes);
      }
    });
}

fetchposts(){
  //here searchParams is an immutable object which means object cannot be changed once created.

  let searchParams = new HttpParams();
  searchParams = searchParams.append('print','pretty');
  searchParams = searchParams.append('custom','key');

  return this.httpClient.get<{ [key: string]: Post }>
    (
      this.baseUrl + 'posts.json',
      {
        headers: new HttpHeaders({'Custom-Header': 'Hello'}),

        //single parameter pass
        //params: new HttpParams().set('print','pretty')

        //multiple query parameters pass
        params: searchParams
      }
    )
    .pipe( map( responseData => {
      const postsArray: Post[] = [];

      for(const key in responseData){
        if(responseData.hasOwnProperty(key)){
          postsArray.push({...responseData[key] ,  id: key })

        }
      }
        return postsArray;
      })
      // ,
      // catchError(errorRes => {
      //   this.errorSubject.next(errorRes);
      //   // console.log(errorRes.message);
      //   return throwError(() => {errorRes.message}
      //   );
      // })
    );
}


deletePosts(){
  return this.httpClient.delete(this.baseUrl + 'posts.json',
  {
    observe: 'events',
    responseType: 'json'
  })
  .pipe(tap(event => {
      console.log(event);
      if (event.type === HttpEventType.Response){
        console.log(event.body);
      }
  }));

}

}
