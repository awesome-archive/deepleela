
export const lang = {
    menu: {

        newgame_vs_leela: 'New Game (vs. Leela)',
        newgame_vs_self: 'New Game (vs. Self)',
        loadsgf: 'Review SGF',
        exportsgf: 'Export SGF',

        showHeatmap: 'Show Heatmap',
        showWinrate: 'Show Winrate',

        undo: 'Undo',
        pass: 'Pass',
        resign: 'Resign',
        score: 'Score Game',

        settings: 'Settings',
        about: 'About',
    },

    dialogs: {
        newgame: {
            title: 'New Game',
            yourColor: 'Your Color',
            engine: 'Go Engine',
            komi: 'Komi',
            handicap: 'Handicap',
            time: 'Time (minutes)',
            black: 'BLACK',
            white: 'WHITE',
        },

        sgf: {
            load: 'Review SGF',
            export: 'Export SGF',
        },

        settings: {
            title: 'Settings',
            themes: 'Themes',
            theme_default: 'Default',
            theme_purpink: 'Purpink',
            theme_sky_blue: 'Sky Blue',
            theme_sublime_vivid: 'Sublime Vivid',
            theme_timber: 'Timber',
            theme_simple_yellow: 'Simple Yellow',
            winrate: 'Custom Winrate',
            winrate_blackOnly: 'Black only',
            winrate_both: 'Show both winrates',
        }
    },

    notifications: {
        serversBusy: (number) => `Service is busy, try it later. Pending users: ${number}`,
        aiNotAvailable: `You won't get AI's suggestions at this moment.`,
        aiIsThinking: 'AI is Thinking...',
        invalidSgf: 'Invalid SGF format',
    },

    button: {
        ok: 'OK',
        cancel: 'Cancel',
    },

    tips: {
        first: 'First',
        previous: 'Previous',
        next: 'Next',
        last: 'Last',
        aithingking: 'AI Thinking'
    },
}