// PSEUDOCODE FOR LOGIC ON GOPS

// GAME RULES FLASH BEFORE SCREEN
// SHOW USER 4 CATRGORIES OF SUITS TO CHOOSE FROM
// USER SELECTS SUIT AND CARDS LOAD INTO HAND 
// COMP RANDOMLY SELECTS 1 OTHER SUIT OF THE 3 AND LOADS COMPUTER'S HAND
// RANDOMLY SELECT OF THE REMAINING 2 SUITS TO DECK
// LAST SUIT MAKES UP THE 'DISCARD' PILE
// DECK SHUFFLES CARDS AND FLIPS OPEN IN CENTER THE TOP CARD
// GAME RULES FLASH BEFORE SCREEN AGAIN
// USER IS THEN PROMPTED TO SELECT FROM HAND WHAT THEY WOULD LIKE TO PLAY AS A BET
// COMPUTER THEN RANDOMLY SELECTS CARD FROM HAND TO PLAY AS BET 
// WHOEVER PLAYS THE CARD WITH THE HIGHER POINT VALUE WINS THE CARD AND THAT CARDS POINT TOTAL IS ADDED TO PLAYERS TOTAL
// PROCEED FLIPPING OVER ANOTHER CARD AND REPEATING UNTIL ALL DECK CARDS ARE GONE
// ON A TIE DISCARD BETS AND FLIP ANOTHER DECK CARD AND PROMPT USER TO MAKE ANOTHER BET
// 

// PSEUDO FOR STEPS TO TAKE (NO ORDER):
/* 
    1) Define required Constants
    2) Define requied variables used to track the state of the game
    3) Store elements on the page that will be accessed in code more than once in variables 
    4) On load:
        4.1) Initialize the state variables
        4.2) 
        4.3)
    5) 



 */

const SUIT = {
    club: {
        name: 'club',
        symbol: '♣',
        color: 'black'
    },
    diamond: {
        name: 'diamond',
        symbol: '&diams;',
        color: 'red'
    },
    spade: {
        name: 'spade',
        symbol: '&spades;',
        color: 'black'
    },
    heart: {
        name: 'heart',
        symbol: '&hearts;',
        color: 'red'
    }
};

const SUITS = [SUIT.club, SUIT.diamond, SUIT.spade, SUIT.heart];

const RANK = {
    ace: {
        name: 'ace',
        symbol: 'A',
        value: 1
    },
    two: {
        name: 'two',
        symbol: '2',
        value: 2
    },
    three: {
        name: 'three',
        symbol: '3',
        value: 3
    },
    four: {
        name: 'four',
        symbol: '4',
        value: 4
    },
    five: {
        name: 'five',
        symbol: '5',
        value: 5
    },
    six: {
        name: 'six',
        symbol: '6',
        value: 6
    },
    seven: {
        name: 'seven',
        symbol: '7',
        value: 7
    },
    eight: {
        name: 'eight',
        symbol: '8',
        value: 8
    },
    nine: {
        name: 'nine',
        symbol: '9',
        value: 9
    },
    ten: {
        name: 'ten',
        symbol: '10',
        value: 10
    },
    jack: {
        name: 'jack',
        symbol: 'J',
        value: 11
    },
    queen: {
        name: 'queen',
        symbol: 'Q',
        value: 12
    },
    king: {
        name: 'king',
        symbol: 'K',
        value: 13
    }
};

const RANKS = [RANK.ace, RANK.two, RANK.three, RANK.four, RANK.five, RANK.six, RANK.seven, RANK.eight, RANK.nine, RANK.ten, RANK.jack, RANK.queen, RANK.king];

class Card {
    constructor(el, { suit, rank }) {
        this.$el = el
        this.suit = suit
        this.rank = rank
        this.render()
    }
    
    html(options = {}) {
        if (!this.suit || !this.rank) {
            return $('<div class="card empty">')
        }

        if (options.flipped) {
            const template = $("#card-back").html()
            return $('<div class="card">').html(template)
        }
    
        const template = $(`#card-${this.rank.name}`).html()
            .replace(new RegExp('{suit.symbol}', 'g'), this.suit.symbol)
            .replace(new RegExp('{suit.name}', 'g'), this.suit.name)
        const card = $('<div class="card">').html(template)
        card.find('div').addClass(this.suit.name)
        
        return card
    }

    render(el, options) {
        $(el || this.$el).html(this.html(options))

        return this
    }
}

class Hand {
    constructor(el, { suit, flipped, col }) {
        this.$el = $(el)
        this.cards = suit ? this.makeHand(suit) : []
        this.flipped = flipped
        this.col = col
        this.render()
    }

    makeHand(suit) {
        let cards = []
        RANKS.forEach((rank) => {
            cards.push(new Card(null, { suit, rank }))
        })
        return cards
    }

    length() {
        return this.cards.length
    }

    shuffle() {
        shuffle(this.cards)
        return this
    }

    takeCard(rank) {
        let card
        
        if (rank) {
            const cardIndex = this.cards.findIndex(card => card.rank.name === rank)
            card = this.cards.splice(cardIndex, 1)[0]
        } else {
            card = this.cards.pop()
        }
        
        this.render()

        return card
    }

