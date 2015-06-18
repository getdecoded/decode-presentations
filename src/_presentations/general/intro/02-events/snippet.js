var robotPack = new CollectorRobotPack();
payFor(robotPack);
robotPack.deliver('my-house');

var robotParts = unbox(robotPack);
var robot = assemble(robot);

robot.charge();
robot.turnOn();

if (robot.canSee('collectable')) {
    robot.driveToCollectable();
    robot.pickupCollectable();
}

robot.giveMeCollectables();
robot.stop();
robot.charge();

// Done for now
