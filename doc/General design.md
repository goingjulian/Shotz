#Shotz, a beautiful pubquiz game

##The design of Shotz is based on 5 principles:
1. Resusability. We want to reuse as much components as possible.
2. Simplicity. Even intoxicated people should be able to use the app.
3. Scalability. The backend should be scalable so the app remains usable with a growing amount of user.
4. No registration. We don't care who our users are. This is why we don't require registration when using the app.

##Shotz consists of 3 SPA's with each their own responsibilities:

| Team                          | Master                                                           | Scoreboard  |
| :----------------------------:|:------------------------------------------------------------------:| :-----:|
| Can join a room               | Select amount of rounds before quiz starts                         | $1600 |
| Uses 1 device                 | Chooses questions categories (min 1, max 3) before each round      |   $12 |
| Answers open questions only   | Decides when to end the quiz                                       |    $1 |
| Provides a team name          | Decides when to proceed to the next question
| Could: chooses a picture      | Decides if the given answer is valid or not
| Could: chooses a sound        | Can see the correct answer
|                               | Can see the current question
|                               | Can see the current round
|                               | Can see upcoming questions on the right side of the screen
|                               | Can skip questions from the questions queue
|                               | Can see teams with scores on the left side of the screen