    addCard(card) {
        this.cards.push(card)
        return this.render()
    }

    empty() {
        this.cards = []
    }

    value() {
        return this.cards.reduce((sum, card) => sum + card.rank.value, 0)
    }

    render(el, { flipped = this.flipped } = {}) {
        const $el = $(el || this.$el)

        if (flipped) {
            if (this.cards.length > 0) {
                this.cards[0].render($el, { flipped })
            } else {
                new Card($el, {})
            }    
        } else {
            $el.empty()
            this.cards.forEach((card) => {
                $('<div>').attr('class', this.col ? 'col' : 'col-card').html(card.html()).appendTo($el)
            })
        }

        return this
    }
}

class Modal {
    constructor({ title, body }) {
        this.$el = $('#modal')
        this.$el.find('.modal-title').html(title)
        this.$el.find('.modal-body').html(body)
    }

    show() {
        this.$el.find('button').on('click', () => this.hide())
        this.modal = new bootstrap.Modal(this.$el[0], {
            backdrop: 'static', keyboard: false
        })
        this.modal.show()
    }

    hide() {
        this.modal.hide()
        if (this.closeHandler) this.closeHandler()
    }

    onClose(callback) {
        this.closeHandler = callback
    }
}

class ChooseSuitModal {
    constructor() {
        this.$el = $('#chooseSuit')
    }

    show() {     
        this.modal = new bootstrap.Modal(this.$el[0], {
            backdrop: 'static', keyboard: false
        })
        this.$el.find('button').on('click', (e) => {
            const suit = $(e.target).attr('id')
            this.modal.hide()
            if (this.closeHandler) this.closeHandler(suit)
        })
        this.modal.show()
    }

    hide() {
        this.modal.hide()
        if (this.closeHandler) this.closeHandler()
    }

    onClose(callback) {
        this.closeHandler = callback
    }
}

// based on https://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

let playerHand, computerHand, deck, discard, prize
let emptyCard = new Card(null, {})
let playerScore = 0, computerScore = 0

function makeComputerBid(prizeCard) {
    let computerBid = computerHand.takeCard()
    computerBid.render('#computer-bid', { flipped: true }, )
    emptyCard.render('#player-bid')
    prize.addCard(prizeCard)
    $('#player-hand').on('click', '.card', makePlayerBidHandler(computerBid))
}

function getPlayerBid(target) {
    const $card = $(target).hasClass('card') ? $(target) : $(target).closest('.card')
    const rank = $card.find('div')[0].classList[0].split('-')[1]
    return playerHand.takeCard(rank)
}

function renderScores() {
    $('#computer-score').text(computerScore)
    $('#player-score').text(playerScore)
}

function makePlayerBidHandler(computerBid) {
    return (e) => {
        const playerBid = getPlayerBid(e.target)
        playerBid.render('#player-bid')
        computerBid.render('#computer-bid')
        $("#player-hand").off('click', '.card')
        $('#game-board').on('click', makeScoreHandler(playerBid, computerBid))
    }
}

function makeScoreHandler(playerBid, computerBid) {
    return () => {
        $('#game-board').off('click')
        
        if (computerBid.rank.value > playerBid.rank.value) {
            computerScore += prize.value()
            prize.empty()
        } else if (computerBid.rank.value < playerBid.rank.value) {
            playerScore += prize.value()
            prize.empty()
        }

        renderScores()

        if (deck.length() > 0) {
            makeComputerBid(deck.takeCard())
        } else {
            emptyCard.render('#prize')
            emptyCard.render('#computer-bid')
            emptyCard.render('#player-bid')
            showWinner()
        }
    }
}

function showWinner() {
    let modal
    if (computerScore > playerScore) {
        modal = new Modal({ title: "Game over", body: "You lost" })
    } else if (playerScore > computerScore) {
        modal = new Modal({ title: "Congratulations!", body: "You won" })
    } else {
        modal = new Modal({ title: "It's draw", body: "Play again?" })
    }
    modal.show()
}

function chooseSuit() {
    // render bids
    emptyCard.render('#prize')
    emptyCard.render('#computer-bid')
    emptyCard.render('#player-bid')

    let modal = new ChooseSuitModal()
    modal.onClose((suit) => startGame(SUIT[suit]))
    modal.show()
}

function startGame(playerSuit) {
    playerHand = new Hand('#player-hand', { suit: playerSuit })
    let suits = shuffle(SUITS.filter(suit => suit != playerSuit))
    computerHand = new Hand('#computer-hand', { suit: suits.pop() }).shuffle()
    deck = new Hand('#deck', { suit: suits.pop(), flipped: true }).shuffle()
    discard = new Hand('#discard', { suit: suits.pop(), flipped: true })
    prize = new Hand('#prize', { col: true })
    playerScore = 0
    computerScore = 0

    $('#game-board').off('click')
    $('#player-hand').off('click')

    renderScores()
    // console.log(deck.cards)
    makeComputerBid(deck.takeCard())
}

$('#start-game').on('click', () => chooseSuit())

chooseSuit()