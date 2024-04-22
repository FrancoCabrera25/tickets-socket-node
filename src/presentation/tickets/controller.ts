import { Request, Response } from 'express';

export class TicketController {
    constructor() {}

    public getTickets = async (req: Request, res: Response) => {
        res.json('getTickets');
    };

    public getLastTicketNumber = async (req: Request, res: Response) => {
        res.json('getLastTicketNumber');
    };

    public pendingTickets = async (req: Request, res: Response) => {
        res.json('pendingTickets');
    };

    public createTickets = async (req: Request, res: Response) => {
        res.json('createTickets');
    };

    public drawTicket = async (req: Request, res: Response) => {
        res.json('drawTicket');
    };

    public ticketFinished = async (req: Request, res: Response) => {
        res.json('ticketFinished');
    };

    public workingOn = async (req: Request, res: Response) => {
        res.json('workingOn');
    };
}
