# George...In Space!!

George In Space is a platformer-style video game coded using the Phaser video game engine.
It's the final/group project for our Intro to Programming course at Epicodus.

## Installation

Clone the repository to an appropriate folder:

```shell
$ git clone https://github.com/kenr16/april-group-project.git ~/project
```
The project is required to be served by a web server due to browser cross-origin policies. One easy way to serve the files is using `browser-sync`. Install it with the following command:

```shell
$ npm -g install browser-sync
```
Then to start the server:
```shell
$ cd ~/project && browser-sync start --server --files="**/*.js"
```
This should launch the game in a new browser window.

## Usage

The game should start automatically. Use the left and right arrow keys to move George around, and the up key to jump. Start a new game at any time by clicking on the 'New Game' button.

## Specifications

* The player is able to control a character which is able to move in two dimensions on the screen.
* The player is able to interact with objects and platforms in the game world.
* The player has a score which can be increased by obtaining items
* The player has a life total which can be increased by obtaining items (air bubbles)
* The player's life total can be decreased by running into enemies
* The player is able to pick up a key (wrench) which allows them to progress to the next level
* When the game ends, the player is prompted to enter their initials. This saves their score to the high scores list
* The high scores list is available by clicking the button at top


## Contributors

Galin McMahon
Kai Leahy
Mohamed Warsame
Ken Rutan

## License

Licensed MIT
