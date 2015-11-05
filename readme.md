# Kirby Krash

[Live][pages]

[pages]: https://amihays.github.io/kirby_krash

Kirby Krash is a browser-based game inspired by Brick Breaker. Kirby is meshed with a series of vertices to make for a more refined collision detection system. These vertices also allow for rotational velocities to be calculated after collisions for more interesting dynamics.

## Vector class

Vector class DRYs up code by compactly allowing for a wide array of vector operations.

[Code][vector]
[vector]: ./lib/vector.js

## Body class

Body class implements physics behind Kirby. Body contains series of vertices that can detect collision with walls or bricks, which exert a force on the vertex and contribute to rotational velocity on the body.

[Code][body]
[body]: ./lib/body.js


## Box class

Box class defines regions with which vertices of bodies may collide. Boxes are used in both the spring and the bricks. These two different classes have different force responses as implemented in the box class.

[Code][box]
[box]: ./lib/box.js
