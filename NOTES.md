# Simon | Development Notes

A demo of this fork can be viewed at: [https://simon-demo.herokuapp.com/](https://simon-demo.herokuapp.com/)

## Description

I wanted to provide a comprehensive experience for this app. Along with the basic implementation, I included game modals, countdown timer, and difficulty settings.

The game operates by keeping an array of the "master" sequence, that contains the keys of the note sequence that is played every round. Upon successful completion of each round, a random note is appended to the end of the current sequence. Once the sequence is finished playing, a counter keeps track of the "correct" answer that the user needs to click. The counter increments until all notes in the master sequence are correctly played. A separate `simongame` class was created to keep track of the general operation of the game.

Modals were implemented by a simple absolutely-positioned div that is timed to appear at certian events--game start, game end, and game victory. A separate `modals` class keeps track of the modals' UI state and callbacks.

A countdown timer was implemented to add a baseline level of difficulty to the game; after all, we want to make it a fun challenge. Code from CSSTricks was used to implement the circular spinner (the article was missing the line `transform-origin: 100% 50%;`).

The timer consists of an initial baseline value, plus a small amount (750-1500 ms) per note in the current sequence, depending on the difficulty level. If the user is unable to click through the correct sequence in time, the game ends. Furthermore, the demonstration sequence is played more quickly with a higher difficulty level. There are three difficulty levels (5, 10, 15), which are the lengths of the final sequence the user needs to complete to pass the game.

Finally, I used a pokemon-based font to add an arcade-like feel to the game. Originally, I wanted to use pixelated pokemon and sound effects instead of the note boxes, but I couldn't find any of these online.

## Challenges

The trickiest part of this application was keeping track of the multiple timeout events that occur throughout the code. I had to defend against potential race conditions that would cause weird side effects. This was particularly the case while I was implementing the circular spinner.