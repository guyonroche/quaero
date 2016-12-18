# quaero

An FAQ project written using React and Node

## State Management

Redux State Tree
```
Root
 + user
 |  + username
 |  + sid - session id. Used by actions
 |  + other profile stuff
 + modal
 |  + name - name of modal
 |  + data - optional data for modal
 + questions
 |  + array of viewed questions
 + lists
 |  + top - array of top rated questions
 |  + recent - array of recently asked questions
 |  + search - search results
 + showQuestion
``` 
