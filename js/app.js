// 这是我们的玩家要躲避的敌人 

var Enemy = function (x, y, speed, key) {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.key = key;

    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function (dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    this.x += dt * this.speed;
    /**
     * 当bug飞出屏幕，进行以下操作：
     *将bug移出屏幕，通过设置x坐标方式
     *将bug对象置为null，等待GC回收
     *将bug对应的key重新赋值
     */

    if (this.x > 500) {
        this.x = -2000;
        var beforeEnemy = allEnemies.get(this.key);
        beforeEnemy = null;
        allEnemies.set(this.key, new Enemy(0, 84 * RandomNumBoth(0, 2) + 60, RandomNumBoth(100, 300), this.key));

    }
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
//碰撞检测
Enemy.prototype.checkCollisions = function () {
    if (!player) return;
    if (disTest(player.getX(), player.getY(), 30, this.x, this.y, 30)) {
        player.reset();

    }
}


// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数

var Player = (function () {
    function _Player() {
    }
    _Player.prototype.update = (dt) => {
    };
    _Player.prototype.render = () => {
        ctx.drawImage(Resources.get(Player.sprite), this.Player.x, this.Player.y);
    };
    //碰撞检测人物位置，在这里控制不超过边界，到达河流后显示奖励。
    _Player.prototype.handleInput = (movement) => {
        switch (movement) {
            case 'left':
                _Player.x -= 101;
                break;
            case 'right':
                _Player.x += 101;
                break;
            case 'up':
                _Player.y -= 84;
                break;
            case 'down':
                _Player.y += 84;
                break;

        }
        //坐标确定，通过魔法数值控制边界显示
        editorY = {
            "-97": -13,
            "491": 407
        }
        editorX = {
            "506": 1,
            "-100": 405
        }
        _Player.x = editorX[(_Player.x).toString()] ? editorX[(_Player.x).toString()] : _Player.x;
        _Player.y = editorY[(_Player.y).toString()] ? editorY[(_Player.y).toString()] : _Player.y;
        if (_Player.y === -13 && !allEnemies.has("reward")) {
            allEnemies.forEach((item) => {
                item = null;
            })
            allEnemies.clear();
            allEnemies.set("reward", new Reward(203, 155));
        }
    }
    //被碰撞后重置位置
    _Player.prototype.reset = () => {
        _Player.x = 203;
        _Player.y = 407;
    }
    _Player.prototype.getY = () => {
        return _Player.y
    }
    _Player.prototype.getX = () => {
        return _Player.x
    }
    //部分变量初始化
    _Player.name = "player";
    _Player.sprite = 'images/char-boy.png';
    _Player.x = 203;
    _Player.y = 407;

    return _Player;
} ());

//这里是奖励对象
var rewardStrArr = ["Heart", "Key", "Rock", "Star", "Gem Blue", "Gem Green", "Gem Orange"]
var Reward = function (x, y) {
    this.x = x;
    this.y = y;
    this
    this.sprite = 'images/' + rewardStrArr[RandomNumBoth(0, 6)] + '.png';
    //资源加载应该属于异步加载，所以初始化的时候在这里加载
    Resources.load([this.sprite]);
};
Reward.prototype.render = function () {
    ctx.drawImage(Resources.get('images/Selector.png'), this.x, this.y);
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
Reward.prototype.update = function () {
};
//检测，当人物获得奖励后，重新开始
Reward.prototype.checkCollisions = function () {
    if (!player) return;
    if (disTest(player.getX(), player.getY(), 30, this.x, this.y, 30)) {
        player.reset();
        allEnemies.forEach((item) => {
            item = null;
        })
        allEnemies.clear();
        createBug();
    }
};


//创建人物
var player = new Player();
// 通过随机函数控制bug出现，使用Map存储bug对象，方便索引删除,只设置2只bug
var allEnemies = new Map();
createBug();

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
/**
 * @description 随机生成臭虫
 * @returns {Enemy} 生成bug
 */
function createBug() {
    allEnemies.set("1", new Enemy(0, 84 * RandomNumBoth(0, 2) + 60, RandomNumBoth(100, 300), "1"));
    allEnemies.set("2", new Enemy(0, 84 * RandomNumBoth(0, 2) + 60, RandomNumBoth(100, 300), "2"));
}

/**
 * @description 获取随机数，包含Min，Max
 * @param {number} Min最小值
 * @param {number} Max最大值
 * @returns {number} 生成的随机数
 */
function RandomNumBoth(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range); //四舍五入
    return num;
}
/**
 * @description 碰撞点检测
 * @param {number} playerX玩家x坐标
 * @param {number} playerY玩家y坐标
 * @param {number} playerCir玩家碰撞半径
 * @param {number} enemyX臭虫x坐标
 * @param {number} enemyY臭虫y坐标
 * @param {number} enemyCir臭虫碰撞半径
 * 
 */
function disTest(playerX, playerY, playerCir, enemyX, enemyY, enemyCir) {
    return pow(playerX - enemyX) + pow(playerY - enemyY) <= pow(enemyCir + playerCir);
}
/**
 * @description 获取乘方 
 * @param {number} n
 * */
function pow(n) {
    return n * n;
}
