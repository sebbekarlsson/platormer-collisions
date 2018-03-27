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
    _this.size = 24;

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
                _this.x < instance.x + instance.size &&
                _this.x + _this.size > instance.x &&
                _this.y < instance.y + instance.size &&
                _this.y + _this.size > instance.y
            ) {

                if (instance instanceof Coin) {
                    window.application.instances = window.application.instances.filter(function(item) { return item != instance; });

                    break;
                }

                if (
                    _this.x + _this.size - 1 > instance.x &&
                    _this.x < instance.x + instance.size - 1
                ) {
                    _this.y = _this.prevy;
                    _this.dy = 0;
                    
                    if (!(_this.y > instance.y + instance.size))
                        _this.onGround = true;
                }

                if (
                    _this.y + _this.size - 1 > instance.y &&
                    _this.y < instance.y + instance.size - 1
                ) {
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
        window.application.ctx.beginPath();
        window.application.ctx.rect(_this.x, _this.y, _this.size, _this.size);
        window.application.ctx.stroke();
    };
};

var Block = function(x, y) {
    var _this = this;

    _this.x = x;
    _this.y = y;
    _this.size = 32;

    _this.tick = function() {};

    _this.draw = function() {
        window.application.ctx.fillStyle = 'black';
        window.application.ctx.beginPath();
        window.application.ctx.rect(_this.x, _this.y, _this.size, _this.size);
        window.application.ctx.stroke();
    };
};

var Coin = function(x, y) {
    var _this = this;

    _this.x = x;
    _this.y = y;
    _this.size = 16;

    _this.tick = function() {};

    _this.draw = function () {
        window.application.ctx.fillStyle = 'yellow';
        window.application.ctx.beginPath();
        window.application.ctx.arc(_this.x + _this.size / 2, _this.y + this.size / 2, _this.size / 2, 0, 2*Math.PI);
        window.application.ctx.stroke();
    };
};

var Application = function(canvas) {
    var _this = this;
    _this.canvas = canvas;
    _this.ctx = _this.canvas.getContext('2d');
    _this.instances = [];

    _this.instances.push(new Player(120, 60));

    for (var i = 2; i < 16; i++)
        _this.instances.push(new Block(i*32, 200));

    _this.instances.push(new Block(4*32, 200-32));
    _this.instances.push(new Block(4*32, 200-64));
    _this.instances.push(new Block(6*32, 200-(32*3)));
    _this.instances.push(new Block(15*32, 200-32));
    _this.instances.push(new Coin(7*32+8, 200-32+8));
    _this.instances.push(new Coin(8*32+8, 200-32+8));
    _this.instances.push(new Coin(10*32+8, 200-32+8));
    _this.instances.push(new Coin(15*32+8, 200-(32*2)+8));

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
