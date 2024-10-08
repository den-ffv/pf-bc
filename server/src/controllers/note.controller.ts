import { Request, Response } from 'express';
import prisma from "../utils/prisma";

import { Note } from "../utils/type";

class NoteController {

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const notes: Note[] = await prisma.note.findMany();
      const count: number =  await prisma.note.count();
      return res.status(201).json({notes, count});
    }catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Unable to fetch notes" });
    }
  }

  async getOne(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const note = await prisma.note.findUnique({ where: { id } });
      if (!note) {
        return res.status(404).json({ error: "Note not found" });
      }
      return res.json(note);
    }catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error fetching note" });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {

      const { createdAt, updatedAt, ...data  } = req.body;

      const newNote = await prisma.note.create({
        data: {
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      return res.json(newNote);
    }catch(error) {
      console.error(error);
      return res.status(500).json({ error: "Error creating note" });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try{
      const id  = Number(req.params.id);
      const { updatedAt, ...data  } = req.body;

      const updateNote = await prisma.note.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date()
        }
      });
      return res.json(updateNote);
    }catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error updating note" });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      await prisma.note.delete({ where: { id } });
      return res.status(204).send("Note deleted");
    }catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Error deleting note" });
    }
  }
}

export default new NoteController();