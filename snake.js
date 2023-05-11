class Snake {
    constructor(headX, headY, direction) {
        this.direction = direction;
        this.body = [];
        this.body.push({ x: headX, y: headY });
    }
}

export { Snake, Direction };
