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
        symbol: 'A'
    },
    two: {
        name: 'two',
        symbol: '2'
    },
    three: {
        name: 'three',
        symbol: '3'
    },
    four: {
        name: 'four',
        symbol: '4'
    },
    five: {
        name: 'five',
        symbol: '5'
    },
    six: {
        name: 'six',
        symbol: '6'
    },
    seven: {
        name: 'seven',
        symbol: '7'
    },
    eight: {
        name: 'eight',
        symbol: '8'
    },
    nine: {
        name: 'nine',
        symbol: '9'
    },
    ten: {
        name: 'ten',
        symbol: '10'
    },
    jack: {
        name: 'jack',
        symbol: 'J'
    },
    queen: {
        name: 'queen',
        symbol: 'Q'
    },
    king: {
        name: 'king',
        symbol: 'K'
    }
};

const RANKS = [RANK.ace, RANK.two, RANK.three, RANK.four, RANK.five, RANK.six, RANK.seven, RANK.eight, RANK.nine, RANK.ten, RANK.jack, RANK.queen, RANK.king];

class Card {
    constructor({ suit, rank }) {
        this.suit = suit
        this.rank = rank
    }
    
    render({ flipped = false } = {}) {
        if (flipped) {
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
}
  
function makeHand(suit) {
    let hand = []
    RANKS.forEach((rank) => {
        hand.push(new Card({ suit, rank }))
    })
    return hand
}

// https://stackoverflow.com/a/2450976
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

let playerHand = makeHand(SUIT.spade)
let computerHand = makeHand(SUIT.heart)
let deck = shuffle(makeHand(SUIT.spade))
let discard = makeHand(SUIT.diamond)

playerHand.forEach((card) => {
    $('<div class="col-card">').html(card.render()).appendTo("#player-hand")
})

// deck.forEach((card) => {
//     $("#deck").append(card.render({ flipped: true }))
// })
$('#deck').html(deck[0].render({ flipped: true }))
$('#discard').html(discard[0].render({ flipped: true }))
$('#prize').html(deck[1].render())

$('#computer-bid').html(computerHand[0].render())
$('#player-bid').html(playerHand[1].render())


