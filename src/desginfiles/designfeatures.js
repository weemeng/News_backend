const app;
//to GoogleAPI
app.get(googleapi)
//to profanity filter api
app.post(profanityapi)

//to Frontend
app.get("/news", "get articlesData")
app.get("/news?(country=|tag=|headline=|earliestdate=|latestdate=)", "get articlesData")
//queryparams 
app.get("/news/:id/comments", "to get recent comments on article")
app.post("/news/:id/comments", "blocked by login")

app.get("/user", "show userStats")
app.post("/user/login", "login and get cookie")
app.post("/user/newUser", "creditcard details")
//change login details
app.get("/user/loginCredentials", "change login credentials")
app.patch("/user/loginCredentials", "change login credentials")

`0: GET /news
1: GET /news?(country=|tag=|headline=|earliestdate=|latestdate=`



