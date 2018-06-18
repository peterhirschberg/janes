import React, { Component } from 'react';
import './Janes.css';

class Drop extends Component {
    render() {
        return (
            <div className="Drop" style={{
                left: this.props.pos.x,
                top: this.props.pos.y
            }}></div>
        );
    }
}

class Pickup extends Component {
    render() {
        return (
            <div className="Pickup" style={{
                left: this.props.pos.x,
                top: this.props.pos.y
            }}></div>
        );
    }
}

class Block extends Component {
    render() {
        return (
            <div className="Block" style={{
                left: this.props.pos.x,
                top: this.props.pos.y,
                backgroundColor: this.props.color
            }}></div>
        );
    }
}

const windowWidth = 800;
const windowHeight = 500;
const blockSize = 50;
const numBlocks = 24;

function intersectRect(r1, r2) {
    return !(r2.left > r1.right || 
             r2.right < r1.left || 
             r2.top > r1.bottom ||
             r2.bottom < r1.top);
}

function pointInRect(pt, rect) {
    if (pt.x >= rect.left && 
        pt.x <= rect.right &&
        pt.y >= rect.top &&
        pt.y <= rect.bottom) {
            return true;
    }
    return false;
}

class Janes extends Component {

    constructor(props) {
        super(props);

        this.state = {
            mouseDown: false,
            inactiveBlocks: [],
            activeBlocks: [],
            cursorPos: {
                x: 0,
                y: 0
            }
        };

        const colorArray = [
            'red',
            'maroon',
            'yellow',
            'olive',
            'lime',
            'green',
            'aqua',
            'teal',
            'blue',
            'navy',
            'fuchsia',
            'purple',
            'red',
            'maroon',
            'yellow',
            'olive',
            'lime',
            'green',
            'aqua',
            'teal',
            'blue',
            'navy',
            'fuchsia',
            'purple'
        ];

        const noteArray = [
            'a',
            'ab',
            'b',
            'bb',
            'c',
            'cb',
            'd',
            'e',
            'eb',
            'f',
            'g',
            'gb',
            'a',
            'ab',
            'b',
            'bb',
            'c',
            'cb',
            'd',
            'e',
            'eb',
            'f',
            'g',
            'gb'
        ];

        // Init the blocks
        for (var i=0; i<numBlocks; i++) {

            let snd  = new Audio();
            let src  = document.createElement('source');
            src.type = 'audio/mpeg';
            src.src  = 'audio/' + noteArray[i] + '.mp3';
            snd.appendChild(src);
        
            this.state.inactiveBlocks.push(
                {
                    pos: {
                        x: 0,
                        y: 0,
                    },
                    speed: 0,
                    color: colorArray[i],
                    sound: snd
                }
            );
        }

        this.onMouseMove = this.onMouseMove.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onTick = this.onTick.bind(this);
        this.renderCursor = this.renderCursor.bind(this);
        this.getBlockForCursorPos = this.getBlockForCursorPos.bind(this);

        setInterval(this.onTick, 10);
    }

    onTick() {
        var blocks = this.state.activeBlocks;

        // Run the active blocks and apply gravity, etc
        blocks.forEach(function(block){
            if (block.pos.y <= windowHeight-blockSize) {
                block.speed += .1;
                block.pos.y += block.speed;
            }
        });

        // bounce off the ground
        blocks.forEach(function(block){
            if (block.pos.y > windowHeight-blockSize) {
                if (block.speed > .1){
                    block.sound.play();
                }
                block.pos.y = windowHeight-blockSize;
                block.speed = -block.speed * .8;
            }
        });

        // Bounce blocks off each other
        for (var i=0; i<blocks.length; i++) {
            for (var j=0; j<blocks.length; j++) {
                
                if (i===j) continue;

                var blockA = blocks[i];
                var blockB = blocks[j];

                var rectA = {
                    left: blockA.pos.x,
                    top: blockA.pos.y,
                    right: blockA.pos.x + blockSize,
                    bottom: blockA.pos.y + blockSize
                };
                var rectB = {
                    left: blockB.pos.x,
                    top: blockB.pos.y,
                    right: blockB.pos.x + blockSize,
                    bottom: blockB.pos.y + blockSize
                };

                if (intersectRect(rectA, rectB)) {
                    // figure out which is higher
                    if (blockA.pos.y < blockB.pos.y && blockA.speed > 0) {
                        if (blockA.speed > .1){
                            blockA.sound.play();
                        }
                        if (blockB.speed < -.1){
                            blockB.sound.play();
                        }
                        blockA.pos.y = blockB.pos.y - blockSize;
                        blockA.speed = -blockA.speed * .8;
                    }
                }

            }
        }

        this.setState({
            activeBlocks: blocks
        });

    }

    onMouseMove(event) {
        const bounds = event.target.getBoundingClientRect();
        var x = (event.clientX - bounds.left) - (blockSize/2);
        var y = (event.clientY - bounds.top) - (blockSize/2);

        if (x < 0) {
            x = 0;
        } else if (x+50 >= windowWidth) {
            x = windowWidth-blockSize;
        }
        if (y < 0) {
            y = 0;
        } else if (y+50 >=windowHeight) {
            y = windowHeight-blockSize;
        }

        this.setState({
            cursorPos: {
                x: x,
                y: y
            }
        });

    }

    onClick() {
        var block = this.getBlockForCursorPos();
        if (block) {
            // Remove the block at the cursor position
            const index = this.state.activeBlocks.indexOf(block);
            this.state.activeBlocks.splice(index, 1);
            this.state.inactiveBlocks.unshift(block);
        }
        else if (this.state.inactiveBlocks.length) {

            // Drop a new block

            var newBlock = this.state.inactiveBlocks.shift();

            newBlock.pos.x = this.state.cursorPos.x;
            newBlock.pos.y = this.state.cursorPos.y;
            newBlock.speed = 0;
    
            this.state.activeBlocks.push(newBlock);  
        }
        this.setState({
            activeBlocks: this.state.activeBlocks,
            inactiveBlocks: this.state.inactiveBlocks
        });
    }

    onMouseDown() {
        this.setState({ mouseDown: true });
    }

    onMouseUp() {
        this.setState({ mouseDown: false });
    }

    getBlockForCursorPos() {

        var cursorPoint = {
            x: this.state.cursorPos.x + (blockSize/2),
            y: this.state.cursorPos.y + (blockSize/2)
        };

        var blocks = this.state.activeBlocks;

        for(var i=0; i<blocks.length; i++) {
            var block = blocks[i];
            var blockRect = {
                top: block.pos.y,
                left: block.pos.x,
                right: block.pos.x + blockSize,
                bottom: block.pos.y + blockSize
            };
            if (pointInRect(cursorPoint, blockRect)) {
                return block;
            }         
        }

        return null;
    }

    renderCursor() {
        if (this.getBlockForCursorPos() ||
            (this.state.inactiveBlocks.length === 0 && this.state.mouseDown)){
            return <Pickup pos={this.state.cursorPos}/>
        }
        else {
            return <Drop pos={this.state.cursorPos}/>
        }
    }

    render() {
        return (
            <div className="Janes"
                onMouseMove={this.onMouseMove}
                onClick={this.onClick}
                onMouseDown={this.onMouseDown}
                onMouseUp={this.onMouseUp}>

                {this.renderCursor()}

                {this.state.activeBlocks.map(function(block, index){
                    return <Block key={index} pos={block.pos} color={block.color}/>;
                })}

            </div>
        );
    }

}

export default Janes;
