import * as React from 'react';
import * as constants from '../common/Constants';
import Board from '../components/Board';
import Stone from '../components/Stone';
import i18n from '../i18n';
import * as jQuery from 'jquery';
import GameClient from '../common/GameClient';
import { Protocol } from 'deepleela-common';
import Go from '../common/Go';
import { NewGameDialogStates } from '../dialogs/NewGameDialog';
import { State } from '../components/Intersection';
import { StoneColor } from '../common/Constants';
import * as moment from 'moment';

interface SmartGoBoardProps extends React.HTMLProps<HTMLElement> {

}

interface SmartGoBoardStates {
    disabled?: boolean;

}

export default class SmartGoBoard extends React.Component<SmartGoBoardProps, SmartGoBoardStates> {

    private readonly client = GameClient.default;
    private game = new Go(19);
    private endingTimestamp: number = Number.POSITIVE_INFINITY;
    gameMode: 'ai' | 'self' = 'self';
    state: SmartGoBoardStates = {};
    userStone: StoneColor = 'B';
    engine: string;

    async newAIGame(config: NewGameDialogStates): Promise<[boolean, number]> {
        this.gameMode = 'ai';
        this.userStone = config.selectedColor;
        this.engine = config.engine;
        console.log('time', config.time);
        this.endingTimestamp = config.time * 60 * 1000 + Date.now();

        let results = await this.client.requestAI(config.engine || 'leela');
        if (!results[0]) return results;

        this.client.initBoard(config);
        this.game.clear();

        if (config.selectedColor === 'W') {
            await this.genmove('B');
        }

        this.forceUpdate();
        return results;
    }

    async newSelfGame(): Promise<boolean> {
        this.gameMode = 'self';
        this.engine = 'leela';

        let results = await this.client.requestAI('leela');
        this.game.clear();
        this.client.initBoard({ handicap: 0, komi: 6.5, time: 60 * 24 });

        this.forceUpdate();
        return results[0];
    }

    async onStonePlaced(x: number, y: number) {
        let lastColor = this.game.currentColor;

        if (!this.game.play(x, y)) {
            return;
        }

        this.forceUpdate();

        if (this.gameMode === 'self') return;

        let move = Board.cartesianCoordToString(x, y);
        await this.client.play(lastColor, move);
        await this.genmove(this.game.currentColor);

        this.forceUpdate();
    }

    private async genmove(color: StoneColor) {
        let move = await this.client.genmove('B');
        let coord = Board.stringToCartesianCoord(move);
        this.game.play(coord.x, coord.y);
    }

    render() {
        let shouldBeDisabled = this.gameMode === 'self' ? false : this.game.currentColor !== this.userStone;

        let whitePlayer = this.gameMode === 'self' ? 'Human' : this.userStone === 'W' ? 'Human' : this.engine;
        let blackPlayer = this.gameMode === 'self' ? 'Human' : this.userStone === 'B' ? 'Human' : this.engine;

        let remaingms = moment.duration(this.endingTimestamp - Date.now());
        let remaining = this.endingTimestamp === Number.POSITIVE_INFINITY || this.endingTimestamp < Date.now() ? '' : `0${remaingms.hours()}:${remaingms.minutes()}:${remaingms.seconds()}`;

        moment.duration()
        return (
            <div>
                <Board
                    style={{ background: 'transparent', padding: 15, gridColor: constants.GridLineColor, blackStoneColor: constants.BlackStoneColor, whiteStoneColor: constants.WhiteStoneColor }}
                    size={19}
                    states={this.game.board}
                    disabled={this.state.disabled || shouldBeDisabled}
                    onIntersectionClicked={(row, col) => this.onStonePlaced(row, col)}
                />

                <div style={{ marginTop: -20 }}>
                    <div style={{ display: 'flex', width: this.props.width, margin: 'auto', fontSize: 14, justifyContent: 'space-between', alignItems: 'center', alignContent: 'center', pointerEvents: 'none', }}>
                        <div style={{ marginLeft: 32, paddingTop: 4, display: 'flex', alignItems: 'center', alignContent: 'center' }}>
                            <div style={{ position: 'relative', width: 16, height: 16, marginRight: 4, marginTop: -2 }}>
                                <Stone style={{ color: constants.BlackStoneColor, }} />
                            </div>
                            <span>{blackPlayer || '---'}</span>
                        </div>

                        <div style={{ color: '#ccc', marginTop: 7, fontSize: 11 }}>{this.gameMode === 'self' ? '--:--' : remaining}</div>

                        <div style={{ marginRight: 32, paddingTop: 4, display: 'flex', alignItems: 'center', alignContent: 'center' }}>
                            <div style={{ position: 'relative', width: 16, height: 16, marginRight: 4, marginTop: -2 }}>
                                <Stone style={{ color: constants.WhiteStoneColor, }} />
                            </div>
                            <span>{whitePlayer || '---'}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}