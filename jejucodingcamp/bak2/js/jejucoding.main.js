window.addEventListener('load', function () {
    var elemLoading = document.querySelector('.loading');
    elemLoading.style.opacity = 0;
    var timerId;
    timerId = setTimeout(function () {
        document.body.removeChild(elemLoading);
        clearTimeout(timerId);
        timerId = null;
    }, 600);

    var utils = jejucoding.utils,
        states = jejucoding.states,
        audio = jejucoding.audio;

    var rafId;

    if (!states.isIE) {
        audio.initialize();
    }

    document.body.classList.add('step-1');

    var elemHtml = document.querySelector('html');
    elemHtml.classList.add(utils.getOSName());

    var stateStep1 = true,
        stateStep2 = false,
        stateStep3 = false,
        stateReady = false,
        statePutFront = false,
        statePutBack = false;

    var elemContainer = document.querySelector('.page-container'),
        elemPage = document.querySelector('.page'),
        elemWitch = document.querySelector('.witch'),
        elemArrow = document.querySelector('.witch__arrow'),
        elemBalls = document.querySelector('.balls'),
        elemBtnExplosion = document.querySelector('.btn-explosion'),
        elemHalla = document.querySelector('.witch__halla');

    var toRadian = function (degree) {
        return (Math.PI / 180) * degree;
    }

    var toDegree = function (radian) {
        return (180 / Math.PI) * radian;
    };

    var ballZIndex = 100;

    var Ball = function (info) {
        this.ballName = info.ballName;
        this.ballHtml = info.ballHtml;
        this.x = info.x;
        this.y = info.y;
        this.width = info.width,
        this.height = info.height,
        this.angle = info.angle;
        this.acc = 0.5;
        this.oldX = info.x;
        this.oldY = info.y;
        this.arrHypotX = [];
        this.arrHypotY = [];

        this.init();
    };

    Ball.prototype = {
        constructor: Ball,
        update: function () {
            if (this.moving) {
                return;
            }

            if (statePutFront && this.ballName === 'front-end') {
                return;
            }

            if (statePutBack && this.ballName === 'back-end') {
                return;
            }

            if (this.x <= 0) {
                this.angle = 180 - this.angle;
                this.x = 10;
            }
            if (this.x >= window.innerWidth - this.width) {
                this.angle = 180 - this.angle;
                this.x = window.innerWidth - this.width - 10;
            }
            if (this.y <= 0) {
                this.angle = 360 - this.angle;
                this.y = 10;
            }
            if (this.y >= window.innerHeight - this.height) {
                this.angle = 360 - this.angle;
                this.y = window.innerHeight - this.height - 10;
            }

            this.x += Math.cos(toRadian(this.angle)) * this.acc;
            this.y += Math.sin(toRadian(this.angle)) * this.acc;

            if (!this.x || !this.y) {
                // 값이 NaN이 되어 멈추는 버그 해결
                var boundingRect = this.elemMain.getBoundingClientRect();
                this.x = boundingRect.left;
                this.y = boundingRect.top;
            }

            this.oldX = this.x;
            this.oldY = this.y;

            this.elemMain.style.webkitTransform = 'translate3d(' + this.x + 'px,' + this.y + 'px,0)';
            this.elemMain.style.mozTransform = 'translate3d(' + this.x + 'px,' + this.y + 'px,0)';
            this.elemMain.style.transform = 'translate3d(' + this.x + 'px,' + this.y + 'px,0)';

            if (this.acc > 0.5) {
                this.acc *= 0.95;
            } else {
                this.acc = 0.5;
            }
        },
        init: function () {
            var self = this;

            self.elemMain = document.createElement('div');
            self.elemMain.className = 'transition ball ball__' + self.ballName;
            self.elemMain.innerHTML = '<span>' + self.ballHtml + '</span>';
            self.elemMain.style.width = self.width + 'px';
            self.elemMain.style.height = self.height + 'px';
            self.elemMain.style.webkitTransform = 'translate3d(' + self.x + 'px,' + self.y + 'px,0)';
            self.elemMain.style.mozTransform = 'translate3d(' + self.x + 'px,' + self.y + 'px,0)';
            self.elemMain.style.transform = 'translate3d(' + self.x + 'px,' + self.y + 'px,0)';
            elemBalls.appendChild(self.elemMain);

            var eventNameStart = 'mousedown',
                eventNameMove = 'mousemove',
                eventNameEnd = 'mouseup';
            if (Modernizr.touchevents) {
                eventNameStart = 'touchstart';
                eventNameMove = 'touchmove';
                eventNameEnd = 'touchend';
            }

            self.elemMain.addEventListener(eventNameStart, function (e) {
                self.moving = true;
                self.elemMain.style.zIndex = ++ballZIndex;

                if (Modernizr.touchevents) {
                    self.posStartX = e.touches[0].pageX;
                    self.posStartY = e.touches[0].pageY;
                } else {
                    self.posStartX = e.pageX;
                    self.posStartY = e.pageY;
                }
            });

            window.addEventListener('touchmove', function(e) {
                e.preventDefault();
            });

            elemContainer.addEventListener(eventNameMove, function (e) {
                if (!stateReady) {
                    e.preventDefault();
                }

                if (!self.moving) {
                    return;
                }

                var pageX,
                    pageY,
                    timerId;

                if (Modernizr.touchevents) {
                    pageX = e.touches[0].pageX;
                    pageY = e.touches[0].pageY;
                } else {
                    pageX = e.pageX;
                    pageY = e.pageY;
                }

                self.angle = toDegree(Math.atan2(pageY - self.posStartY, pageX - self.posStartX));

                self.x = self.oldX + pageX - self.posStartX;
                self.y = self.oldY + pageY - self.posStartY;

                if (self.x <= 0) {
                    self.moving = false;
                    self.x = 10;
                    return;
                }
                if (self.x >= window.innerWidth - self.width) {
                    self.moving = false;
                    self.x = window.innerWidth - self.width - 10;
                    return;
                }
                if (self.y <= 0) {
                    self.moving = false;
                    self.y = 10;
                    return;
                }
                if (self.y >= window.innerHeight - self.height) {
                    self.moving = false;
                    self.y = window.innerHeight - self.height - 10;
                    return;
                }

                self.elemMain.style.webkitTransform = 'translate3d(' + self.x + 'px,' + self.y + 'px,0)';
                self.elemMain.style.mozTransform = 'translate3d(' + self.x + 'px,' + self.y + 'px,0)';
                self.elemMain.style.transform = 'translate3d(' + self.x + 'px,' + self.y + 'px,0)';

                self.arrHypotX[0] = self.arrHypotX[1];
                self.arrHypotX[1] = pageX;
                self.arrHypotY[0] = self.arrHypotY[1];
                self.arrHypotY[1] = pageY;
                var sideX = self.arrHypotX[1] - self.arrHypotX[0],
                    sideY = self.arrHypotY[1] - self.arrHypotY[0],
                    hypot = Math.sqrt(sideX * sideX + sideY * sideY);

                if (Math.abs(hypot) <= 1) {
                    hypot = 1;
                }

                self.acc = hypot * 0.5;

                if (self.acc <= 0) {
                    self.acc = 0.5;
                }

                var boundingRect = elemHalla.getBoundingClientRect();
                var sideX2 = pageX - (boundingRect.left + boundingRect.width*0.5),
                    sideY2 = pageY - boundingRect.top + 10;
                if (sideX2 * sideX2 + sideY2 * sideY2 < 2500) {
                    if (!states.isIE) {
                        audio.play('ball');
                    }

                    if (self.ballName === 'front-end') {
                        statePutFront = true;
                    }
                    if (self.ballName === 'back-end') {
                        statePutBack = true;
                    }
                    self.x = boundingRect.left + 50;
                    self.y = boundingRect.top + 20;
                    self.elemMain.classList.add('transition');
                    self.elemMain.classList.add('small');
                    self.elemMain.style.webkitTransform = 'translate3d(' + self.x + 'px,' + self.y + 'px,0)';
                    self.elemMain.style.mozTransform = 'translate3d(' + self.x + 'px,' + self.y + 'px,0)';
                    self.elemMain.style.transform = 'translate3d(' + self.x + 'px,' + self.y + 'px,0)';
                    if (statePutFront && statePutBack) {
                        cancelAnimationFrame(rafId);
                        stateReady = true;
                        document.body.classList.add('ready');

                        if (!states.isIE) {
                            audio.play('magic');
                        }

                        timerId = setTimeout(function () {
                            document.body.classList.add('go');
                            clearTimeout(timerId);
                            timerId = null;
                        }, 1000);
                    }
                }
            });

            window.addEventListener(eventNameEnd, function (e) {
                self.moving = false;
                self.oldX = self.x;
                self.oldY = self.y;
                self.arrHypotX = [];
                self.arrHypotY = [];
            });

            self.update();
        }
    };

    var ball1 = new Ball({
        ballName: 'front-end',
        ballHtml: 'HTML<br>CSS<br>JS',
        x: Math.random() * (window.innerWidth * 0.8),
        y: Math.random() * (window.innerHeight * 0.3),
        width: window.innerWidth * 0.15 >= 150 ? 150 : window.innerWidth * 0.15,
        height: window.innerWidth * 0.15 >= 150 ? 150 : window.innerWidth * 0.15,
        angle: Math.random() * 360
    });

    var ball2 = new Ball({
        ballName: 'back-end',
        ballHtml: 'Python<br>Django',
        x: Math.random() * (window.innerWidth * 0.8),
        y: Math.random() * (window.innerHeight * 0.3),
        width: window.innerWidth * 0.15 >= 150 ? 150 : window.innerWidth * 0.15,
        height: window.innerWidth * 0.15 >= 150 ? 150 : window.innerWidth * 0.15,
        angle: Math.random() * 360
    });

    window.ball1 = ball1;
    window.ball2 = ball2;

    var updateBalls = function () {
        ball1.update();
        ball2.update();

        rafId = requestAnimationFrame(updateBalls);
    };

    var coords = [];
    var coord;
    var elemBlocks = document.body.querySelectorAll('.block'),
        elemSlideItems = document.body.querySelectorAll('.slide-item');

    var disrupt = function () {
        var angle;

        document.body.classList.remove('default-position');

        for (var i = 0; i < elemBlocks.length; i++) {
            angle = Math.floor(Math.random() * 360) - 180;
            elemBlocks[i].style.webkitTransform = 'translate3d(0,' + ((window.innerHeight - coords[i][1]) - coords[i][2]) + 'px,0) rotate(' + angle + 'deg)'
            elemBlocks[i].style.mozTransform = 'translate3d(0,' + ((window.innerHeight - coords[i][1]) - coords[i][2]) + 'px,0) rotate(' + angle + 'deg)'
            elemBlocks[i].style.transform = 'translate3d(0,' + ((window.innerHeight - coords[i][1]) - coords[i][2]) + 'px,0) rotate(' + angle + 'deg)'
        }
    };

    for (var i = 0; i < elemBlocks.length; i++) {
        coord = [elemBlocks[i].offsetLeft, elemBlocks[i].offsetTop, elemBlocks[i].offsetHeight];
        coords.push(coord);
    }

    // step 1
    var init = function () {

        var timerId, timerId2, timerId3;

        timerId = setTimeout(function () {
            window.scrollTo(0, 0);
            document.querySelector('.head-bar + .slide-item').classList.add('slide-item--active');
            clearTimeout(timerId);
            timerId = null;
        }, 100);
        document.body.classList.remove('step-3');
        document.body.classList.add('step-1');

        stateStep1 = true,
        stateStep2 = false,
        stateStep3 = false,
        stateReady = false,
        statePutFront = false,
        statePutBack = false;

        var boundingRectHalla = elemHalla.getBoundingClientRect();
        var step1BallPosX = boundingRectHalla.left + 40;
        var step1BallPosY = boundingRectHalla.top + 20;

        ball1.acc = 0.5;
        ball1.arrHypotX = [];
        ball1.arrHypotY = [];
        ball1.x = step1BallPosX;
        ball1.y = step1BallPosY;
        ball1.elemMain.classList.add('small');
        ball1.update();
        
        ball2.acc = 0.5;
        ball2.arrHypotX = [];
        ball2.arrHypotY = [];
        ball2.x = step1BallPosX;
        ball2.y = step1BallPosY;
        ball2.elemMain.classList.add('small');
        ball2.update();

        if (!states.isIE) {
            audio.play('earthquake');
        }

        timerId2 = setTimeout(function () {
            if (!states.isIE) {
                audio.play('explosion');
            }

            document.body.classList.remove('step-1');
            document.body.classList.remove('ready');
            document.body.classList.remove('go');
            document.body.classList.add('step-2');

            stateStep1 = false;
            stateStep2 = true;

            ball1.angle = 180;
            ball1.acc = 20;
            ball1.x = Math.random() * (window.innerWidth * 0.3);
            ball1.y = Math.random() * (window.innerHeight * 0.1);
            ball1.elemMain.classList.remove('small');

            ball2.angle = 180;
            ball2.acc = 10;
            ball2.x = Math.random() * (window.innerWidth * 0.8);
            ball2.y = Math.random() * (window.innerHeight * 0.1);
            ball2.elemMain.classList.remove('small');

            updateBalls();
            disrupt();

            clearTimeout(timerId2);
            timerId2 = null;

            timerId3 = setTimeout(function () {
                stateStep2 = false;
                stateStep3 = true;
                ball1.angle = Math.random() * 180 + 180;
                ball2.angle = Math.random() * 180;
                ball1.elemMain.classList.remove('transition');
                ball2.elemMain.classList.remove('transition');
                document.body.classList.remove('step-2');
                document.body.classList.add('step-3');

                elemPage.style.animation = 'none';
                elemWitch.style.animation = 'none';
                elemArrow.style.left = elemHalla.offsetLeft + elemHalla.offsetWidth * 0.2 + 'px';
                elemArrow.style.top = elemHalla.offsetTop - 30 + 'px';

                clearTimeout(timerId3);
                timerId3 = null;
            }, 2000);
        }, 3000);

    };

    document.body.addEventListener('touchmove', function (e) {
        if (!stateReady) {
            e.preventDefault();
        }
    });

    elemBtnExplosion.addEventListener('click', function () {
        if (!stateReady) {
            return;
        }
        elemPage.style.animation = 'explosion infinite linear 100ms';
        elemWitch.style.animation = 'explosion infinite linear 100ms';
        init();
    });

    var scrollRender = function () {
        var yVal = 0;

        for (var i = 0; i < elemSlideItems.length; i++) {
            yVal = elemSlideItems[i].getBoundingClientRect().top;

            if (elemSlideItems[i].classList.contains('slide-item--active')) {
                yVal += 40;
            }

            // yVal: 각 박스의 y 높이
            if (yVal < -100 || yVal > window.innerHeight - 100) {
                elemSlideItems[i].classList.remove('slide-item--active');
            } else {
                elemSlideItems[i].classList.add('slide-item--active');
            }
        }
    };

    var resizeHandler = function () {
        var ballSize = window.innerWidth * 0.15;
        if (ballSize >= 150) {
            ballSize = 150;
        }
        ball1.width = ballSize;
        ball1.height = ballSize;
        ball1.elemMain.style.width = ballSize + 'px';
        ball1.elemMain.style.height = ballSize + 'px';

        ball2.width = ballSize;
        ball2.height = ballSize;
        ball2.elemMain.style.width = ballSize + 'px';
        ball2.elemMain.style.height = ballSize + 'px';

        elemArrow.style.left = elemHalla.offsetLeft + elemHalla.offsetWidth * 0.2 + 'px';
        elemArrow.style.top = elemHalla.offsetTop - 30 + 'px';

        disrupt();
    };

    window.addEventListener('scroll', function () {
        requestAnimationFrame(scrollRender);
    });

    window.addEventListener('resize', function () {
        requestAnimationFrame(resizeHandler);
    });

    init();

});












