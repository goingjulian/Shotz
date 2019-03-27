# Shotz, a beautiful pubquiz game

## The design of Shotz is based on 5 principles:
1. Resusability. We want to reuse as much components as possible.
2. Simplicity. Even intoxicated people should be able to use the app.
3. Scalability. The backend should be scalable so the app remains usable with a growing amount of user.
4. No registration. We don't care who our users are. This is why we don't require registration when using the app.

## Shotz consists of 3 SPA's with each their own responsibilities:

| Team                                              | Master                                                             | Scoreboard      |
| :------------------------------------------------:|:------------------------------------------------------------------:|:---------------:|
| Can join a room with a room key                   | Can see teams with scores on the left side of the screen           | Can join a room |
| Uses 1 device                                     | Chooses questions categories (min 1, max 3) before each round      | Can display the teams that have joined the room in a lobby screen
| Answers open questions only                       | Decides when to end the quiz                                       | Can display the current question and the teams that have answered
| Provides a team name                              | Decides when to proceed to the next question                       | Teams that have submitted the wrong answer are colored red with a shot glass, teams with a valid answer are green
| Could: chooses a picture                          | Decides if the given answer is valid or not                        |  Teams that have not submitted an answer for the current question are not shown
| Could: chooses a sound                            | Can see the correct answer                                         | When a team submit a wrong answer the scrren will tell them to take s shot
| Can see own score on own device at end of round   | Can see the current question                                       | When the quiz master presses the show answer button, the board shows the correct answer and the teams that haven't submitted an answer                                                                                               
|                                                   | Can see the current round                                          | Can show the top score when a round has ended
|                                                   | Can see upcoming questions on the right side of the screen         | Can show the winners (top score) when the quiz has ended
|                                                   | Should: Can skip questions from the questions queue
|                                                   | Should: Can add questions to the questions queue
|                                                   | Can make a room which can be joined by teams and scoreboards
|                                                   | Can let the scoreboard show the correct answer                     | 

## Shotz has 2 'channels' over which it will communicate, Websockets and Xhr