import * as React from 'react';
import * as jQuery from 'jquery';
import * as interactjs from 'interactjs';
import './Styles.css'
import { Interactable } from 'interactjs';
import i18n from '../i18n';
import SGF from '../common/SGF';
import { State } from '../components/Intersection';
import { CSSProperties } from 'react';
import { StoneColor } from '../common/Constants';
import GameClient from '../common/GameClient';
import Board from '../components/Board';

interface BoardControllerProps {
    style?: CSSProperties;
    onAIThinkingClick?: () => void;
    onCursorChange?: (delta: number) => void;
    onSnapshotChange?: (snapshot: State[][], coord: { x: number, y: number }, currentColor: StoneColor) => void;
}

export default class BoardController extends React.Component<BoardControllerProps, {}> {

    private sgf: string;
    private boardSize: number;
    private snapshots: State[][][] = [];
    private arrayCoords: { x: number, y: number }[] = [];
    private stonesColor: StoneColor[] = [];
    currentIndex = 0;

    componentDidMount() {
        const xKey = 'board-controller-x';
        const yKey = 'board-controller-y';

        let x = localStorage.getItem(xKey);
        let y = localStorage.getItem(yKey);
        if (x && y) {
            let fx = Math.min(Math.max(Number.parseFloat(x), 0), window.innerWidth - 290);
            let fy = Math.min(Math.max(Number.parseFloat(y), 0), window.innerHeight - 52);
            jQuery('#board-controller').css('left', fx).css('top', fy);
        }

        interactjs('#draggable-handler').draggable({
            onmove: e => {
                jQuery('#board-controller').css('top', Math.max(e.clientY, 0)).css('left', Math.max(e.clientX, 0));
            },
            onend: e => {
                localStorage.setItem(xKey, e.clientX.toString());
                localStorage.setItem(yKey, e.clientY.toString());
            },
        });
    }

    loadSgf(sgf: string) {
        this.reset();
        this.sgf = sgf;

        try {
            let tree = SGF.import(sgf);
            this.boardSize = tree.size;
            return tree;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    appendMove(color: StoneColor, coord: { x: number, y: number }, board: State[][]) {
        if (this.currentIndex !== this.snapshots.length - 1 && this.snapshots.length !== 0) return; // if users play new variations at previous points, ignore it

        this.stonesColor.push(color);
        this.arrayCoords.push(Board.cartesianCoordToArrayPosition(coord.x, coord.y));
        this.snapshots.push(SGF.createBoardFrom(board));
        this.currentIndex = this.snapshots.length - 1;
    }

    reset() {
        this.snapshots = [];
        this.arrayCoords = [];
        this.stonesColor = [];
        this.currentIndex = 0;
    }

    private triggerSnapshotChange(index: number) {
        if (!this.props.onSnapshotChange) return;
        if (this.snapshots.length === 0) return;
        let snapshot = this.snapshots[index];
        this.props.onSnapshotChange(snapshot, this.arrayCoords[index], this.stonesColor[index]);
    }

    private triggerAIThinking() {
        if (!this.props.onAIThinkingClick) return;
        this.props.onAIThinkingClick();
    }

    private triggerCursorChange(delta: number) {
        if (!this.props.onCursorChange) return;
        this.props.onCursorChange(delta);
    }

    render() {
        return (
            <div id='board-controller' style={this.props.style} className='board-controller'>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', alignContent: 'center', background: 'rgba(255, 255, 255, 0.75)', userSelect: 'none', backdropFilter: 'blur(25px)' }}>
                    <div id='draggable-handler'>
                        <span uk-icon='icon: more-vertical; ratio: 1' style={{ display: 'inline-block', paddingLeft: 10 }}></span>
                    </div>
                    <div className='touch' data-message={i18n.tips.first} onClick={e => this.triggerCursorChange(-10)}>
                        <span uk-icon='icon:  chevron-left; ratio: 1;'></span>
                        <span uk-icon='icon:  chevron-left; ratio: 1.2' style={{ display: 'inline-block', marginLeft: -16 }}></span>
                    </div>
                    <div className='touch' style={{ paddingTop: 2 }} data-message={i18n.tips.previous} onClick={e => this.triggerCursorChange(-1)}>
                        <span uk-icon='icon: arrow-left; ratio: 1.35'></span>
                    </div>
                    <div className='touch' data-message={i18n.tips.aithingking} onClick={e => this.triggerAIThinking()}>
                        <span style={{ fontWeight: 100, fontSize: 19, marginTop: 3, display: 'block', fontFamily: 'sans-serif' }}>AI</span>
                    </div>
                    <div className='touch' style={{ paddingTop: 2 }} data-message={i18n.tips.next} onClick={e => this.triggerCursorChange(1)}>
                        <span uk-icon='icon: arrow-right; ratio: 1.35'></span>
                    </div>
                    <div className='touch' data-message={i18n.tips.last} onClick={e => this.triggerCursorChange(10)}>
                        <span uk-icon='icon:  chevron-right; ratio: 1.2' style={{ display: 'inline-block', marginRight: -16 }}></span>
                        <span uk-icon='icon:  chevron-right; ratio: 1'></span>
                    </div>
                </div>
            </div>
        );
    }
}