(()=>{
    let getCookie = (name) =>{
        // (^| )name=([^;]*)(;|$),match[0]为与整个正则表达式匹配的字符串，match[i]为正则表达式捕获数组相匹配的数组；
        let arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
        if(arr !== null) {
            return unescape(arr[2]);
        }
        return null;
    };
    class snake{
        constructor(canvas, size){
            this.ctx = canvas.getContext("2d");                     //画布
            this.size = size;                                       //蛇和苹果的尺寸
            this.length = 10;                                       //蛇的初始长度
            this.GameStart = false;                                 //游戏开始状态
            this.width = parseInt(canvas.getAttribute("width"));    //获取Canvas宽度
            this.height = parseInt(canvas.getAttribute("height"));  //获取Canvas高度
            this.AppleReset = ()=>{
                this.apple = {
                    X: Math.round(Math.random()*(this.width - this.size)/this.size)*this.size + this.size,
                    Y: Math.round(Math.random()*(this.height - this.size)/this.size)*this.size + this.size,
                };
                if(this.apple.X >= this.width) this.apple.X -= this.size;
                if(this.apple.Y >= this.height) this.apple.Y -= this.size;
            };                            //随机出现一个苹果
            this.GameReset = ()=>{
                this.wall = false;
                this.EatOwn = false;
                this.direction = "right";		// up 向上	down 向下	left 向左	right 向右
                this.long = [];
                this.position = {X: 5, Y: 5,};
                for(let i = 0; i < this.length; i++) this.long.unshift([this.position['X'], this.position['Y']]);
                this.AppleReset();
            };                             //重置游戏 方向 长度 位置
            this.Move = ()=>{
                switch (this.direction){
                    case "up":this.position['Y']--;break;
                    case "down":this.position['Y']++;break;
                    case "left":this.position['X']--;break;
                    case "right":this.position['X']++;break;
                }
                this.long.pop() && this.long.unshift([this.position['X'], this.position['Y']]);
                this.Collision();
            };                                  //移动
            this.Collision = ()=>{
                for(let i = 1; i < this.long.length; i++){
                    if(this.position.X === this.long[i][0] && this.position.Y === this.long[i][1]){
                        this.GameStart = false;
                        this.EatOwn = true;
                    }
                }
                if(this.position.X < 0 || this.position.Y < 0 || this.position.X >= this.width/this.size || this.position.Y >= this.height/this.size){
                    this.GameStart = false;
                    this.wall = true;
                }
            };                             //判断是否碰撞
            this.button = (just, back)=>{
                if(!this.GameStart){
                    this.GameStart = true;
                    this.GameReset();
                }
                if(this.direction !== back) this.direction = just;
            };                      // 方向摆动
            document.addEventListener("keydown", (event)=>{
                let e = event || window.evnet;
                switch (e.keyCode){
                    case 37:this.button("left", "right");break;
                    case 38:this.button("up", "down");break;
                    case 39:this.button("right", "left");break;
                    case 40:this.button("down", "up");break;
                }
            });   //添加键盘事件
            canvas.addEventListener("click" ,()=>{
                this.GameStart = true;
                this.GameReset();                                       //执行游戏
            });
            this.ctx.font = this.size+"px 黑体";                    //默认字体
            this.ctx.fillText("按任意键开始", this.width/2 - this.size/2*6, this.height/2);
        }
        model(){
            this.Move();
            if(this.apple.X === this.long[0][0]*this.size && this.apple.Y === this.long[0][1]*this.size){
                this.AppleReset();
                this.long.unshift([this.position['X'], this.position['Y']]);
            }//判断是否吃到苹果苹果
        }
        view(){
            //清空屏幕
            this.ctx.clearRect(0,0,this.width,this.height);                     //清空画布
            //打印苹果
            this.ctx.fillStyle="#ff0000";                                       //苹果的颜色
            this.ctx.fillRect(this.apple.X, this.apple.Y,this.size,this.size);  //画一个苹果
            //打印蛇
            this.ctx.fillStyle="#3dff35";                                       //蛇的颜色
            for(let i = 0; i < this.long.length; i++) this.ctx.fillRect(this.long[i][0]*this.size, this.long[i][1]*this.size,this.size,this.size);  //显示蛇的每一段
            //打印文字
            this.ctx.fillStyle = "#000";
            if((this.long.length - this.length) > getCookie("Fraction")) document.cookie="Fraction=" + (this.long.length - this.length);
            if(!getCookie("Fraction")) document.cookie="Fraction=0";
            this.ctx.fillText((this.long.length - this.length) + " " + "最高:" + getCookie("Fraction"), 10, this.size);
            //打印死亡信息
            if(this.wall){
                this.ctx.fillText("撞墙而死 按任意键开始", this.width/2 - this.size/2*10, this.height/2);
            }else if(this.EatOwn){
                this.ctx.fillText("咬到自己而死 按任意键开始", this.width/2 - this.size/2*12, this.height/2);
            }
        }
        Controller(){
            if(this.GameStart){
                this.model();
                this.view();
            }
        }
    }
    window.addEventListener("load", ()=>{
        let s = new snake(document.querySelector('#c'), 30, document.querySelector('#n'));
        document.querySelector('#left').addEventListener("click", ()=>{
            s.button("left", "right");
        });
        document.querySelector('#up').addEventListener("click", ()=>{
            s.button("up", "down");
        });
        document.querySelector('#right').addEventListener("click", ()=>{
            s.button("right", "left");
        });
        document.querySelector('#down').addEventListener("click", ()=>{
            s.button("down", "up");
        });

        let b = 0;
        let a = ()=>{
            if(b > 5){
                s.Controller();
                b = 0;
            }else b++;
            requestAnimationFrame(a);
        };
        requestAnimationFrame(a);
    });
})();
