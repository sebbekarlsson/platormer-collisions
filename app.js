Math.radians = function (degrees) {
    return degrees * Math.PI / 180;
}


var Player = function(x, y) {
    var _this = this;

    _this.x = x;
    _this.y = y;
    _this.prevx = x;
    _this.prevy = y;
    _this.dx = 0.0;
    _this.dy = 0.0;
    _this.friction = 0.1;
    _this.upArrow = false;
    _this.downArrow = false;
    _this.leftArrow = false;
    _this.rightArrow = false;
    _this.onGround = false;

    document.addEventListener('keydown', function(e) {
        e = e || window.event;

        if (e.keyCode == '38') {
            _this.upArrow = true;
        }
        if (e.keyCode == '40') {
            _this.downArrow = true;
        }
        if (e.keyCode == '37') {
            _this.leftArrow = true;
        }
        if (e.keyCode == '39') {
            _this.rightArrow = true;
        }

    });

    document.addEventListener('keyup', function(e) {
        e = e || window.event;

        if (e.keyCode == '38') {
            _this.upArrow = false;
        }
        if (e.keyCode == '40') {
            _this.downArrow = false;
        }
        if (e.keyCode == '37') {
            _this.leftArrow = false;
        }
        if (e.keyCode == '39') {
            _this.rightArrow = false;
        }

    });

    _this.addForce = function (direction, force) {
        _this.dx += Math.cos(Math.radians(direction)) * force;
        _this.dy += Math.sin(Math.radians(direction)) * force;
    };

    _this.tick = function() {
        _this.x += _this.dx;
        _this.y += _this.dy;
        _this.onGround = false;

        if (_this.dx > 0) {
            if (_this.dx - _this.friction < 0)
                _this.dx = 0.0;
            else
                _this.dx -= _this.friction
        }

        if (_this.dx < 0) {
            if (_this.dx + _this.friction > 0)
                _this.dx = 0.0
            else
                _this.dx += _this.friction;
        }

        if (_this.dy > 0) {
            if (_this.dy - _this.friction < 0)
                _this.dy = 0.0;
            else
                _this.dy -= _this.friction
        }

        if (_this.dy < 0) {
            if (_this.dy + _this.friction > 0)
                _this.dy = 0.0
            else
                _this.dy += _this.friction;
        }

        for (var i = 0; i < window.application.instances.length; i++) {
            var instance = window.application.instances[i];

            if (instance == _this)
                continue;

            if (
                _this.x < instance.x + 32 &&
                _this.x + 24 > instance.x &&
                _this.y < instance.y + 32 &&
                _this.y + 24 > instance.y
            ) {
                _this.y = _this.prevy;
                _this.dy = 0;
                _this.onGround = true;

                if (_this.y + 24 > instance.y) {
                    _this.x = _this.prevx;
                    _this.dx = 0;
                }
                
            }
        }

        if (_this.rightArrow)
            _this.addForce(0, 0.5);

        if (_this.leftArrow)
            _this.addForce(180, 0.5);

        if (!_this.onGround) {
            _this.dy += 0.2;
        } else if (_this.upArrow) {
            _this.addForce(270, 6.5);
        }
       
        _this.prevx = _this.x;
        _this.prevy = _this.y;
    };

    _this.draw = function() {
        window.application.ctx.fillStyle = 'red';
        window.application.ctx.rect(_this.x, _this.y, 24, 24);
        window.application.ctx.stroke();
    };
};

var Block = function(x, y) {
    var _this = this;

    _this.x = x;
    _this.y = y;

    _this.tick = function() {};

    _this.draw = function() {
        window.application.ctx.fillStyle = 'black';
        window.application.ctx.rect(_this.x, _this.y, 32, 32);
        window.application.ctx.stroke();
    };
};

var Application = function(canvas) {
    var _this = this;
    _this.canvas = canvas;
    _this.ctx = _this.canvas.getContext('2d');
    _this.instances = [];

    _this.instances.push(new Player(120, 60));

    for (var i = 2; i < 9; i++)
        _this.instances.push(new Block(i*32, 200));

    _this.instances.push(new Block(4*32, 200-32));
    _this.instances.push(new Block(4*32, 200-64));
    _this.instances.push(new Block(6*32, 200-(32*3)));

    _this.tick = function() {
        for (var i = 0; i < _this.instances.length; i++)
            _this.instances[i].tick();
    };

    _this.draw = function () {
        for (var i = 0; i < _this.instances.length; i++)
            _this.instances[i].draw();
    }

    _this.start = function() {
        _this.canvas.width = _this.canvas.width;
        _this.ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height);

        _this.tick();
        _this.draw();

        requestAnimationFrame(_this.start); 
    };
};


document.addEventListener('DOMContentLoaded', function(e) {
    window.application = new Application(
        document.getElementById('canvas')
    );

    window.application.start();
});
