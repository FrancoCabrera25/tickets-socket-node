const lblPending = document.querySelector('#lbl-pending');
const deskHeader = document.querySelector('h1');
const ticketAlert = document.querySelector('.alert');
const lblCurrentTicket = document.querySelector('small');
const btnDraw = document.querySelector('#btn-draw');
const btnDone = document.querySelector('#btn-done');

const searchParams = new URLSearchParams(window.location.search);
let workingTicket = null;

if (!searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('Escritorio es requerido');
}

const deskNumber = searchParams.get('escritorio');

deskHeader.innerText = deskNumber;

function checkTicketCount(currentCount = 0) {
    if (currentCount === 0) {
        ticketAlert.classList.remove('d-none');
    } else {
        ticketAlert.classList.add('d-none');
    }

    lblPending.innerHTML = currentCount;
}

async function loadInitialCount() {
    const pendingTickets = await fetch('api/ticket/pending').then((resp) => resp.json());
    checkTicketCount(pendingTickets.length);
}

function connectToWebSockets() {
    const socket = new WebSocket('ws://localhost:3000/ws');

    socket.onmessage = (event) => {
        console.log(event.data);
        const { type, payload } = JSON.parse(event.data);
        if (type !== 'on-ticket-count-changed') return;
        checkTicketCount(payload);
    };

    socket.onclose = (event) => {
        console.log('Connection closed');
        setTimeout(() => {
            console.log('retrying to connect');
            connectToWebSockets();
        }, 1500);
    };

    socket.onopen = (event) => {
        console.log('Connected');
    };
}

async function getTickets() {
    await finishTicket();
    const ticket = await fetch(`/api/ticket/draw/${deskNumber}`).then((resp) => resp.json());
    /*   console.log(resp); */
    workingTicket = ticket;
    lblCurrentTicket.innerText = ticket.number;
    /*   if (status === 'error') {
        lblCurrentTicket.innerText = message;
    }

    workingTicket = ticket;
    lblCurrentTicket.innerText = ticket.number; */
}

async function finishTicket() {
    if (!workingTicket) return;

    const { status } = await fetch(`/api/ticket/done/${workingTicket.id}`, {
        method: 'PUT',
    }).then((resp) => resp.json());

    workingTicket = null;
    lblCurrentTicket.innerText = 'Nadie';
}

btnDraw.addEventListener('click', getTickets);
btnDone.addEventListener('click', finishTicket);

loadInitialCount();
connectToWebSockets();
