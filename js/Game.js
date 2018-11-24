// constructor function

class Game {
  constructor() {
    this.table = new Table();
    //TODO write a nice thing for automatically positioning the balls instead of this hardcoded crap?
    var xOffset = Table.LEN_X / 4;
    var X_offset_2 = 1.72; // this controls how tightly the balls are packed together on the x-axis

    this.balls = [
      new WhiteBall(),

      // First row
      new Ball(xOffset, Ball.RADIUS, 4 * Ball.RADIUS, '4ball'),
      new Ball(xOffset, Ball.RADIUS, 2 * Ball.RADIUS, '3ball'),
      new Ball(xOffset, Ball.RADIUS, 0, '14ball'),
      new Ball(xOffset, Ball.RADIUS, -2 * Ball.RADIUS, '2ball'),
      new Ball(xOffset, Ball.RADIUS, -4 * Ball.RADIUS, '15ball'),

      // 2nd row
      new Ball(xOffset - X_offset_2 * Ball.RADIUS, Ball.RADIUS, 3 * Ball.RADIUS, '13ball'),
      new Ball(xOffset - X_offset_2 * Ball.RADIUS, Ball.RADIUS, Ball.RADIUS, '7ball'),
      new Ball(xOffset - X_offset_2 * Ball.RADIUS, Ball.RADIUS, -1 * Ball.RADIUS, '12ball'),
      new Ball(xOffset - X_offset_2 * Ball.RADIUS, Ball.RADIUS, -3 * Ball.RADIUS, '5ball'),

      // 3rd row
      new Ball(xOffset - X_offset_2 * 2 * Ball.RADIUS, Ball.RADIUS, 2 * Ball.RADIUS, '6ball'),
      new Ball(xOffset - X_offset_2 * 2 * Ball.RADIUS, Ball.RADIUS, 0, '8ball'),
      new Ball(xOffset - X_offset_2 * 2 * Ball.RADIUS, Ball.RADIUS, -2 * Ball.RADIUS, '9ball'),

      //4th row
      new Ball(xOffset - X_offset_2 * 3 * Ball.RADIUS, Ball.RADIUS, Ball.RADIUS, '10ball'),
      new Ball(xOffset - X_offset_2 * 3 * Ball.RADIUS, Ball.RADIUS, -1 * Ball.RADIUS, '11ball'),

      //5th row
      new Ball(xOffset - X_offset_2 * 4 * Ball.RADIUS, Ball.RADIUS, 0, '1ball')
    ];
  }

  tick(delta) {
    this.balls.forEach(ball => ball.tick(delta));
  }

  /** Hit the ball with the given strength. This
 will make the ball move towards it's current "forward" direction, which
 is determined by the camera position / angle */
  ballHit(strength) {
    if (this.balls[0].rigidBody.sleepState == CANNON.Body.SLEEPING) {
      //this.balls[0].hitForward(strength);
      this.balls[0].cue.shoot(strength);
    }
  }
};