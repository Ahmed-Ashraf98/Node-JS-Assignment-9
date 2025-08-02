import { NoteModal } from "../../DB/Models/note.model.js";
import { responseHandler } from "../../Utils/Common/responseHandler.js";
import httpStatus from "../../Utils/Common/httpStatus.js";

export const validateNote = async (req, res, next) => {
  const noteID = req.params.noteId;
  const note = await NoteModal.findById(noteID);
  if (!note) {
    next("Note Id does not exists");
  }
  next();
};

export const validateOwner = async (req, res, next) => {
  const userId = req.tokenObj.id;
  const noteId = req.params.noteId || req.params.id;
  const noteObj = await NoteModal.findOne({ _id: noteId, userId });

  if (!noteObj) {
    next("You are not the owner of the Note");
  }

  req.noteRecord = noteObj;
  next();
};
